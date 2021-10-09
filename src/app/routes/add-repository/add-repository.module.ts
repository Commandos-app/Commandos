import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { AddRepositoryRoutingModule } from './add-repository-routing.module';
import { AddRepositoryComponent } from './add-repository.component';
import { CloneComponent } from './clone/clone.component';
import { NewComponent } from './new/new.component';



@NgModule({
    declarations: [AddRepositoryComponent, NewComponent, CloneComponent],
    imports: [
        SharedModule,
        AddRepositoryRoutingModule
    ],
})
export class AddRepositoryModule { }
