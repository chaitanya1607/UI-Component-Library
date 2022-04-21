export class AnalyticsUtils {

  public static getNameFromId(id: string): string {
    const pgTitle: string[] = id.replace(/-/gi, ' ').replace(/#/gi, ' | ')?.toLowerCase().split(' ') || [];
    for (let i = 0; i < pgTitle.length; i++) {
      pgTitle[i] = pgTitle[i].charAt(0).toUpperCase() + pgTitle[i].slice(1);
    }
    return pgTitle.join(' ');
  }

  public static getPageDetailsFromName(name: string): {pageId: string, pageUrl: string} {
    const pageId = (name) ? `${name.replace(/ /g, '-')}` : '';
    const pageUrl = `${window.location.pathname}#${pageId}`;

    return {pageId, pageUrl};
  }
}
