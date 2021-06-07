export class Branch {
    ref!: string;
    name!: string;
    upstream!: string;
    ahead!: string;
    behind!: string;
    current!: boolean;
}
export type Branches = Array<Branch>;

export const branchFormaterObject = {
    ref: '%(refname)',
    name: '%(refname:short)',
    upstream: '%(upstream:short)',
}
