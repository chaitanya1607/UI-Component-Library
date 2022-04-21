import { Injectable } from '@angular/core';
import { Logger, LoggerUtils } from '@utilities/angular-utils';
import { differenceWith, flatten, isEmpty, isEqual } from 'lodash';
import { EMPTY, forkJoin, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Message } from '../../models/common.model';
import { ServiceInvoker } from '../../service-invoker/service-invoker.service';
import { LocaleService } from '../../services/locale/locale.service';
import { DomUtils } from '../../utilities/dom-utils';

const CONTENT_SERVICE_DATA = {
	// Contains the messages for the context.First map's key is 'context' and value is a Map.
	// Second map's key is 'locale' value are the messages
	_contextMessagesMap: new Map<string, Map<string, Message[]>>(),
	_commonMessageMap: new Map<string, Message[]>(),
	allMessages: new Array<any>()
};

const COMMON_CONTEXT = 'common';
@Injectable({
	providedIn: 'root'
})
export class ContentService {

	private _logger: Logger = LoggerUtils.getInstance('ContentService');

	constructor(private _serviceInvoker: ServiceInvoker, private _localeService: LocaleService) {
	}

	/**
	 * Load all the messages required for the provided `context`. This method has to be called before the `context`
	 * is ready
	 * @param context - The context for which we have to get the messages. Example for context could be moduleId
	 * @param locale - The locale for which we need to get the messages. The locale is optional, if not provided
	 * 				 we will get the details from the @see LocaleService
	 * @returns {Observable<boolean>}
	 *
	 * @memberOf MessageService
	 */
	public loadMessages(context: string, locale?: string, contexts?: string[]): Observable<Message[]> {

		if (isEmpty(context) && isEmpty(contexts)) {
			return EMPTY;
		}

		locale = (!locale) ? this._localeService.getLocale() : locale;

		let allRequestContexts = !isEmpty(context) ? [context] : [];
		allRequestContexts = isEmpty(contexts) ? allRequestContexts : allRequestContexts.concat(contexts);

		this._logger.debug(`getting the messages for contexts [${allRequestContexts.join(',')}], locale [${locale}]`);

		return this._getMessagesForContexts(allRequestContexts, locale);
	}

	/**
	 * Before calling this method, the loadMessage method should be called.
	 * @param key - Message key
	 * @param locale  - The locale for which we need message
	 * @param contextName - Name of the context , default is common
	 */
	public getMessage(key: string, locale?: string, contextName?: string): Message {

		locale = locale || this._localeService.getLocale();

		let messageForKey: Message;

		if (!contextName) {
			// search in all the contexts
			messageForKey = this._searchKeyInAllContexts(key, locale);
		} else {
			messageForKey = this._searchKeyInContext(contextName, key, locale);
		}

		if (!messageForKey) {
			this._logger.warn(`could not find message for the key [${key}] and locale [${locale}] in context [${contextName}].\
      Available contexts are ${(this._getAllCachedContexts() || []).join(',')}`);
		}

		return messageForKey;
	}

	public getAllMessages(): Message[] {
		return CONTENT_SERVICE_DATA.allMessages;
	}

	public getAllMessagesByKeys(keys: string[]): Message[] {
		const requiredMessages: Message[] = [];
		CONTENT_SERVICE_DATA.allMessages.forEach((message) => {
			if (keys.includes(message.key)) {
				requiredMessages.push(message);
			}
		});
		if (keys.length !== requiredMessages.length) {
			// there are some missing keys
			this._printMissingKeys(keys, requiredMessages);
		}
		return requiredMessages;
	}

	private _getMessagesForContexts(contexts: string[], locale?: string): Observable<Message[]> {

		const contextMessageMap = this._getMessagesFromCacheForContexts(contexts, locale);

		// only those contexts that are there in the map will be added as keys
		const contextsInCache = [...contextMessageMap.keys()];

		// these are the contexts for which we need to request the messages for.
		const contextsNotInCache: string[] = differenceWith(contexts, contextsInCache, isEqual);

		if (isEmpty(contextsNotInCache)) {
			// we have messages in cache for all the contexts
			this._logger.debug(`messages are there in cache for ALL the contexts [${contexts.join(',')}] given`);

			const messagesFromCache = this._getAllMessagesFromContextMap(contextMessageMap);
			// tslint:disable-next-line: deprecation
			return of<Message[]>(messagesFromCache);
		}

		// in this case we have certain contexts that are NOT there in cache.. so let's get them
		this._logger.debug(`these contexts are not there in cache [${contextsNotInCache.join(',')}]`);
		return forkJoin(
			contextsNotInCache.map((_context) => {
				return this._getMessageFromAPI(_context, locale);
			})
		).pipe(
			map(messages => flatten(messages) as Message[]),
			map(messages => messages = messages.concat(this._getAllMessagesFromContextMap(contextMessageMap))),
			tap((messages) => this._printDuplicates(messages, contexts))
		);
	}

