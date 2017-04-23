export interface TreeNode {
    id: string;
    text: string;
    ngClass?: string;
    children: TreeNode[] | null;
    expanded?: boolean;
    loading?: boolean;
    checked?: boolean | undefined;
}

export interface LazyLoadEvent {
    node: TreeNode;
    done: () => void;
}