import { TreeComponent } from './../tree/tree.component';
import { TreeNode } from './../interface/treenode.interface';
import { Component, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

export enum NodeType { branchExpanded, branchCollapsed, leaf }

@Component({
  selector: 'tree-node',
  template: `
<li [style.paddingLeft]="paddingLeft" (click)="doSelect()" (dblclick)="doToggle($event)">
  <i class="expandCollapse fa" [ngClass]="nodeStateClass" (click)="doToggle($event)"></i>
  <i class="nodeClass" [ngClass]="nodeClass"></i>
  <i *ngIf="checkbox" class="checkbox fa" [ngClass]="checkStatus" (click)="doToggleCheckBox($event)" (dblclick)="doToggleCheckBox($event)"></i>
  <span [class.active]="isSelected">{{node.text}}</span>
</li>
<ul *ngIf="!!node.expanded && !!node.children" [@height]>
  <tree-node *ngFor="let child of node.children" [node]="child" [tree]="tree" [level]="level+1" [selected]="selected" [checkbox]="checkbox" [parent]="me"></tree-node>
</ul>
  `,
  styles: [`
.checkbox {
  width: 1.5em;
  text-align: center;
}
`],
  // changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('height', [
      transition(':enter', [style({ height: 0 }), animate('250ms ease-in', style({ height: '*' }))]),
      transition(':leave', animate('250ms ease-out', style({ height: 0 })))
    ])
  ]
})
export class TreeNodeComponent {

  @Input() node: TreeNode;
  @Input() tree: TreeComponent;
  @Input() level: number;
  @Input() selected: TreeNode;
  @Input() checkbox: boolean | 'tristate';
  @Input() parent: TreeNodeComponent;

  constructor(private changeDetectorRef: ChangeDetectorRef) { }

  get paddingLeft(): string {
    return `${this.level * 1}em`;
  }

  get nodeType(): NodeType {
    if (this.node.children === null) {
      return NodeType.branchCollapsed;
    }

    if (this.node.children.length === 0) {
      return NodeType.leaf;
    }

    return !!this.node.expanded ? NodeType.branchExpanded : NodeType.branchCollapsed;
  }

  get nodeStateClass(): string {
    switch (this.nodeType) {
      case NodeType.branchExpanded:
        return 'fa-minus-square-o';

      case NodeType.branchCollapsed:
        return 'fa-plus-square-o';
    }

    return '';
  }

  doToggle(event: MouseEvent) {
    event.stopPropagation();
    if (this.nodeType !== NodeType.leaf) {
      if (this.node.children === null) {
        // lazy loading
        this.tree.doLazyLoad(this.node, this);
      } else {
        this.node.expanded = !this.node.expanded;
      }
    }
  }

  update() {
    this.changeDetectorRef.markForCheck();
  }

  get nodeClass(): string {
    if (this.node.ngClass) {
      return this.node.ngClass;
    }

    switch (this.nodeType) {
      case NodeType.branchExpanded:
        return 'fa fa-folder-open yellow';

      case NodeType.branchCollapsed:
        return 'fa fa-folder yellow';

      default:
        return 'fa fa-file-o'
    }
  }

  get isSelected(): boolean {
    return this.selected === this.node;
  }

  doSelect() {
    this.tree.doSelect(this.node);
  }

  get checkStatus(): string {
    if (this.checkbox === true || this.node.children && this.node.children.length === 0) {
      return !!this.node.checked ? 'fa-check-square-o' : 'fa-square-o';
    }

    let allTrue = true;
    let allFalse = true;
    this.node.children.forEach(p => {
      allTrue = allTrue && p.checked;
      allFalse = allFalse && !p.checked;
    });
    if (allTrue) {
      return 'fa-check-square-o';
    }
    return allFalse ? 'fa-square-o' : 'fa-dot-circle-o';
  }

  doToggleCheckBox(e: MouseEvent) {
    e.stopPropagation();

    this.node.checked = !this.node.checked;
    this.doSetChildrenCheckStatus(this.node.children, this.node.checked);
    this.doSetParentCheckStatus(this.parent);
  }

  doSetChildrenCheckStatus(children: TreeNode[], status: boolean) {
    for (const child of children) {
      child.checked = status;
      this.doSetChildrenCheckStatus(child.children, status);
    }
  }

  doSetParentCheckStatus(component: TreeNodeComponent) {
    if (component) {
      const oldState = component.node.checked;
      component.node.checked = component.node.children.every(p => p.checked);
      if (oldState !== component.node.checked) {
        this.doSetParentCheckStatus(component.parent);
      }
    }
  }

  get me(): TreeNodeComponent {
    return this;
  }

}