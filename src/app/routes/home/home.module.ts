import { NgModule } from '@angular/core';

import { HomeRoutingModule } from './home-routing.module';

import { HomeComponent } from './home.component';
import { SharedModule } from '@shared/shared.module';
import { LayoutModule } from '@layout/layout.module';

@NgModule({
    declarations: [HomeComponent],
    imports: [
        SharedModule,
        HomeRoutingModule,
        LayoutModule
    ]
})
export class HomeModule { }
