import { NgModule } from '@angular/core';

import { DetailRoutingModule } from './detail-routing.module';

import { DetailComponent } from './detail.component';
import { SharedModule } from '@shared/shared.module';
import { LayoutModule } from '@layout/layout.module';

@NgModule({
    declarations: [DetailComponent],
    imports: [
        SharedModule,
        DetailRoutingModule,
        LayoutModule
    ]
})
export class DetailModule { }
