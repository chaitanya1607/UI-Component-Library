import { JSONPath } from 'jsonpath-plus';

export class JSONPathUtils {
  static getPathToProperty(parentId: string, propertyName: string | number, isArray = false) {
    propertyName = (typeof propertyName === 'string') ? (/\s/.test(propertyName) ? `['${propertyName}']` : propertyName) : propertyName;
    if (isArray) {
      return `${parentId}[${propertyName}]`;
    } else {
      return `${parentId}.${propertyName}`;
    }
  }

  /**
   * @description returns the parent path for the given path
   * @example
   * parent of 'a.b[11].c' is 'a.b[11]'
   * parent of 'a.b[11]' is 'a.b'
   * parent of 'a.b[*]' is 'a.b'
   * parent of 'a.b' is 'a'
   */
  static getParentPathFor(path: string) {
    if (!path) {
      return;
    }
    const arrayItemRegexp = /\[[0-9*]*]$/;
    if (arrayItemRegexp.test(path)) {
      return path.substring(0, path.lastIndexOf('['));
    } else {
      return path.substring(0, path.lastIndexOf('.'));
    }
  }

  /**
   *
   * @param jsonText a valid json string
   */
  public static isJsonSchema(jsonText: string): boolean {
    return (jsonText.includes('$id') && jsonText.includes('$schema')) ? true : false;
  }

  public static isWildArrayJsonPath(individualPathStr: string) {
    return individualPathStr.match(new RegExp('\\[\\*\\]$'));
  }

  public static isArrayIndexJsonPath(individualPathStr: string) {
    return individualPathStr.match(new RegExp('\\[[0-9]*\\]$'));
  }

  public static isDefiniteJsonPath(individualPathStr: string) {
    return !(JSONPathUtils.isWildArrayJsonPath(individualPathStr) && JSONPathUtils.isArrayIndexJsonPath(individualPathStr));
  }

  /**
   * Read the json value in the jsonData for the provided jsonPath.
   * @param jsonPath
   * @param jsonData
   * @returns
   */
  public static readValue<T>(jsonPath: string, jsonData: any): T {
    const values: any[] = JSONPath({ path: jsonPath, json: jsonData });
    return values && values.length > 0 ? values[0] : undefined;
  }

  /**
   * Extract jsonPath till the first found the arrayPath & its index seperately.
   * Ex: for path1.path2[0].path3
   *    arrayIndex: 0
   *    arrayPath: path1.path2
   */
  public static extractArrayNameAndIndex(jsonPath: string): { arrayIndex: number, arrayPath: string } {
    const arrayPath: string = jsonPath.substring(0, jsonPath.indexOf('['));
    const arrayIndex = Number.parseInt(jsonPath.substring(jsonPath.indexOf('[') + 1, jsonPath.indexOf(']')));
    return {
      arrayIndex, arrayPath
    }
  }

}
