import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { HomeRoutingModule } from './home-routing.module';

import { HomeComponent } from './home.component';
import { SharedModule } from '@shared/shared.module';


@NgModule({
    declarations: [HomeComponent],
    imports: [
        SharedModule,
        HomeRoutingModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomeModule { }
