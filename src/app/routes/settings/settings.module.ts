import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { SharedModule } from '@shared/shared.module';


@NgModule({
    declarations: [SettingsComponent],
    imports: [
        SharedModule,
        SettingsRoutingModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SettingsModule { }
