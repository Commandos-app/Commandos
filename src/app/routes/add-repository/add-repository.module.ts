import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { AddRepositoryRoutingModule } from './add-repository-routing.module';
import { AddRepositoryComponent } from './add-repository.component';
import { SharedModule } from '@shared/shared.module';


@NgModule({
    declarations: [AddRepositoryComponent],
    imports: [
        SharedModule,
        AddRepositoryRoutingModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AddRepositoryModule { }
