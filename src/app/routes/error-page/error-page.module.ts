import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ErrorPageRoutingModule } from './error-page-routing.module';
import { ErrorPageComponent } from './error-page.component';


@NgModule({
    declarations: [ErrorPageComponent],
    imports: [
        CommonModule,
        ErrorPageRoutingModule
    ]
})
export class ErrorPageModule { }
