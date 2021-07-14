export class Branch {
    ref!: string;
    name!: string;
    logicalName!: string;
    upstream!: string;
    ahead!: string;
    behind!: string;
    current!: boolean;
    isRemote!: boolean;
}
export type Branches = Array<Branch>;

export const branchFormaterObject = {
    ref: '%(refname)',
    name: '%(refname:short)',
    upstream: '%(upstream:short)',
}
