export function sortByProperty(property: string) {

    return (a: any, b: any) => { return a[property].localeCompare(b[property], undefined, { sensitivity: 'base' }); };
}
