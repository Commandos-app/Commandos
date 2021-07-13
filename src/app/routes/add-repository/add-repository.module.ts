import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { AddRepositoryRoutingModule } from './add-repository-routing.module';
import { AddRepositoryComponent } from './add-repository.component';



@NgModule({
    declarations: [AddRepositoryComponent],
    imports: [
        SharedModule,
        AddRepositoryRoutingModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AddRepositoryModule { }
