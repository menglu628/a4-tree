import { TreeNodeComponent } from './tree-node/tree-node.component';
import { TreeComponent } from './tree/tree.component';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
    imports: [
        CommonModule,
        BrowserAnimationsModule
    ],
    exports: [
        TreeComponent
    ],
    declarations: [
        TreeComponent,
        TreeNodeComponent
    ]
})
export class TreeModule {

    static forRoot(): ModuleWithProviders {
        return {
            ngModule: TreeModule,
            providers: []
        };
    }

    static forChild(): ModuleWithProviders {
        return {
            ngModule: TreeModule,
            providers: []
        };
    }

}