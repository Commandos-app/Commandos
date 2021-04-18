export interface IBranch {
    name: string;
    upstream: string;
    ref: string;
}
export type IBranches = Array<IBranch>;
