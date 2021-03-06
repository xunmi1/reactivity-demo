export const objectToString = Object.prototype.toString;
export const toTypeString = (value: unknown): string => objectToString.call(value);

export const isObject = (val: unknown): val is Record<any, any> => val !== null && typeof val === 'object';
export const isPlainObject = (val: unknown): val is object => toTypeString(val) === '[object Object]';
export const isArray = Array.isArray;
export const isMap = (val: unknown): val is Map<any, any> => toTypeString(val) === '[object Map]';
export const isSet = (val: unknown): val is Set<any> => toTypeString(val) === '[object Set]';
export const isFunction = (val: unknown): val is Function => typeof val === 'function';
export const hasChanged = (value: any, oldValue: any): boolean => !Object.is(value, oldValue);
