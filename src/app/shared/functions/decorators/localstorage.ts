export function LocalStorage(key: string) {
    return function (target: any, propertyKey: string) {
        if (!propertyKey) {
            throw new Error('Property key is required');
        }
        const key = propertyKey.toLocaleLowerCase();

        const getter = function () {
            return localStorage.getItem(key);
        };

        const setter = function (newVal: string) {
            newVal = newVal ? newVal : '';
            localStorage.setItem(key, newVal);
        };

        Object.defineProperty(target, propertyKey, {
            get: getter,
            set: setter,
        });
    };
}
