export interface Role {
    id: string;
    name: string;
    permissions: Array<string>;
    isActive: boolean;
}
