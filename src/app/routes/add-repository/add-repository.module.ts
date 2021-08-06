import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { AddRepositoryRoutingModule } from './add-repository-routing.module';
import { AddRepositoryComponent } from './add-repository.component';
import { NewComponent } from './new/new.component';
import { CloneComponent } from './clone/clone.component';



@NgModule({
    declarations: [AddRepositoryComponent, NewComponent, CloneComponent],
    imports: [
        SharedModule,
        AddRepositoryRoutingModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AddRepositoryModule { }
