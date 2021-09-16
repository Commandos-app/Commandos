import { NotificationComponent } from './components/notification/notification.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { OverlayModule } from '@angular/cdk/overlay';
import { CdkTreeModule } from '@angular/cdk/tree';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FilterModule } from '@josee9988/filter-pipe-ngx';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { AngularSplitModule } from 'angular-split';
import { AutosizeModule } from 'ngx-autosize';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NgxTippyModule } from 'ngx-tippy-wrapper';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';
import { ClarityIconsModule } from './clarity-icons.module';
import { BranchAheadBehindComponent } from './components/branch-ahead-behind/branch-ahead-behind.component';
import { ButtonControlComponent } from './components/button-control/button-control.component';
import { CommanderModalComponent } from './components/commander/commander-modal/commander-modal.component';
import { CommanderComponent } from './components/commander/commander.component';
import { DiffLineByLineComponent } from './components/diff/diff-line-by-line/diff-line-by-line.component';
import { DiffSideBySideComponent } from './components/diff/diff-side-by-side/diff-side-by-side.component';
import { DiffComponent } from './components/diff/diff.component';
import { HeaderComponent } from './components/header/header.component';
import { SelectHintComponent } from './components/select-hint/select-hint.component';
import { SplashComponent } from './components/splash/splash.component';
import { SplitLayoutComponent } from './components/split-layout/split-layout.component';
import { SubnavComponent } from './components/subnav/subnav.component';
import { TreeViewComponent } from './components/tree-view/tree-view.component';
import { UpdateModalComponent } from './components/update-modal/update-modal.component';
import { DiffPipe } from './directives/diff.pipe';
import { DateFormatePipe } from './pipe/date-formate.pipe';

const components = [

    CommanderComponent,
    CommanderModalComponent,
    ButtonControlComponent,
    TreeViewComponent,
    SplashComponent,
    HeaderComponent,
    SubnavComponent,
    SplitLayoutComponent,
    BranchAheadBehindComponent,
    SelectHintComponent,
    UpdateModalComponent,
    NotificationComponent,
    // Diff
    DiffComponent,
    DiffLineByLineComponent,
    DiffSideBySideComponent,
    // Pipe
    DateFormatePipe,
    DiffPipe

];

const modules = [
    // Angular
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    // ReactiveFormsModule,

    // CDK
    OverlayModule,
    CdkTreeModule,
    ClipboardModule,
    DragDropModule,

    // Clarity
    // CdsModule,
    ClarityIconsModule,

    // Thirdparty
    TranslateModule,
    NgSelectModule,
    NgxTippyModule,
    AutosizeModule,
    FilterModule,
    AngularSplitModule,

    VirtualScrollerModule,
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
