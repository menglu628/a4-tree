import { TreeNodeComponent } from './../tree-node/tree-node.component';
import { TreeNode, LazyLoadEvent } from './../interface/treenode.interface';
import { Component, OnInit, Input, ChangeDetectionStrategy, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'ng2tree',
  template: `
<ul>
  <tree-node *ngIf="root" [checkbox]="checkbox" [node]="root" [tree]="me" [level]="0" [selected]="selected"></tree-node>
</ul>
  `,
  styles: [`
:host >>> ul {
  margin: 0;
  font-size: 1em;
  user-select: none;
  display: block;
  overflow: hidden;
}

:host >>> i.expandCollapse {
  width: 1em;
  cursor: pointer;
}

:host >>> i.nodeClass {
  width: 1em;
  margin: 0 0.25em 0 0.5em;
}

:host >>> i.yellow {
  color: NavajoWhite;
}

:host >>> li:hover {
  background-color: rgba(0,0,0,0.1);
}

ul >>> li {
  list-style-type: none;
  margin: 0.175em 0;
}

ul >>> li > span {
  padding: 0.25em;
  cursor: pointer;
}

ul >>> span.active {
  background-color: palegreen;
  border: 1px dotted;
}
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TreeComponent {

  @Input() root: TreeNode;
  @Input() checkbox: boolean | 'tristate';
  @Input() selected: TreeNode;
  @Output() selectedChange = new EventEmitter<TreeNode>();
  @Output() lazyLoad = new EventEmitter<LazyLoadEvent>();

  get me(): TreeComponent {
    return this;
  }

  doLazyLoad(node: TreeNode, treeNode: TreeNodeComponent) {
    this.lazyLoad.emit({
      node, done: () => {
        node.expanded = true;
        treeNode.update();
      }
    });
  }

  doSelect(node: TreeNode) {
    this.selectedChange.emit(node);
  }

}