	private _getAllMessagesFromContextMap(contextMessageMap: Map<string, Message[]>): Message[] {
		const messages = [...contextMessageMap.keys()].reduce((previousValue, _context) => {
			previousValue = previousValue.concat(contextMessageMap.get(_context));
			return previousValue;
		}, [] as Message[]);

		return messages;
	}

	private _printDuplicates(messages: Message[], contexts: string[]) {

		const lookup = messages.reduce((previousValue, message) => {
			previousValue[message.text] = ++previousValue[message.text] || 0;
			return previousValue;
		}, {});

		const duplicates = messages.filter(message => lookup[message.text]);

		if (!isEmpty(duplicates)) {
			this._logger.warn(`duplicates in contexts [${contexts.join(',')}]`, duplicates);
		}

	}

	private _getMessageFromAPI(context: string, locale?: string): Observable<Message[]> {
		const parameters = {
			jsonFileName: `${context}-messages-${locale}.json`,
			version: DomUtils.getVersion().buildTS
		};

		return this._serviceInvoker.invokeService('get-messages', parameters).pipe(
			map((response) => this._cacheMessages(context, locale, response)));
	}

	private _printMissingKeys(requestedMessgeKeys: string[], messagesToBeReturned: Message[]) {
		const messageKeysToBeReturned = messagesToBeReturned.map(message => message.code);
		const missingKeys = differenceWith(requestedMessgeKeys, messageKeysToBeReturned, isEqual) || [];
		this._logger.warn(`missing message keys are [${missingKeys.join(',')}]`);
	}

	private _cacheMessages(contextName: string, locale: string, messages: Message[]): Message[] {
		if (isEmpty(messages)) { return []; }
		CONTENT_SERVICE_DATA.allMessages = CONTENT_SERVICE_DATA.allMessages.concat(messages);
		this._logger.debug(`caching messages [${messages.length}] of context [${contextName}] and locale [${locale}]`);

		// key is the locale
		const messagesForLocale: Map<string, Message[]> = new Map();
		messagesForLocale.set(locale, messages);

		if (contextName === COMMON_CONTEXT) {
			CONTENT_SERVICE_DATA._commonMessageMap.set(locale, messages);
		} else {
			// contextMessagesMap stores the localeMessage against the Context (string)
			CONTENT_SERVICE_DATA._contextMessagesMap.set(contextName, messagesForLocale);
		}
		return messages;
	}

	private _getMessagesFromCacheForContexts(contexts: string[], locale: string): Map<string, Message[]> {
		const contextMap: Map<string, Message[]> = new Map();
		contexts.forEach((contextName) => {
			const messageForContext = this._getMessagesFromCache(contextName, locale);

			// will add to the Map only if there is message in this context available in the cache.
			if (!isEmpty(messageForContext)) {
				contextMap.set(contextName, messageForContext);
			}
		});
		return contextMap;
	}

	private _getMessagesFromCache(contextName: string, locale: string): Message[] {
		const messages: Message[] = (this._isCommonContext(contextName)) ? this._getMessagesFromCommonContextCache(locale)
			: this._getMessageFromContextCache(contextName, locale);
		return messages;
	}

	private _getMessageFromContextCache(contextName: string, locale: string): Message[] {
		// first get the contextSpecificMap from cache
		const messageLocaleMap = CONTENT_SERVICE_DATA._contextMessagesMap.get(contextName);

		if (messageLocaleMap && messageLocaleMap.size > 0) {
			return messageLocaleMap.get(locale);
		}
	}

	private _getMessagesFromCommonContextCache(locale: string): Message[] {
		return CONTENT_SERVICE_DATA._commonMessageMap.get(locale);
	}

	private _isCommonContext(contextName: string): boolean {
		return contextName === COMMON_CONTEXT;
	}


	private _getAllCachedContexts(): string[] {
		const contexts = [COMMON_CONTEXT, ...CONTENT_SERVICE_DATA._contextMessagesMap.keys()];
		return contexts;
	}

	private _searchKeyInAllContexts(key: string, locale: string): Message {
		const cachedContexts = this._getAllCachedContexts();

		if (isEmpty(cachedContexts)) {
			this._logger.warn('There are no cached contexts available, make sure that loadMessage() is called');
			return;
		}

		let matchedMessage: Message;

		cachedContexts.every((contextName) => {
			matchedMessage = this._searchKeyInContext(contextName, key, locale);
			if (matchedMessage) {
				return false;
			} else {
				return true;
			}
		});

		return matchedMessage;
	}

	private _searchKeyInContext(contextName: string, key: string, locale: string): Message {
		// first check in common context
		const messagesInContext = this._getMessagesFromCache(contextName, locale);

		let matchedMessage: Message;
		if (!isEmpty(messagesInContext)) {
			matchedMessage = messagesInContext.find(message => message.code === key);
			return matchedMessage;
		} else {
			return;
		}
	}
}
