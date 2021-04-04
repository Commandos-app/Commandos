import { DiffPipe } from './pipe/diff.pipe';
import { SplashComponent } from './components/splash/splash.component';
import { DateFormatePipe } from './pipe/date-formate.pipe';
import { TreeViewComponent } from './components/tree-view/tree-view.component';
import { CommanderModalComponent } from './components/commander/commander-modal/commander-modal.component';
import { ButtonControlComponent } from './components/button-control/button-control.component';
import { CommanderComponent } from './components/commander/commander.component';


import { ClarityIconsModule } from './clarity-icons.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';

import { WebviewDirective } from './directives/';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AutosizeModule } from 'ngx-autosize';

import { FilterModule } from '@josee9988/filter-pipe-ngx';

import { OverlayModule } from '@angular/cdk/overlay';
import { CdkTreeModule } from '@angular/cdk/tree';
import { ClipboardModule } from '@angular/cdk/clipboard';

import { NgScrollbarModule } from 'ngx-scrollbar';

import { NgxTippyModule } from 'ngx-tippy-wrapper';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';



const components = [

    WebviewDirective,
    CommanderComponent,
    CommanderModalComponent,
    ButtonControlComponent,
    TreeViewComponent,
    SplashComponent,

    DateFormatePipe,
    DiffPipe

];

const modules = [
    // Angular
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    ReactiveFormsModule,

    // CDK
    OverlayModule,
    CdkTreeModule,
    ClipboardModule,

    // Clarity
    // CdsModule,
    ClarityIconsModule,

    // Thirdparty
    TranslateModule,
    NgSelectModule,
    NgxTippyModule,
    AutosizeModule,
    FilterModule,

    VirtualScrollerModule
];

@NgModule({
    declarations: [
        ...components
    ],
    imports: [
        ...modules,
        NgScrollbarModule.withConfig({
            visibility: 'hover'
        })
    ],
    exports: [
        ...modules,
        ...components,
        NgScrollbarModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule { }
