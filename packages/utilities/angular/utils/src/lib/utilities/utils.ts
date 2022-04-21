import { isEmpty, isEqual, isObject, transform } from 'lodash';

export class Utils {

	public static replaceVariablesInString(stringData: string, objectWithValues: any): string {
		if (isEmpty(stringData) || isEmpty(objectWithValues) || isEmpty(Object.keys(objectWithValues))) {
			return stringData;
		}
		const keys: string[] = Object.keys(objectWithValues);

		keys.forEach((key) => {
			stringData = stringData.replace('{' + key + '}', objectWithValues[key]);
		});

		return stringData;
	}

	public static concatArrayIfNotNull(...arrays:any[]):any[]{
		return [].concat(...arrays.filter(Array.isArray));
	}

	/**
   * Deep diff between two object, using lodash
   * @param  {Object} object Object compared
   * @param  {Object} base   Object to compare with
   * @return {Object}        Return a new object who represent the diff
 */
	public static difference(object: any, base: any): any {
		const changes = (_object: any, _base: any) => {
			const accumulator = {};
			Object.keys(_base).forEach((key) => {
				if (_object[key] === undefined) {
					accumulator[`-${key}`] = _base[key];
				}
			});
			return transform(_object, (_accumulator, value: any, key: string) => {
				if (_base[key] === undefined) {
					_accumulator[`+${key}`] = value;
				} else if (!isEqual(value, _base[key])) {
					_accumulator[key] = (isObject(value) && isObject(_base[key])) ? changes(value, _base[key]) : value;
				}
			},
				accumulator
			);
		};
		return changes(object, base);
	}

  /**
   * deletes the given item from array if present
   * returns an array containing the deleted item
   */
  public static deleteItemFromArray<T>(item: T, array: T[]) {
    const index = array.indexOf(item);
    if (index !== -1) {
      return array?.splice(index, 1);
    }
  }
}
