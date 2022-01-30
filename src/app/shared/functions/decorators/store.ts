export function Store(defaultValue: any) {
    return function (target: any, propertyKey: string) {
        if (!propertyKey) {
            throw new Error('Property key is required');
        }
        const key = propertyKey.toLocaleLowerCase();

        const getter = function () {
            // @ts-ignore
            return this['get'](key, defaultValue);
        };

        const setter = function (newVal: string) {
            // @ts-ignore
            this['set'](key, newVal);
        };

        Object.defineProperty(target, propertyKey, {
            get: getter,
            set: setter,
        });
    };
}
