export interface TreeNode {
    id: string;
    text: string;
    ngClass: string;
    children: TreeNode[] | null;
    expanded?: boolean;
    loading?: boolean;
}

export interface LazyLoadEvent {
    node: TreeNode;
    done: () => void;
}