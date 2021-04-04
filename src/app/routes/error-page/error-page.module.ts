import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ErrorPageRoutingModule } from './error-page-routing.module';
import { ErrorPageComponent } from './error-page.component';


@NgModule({
    declarations: [ErrorPageComponent],
    imports: [
        CommonModule,
        ErrorPageRoutingModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ErrorPageModule { }
