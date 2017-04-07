# Angular 4 Tree
Angular 4 Tree

# How To Install
1. npm install --save-dev a4-tree

# How To Use
In your <code>app.module.ts</code>
```typescript
@NgModule({
    imports: [
        ...
        TreeModule.forRoot(),
        ...
    ],
```

```html
<ng2tree [root]="root"></ng2tree>
```

root must be a TreeNode

# Tree Node interface
```typescript
export interface TreeNode {
    id: string;
    text: string;
    ngClass: string;
    children: TreeNode[] | null;
    expanded?: boolean;
    loading?: boolean;
}
```