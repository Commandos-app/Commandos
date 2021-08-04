export function groupBy(x: any, f: Function) {
    const groupedObj = x.reduce((a: any, b: any) => {
        const key = f(b);
        a[key] ||= [];
        a[key].push(b);
        return a;
    }, {});

    return Object.keys(groupedObj).map(key => ({ title: key, repositories: groupedObj[key] }));
}
