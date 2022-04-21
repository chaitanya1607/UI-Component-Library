export const HTTP_CONSTANTS = {
	HTTP_HEADERS: {
		LOCALE_HTTP_HEADER: 'Accept-Language',
		CONTENT_TYPE: 'Content-Type',
		ACCEPT: 'Accept'
	}
};

export enum HttpCallType {
	POST = 'POST',
	PUT = 'PUT',
	GET = 'GET'
}

export const JSON_CONTENT_TYPE = [
	{
		key: 'Content-Type',
		value: 'application/json'
	},
	{
		key: 'Accept',
		value: 'application/json'
	}
];