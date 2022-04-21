/**
 * All the utilities related to the dom are available here.
 */
export class DomUtils {

  public static readCookie(cookieName: string) {
    if (!document) {
      return;
    }
    const nameEQ = cookieName + '=';
    const ca = document.cookie.split(';');

    ca.forEach((c) => {
      while (c.charAt(0) === ' ') { c = c.substring(1, c.length); }
      if (c.indexOf(nameEQ) === 0) { return c.substring(nameEQ.length, c.length); }
    });

    return null;
  }

  public static setCookie(name: string, value: string, expiryDays: number, domain: string) {
    if (!document) {
      return;
    }
    const date = new Date();
    date.setTime(date.getTime() + expiryDays * 24 * 60 * 60 * 1000);

    const cValue = escape(value) + ('; expires=' + date.toUTCString()) + `;domain=${domain};path=/`;
    document.cookie = name + '=' + cValue;
  }

  public static getVersion(): { buildTS: string, version: string } {
		return {
			buildTS: (window as any).buildVersion || '',
			version: (window as any).appVersion || ''
		};
	}

}