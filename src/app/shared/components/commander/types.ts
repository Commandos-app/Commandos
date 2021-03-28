import { RepositoriesSettings } from "@core/services";

export type AvailableCommands =
    'executeMerge' | 'executePull' | 'executePush' |
    'executeCreateBranch' | 'executeDeleteBranch' | 'executeSync';

export type FieldDefinition = {
    type: 'string' | 'branch';
    name: string;
    label: string;
    value?: any;
}

export type RegisterCommandOptions = {
    name: string;
    icon: string;
    direction?: string;
    fields?: Array<FieldDefinition>;
    command: AvailableCommands;
};

export type CommanderModalOptions = {
    title: string;
    fields: Array<FieldDefinition>;
}

export type CommandParams = {
    repos: RepositoriesSettings;
    formData: any;
}

export type SelectType = 'Tag' | 'Repository' | 'All';

export type SelectedRepositoryTypes = {
    type: SelectType;
    text: string;
    id?: number;
};



