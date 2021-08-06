import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddRepositoryComponent } from './add-repository.component';
import { CloneComponent } from './clone/clone.component';
import { NewComponent } from './new/new.component';



const routes: Routes = [
    {
        path: '',
        component: AddRepositoryComponent,
        children: [
            { path: 'new', component: NewComponent },
            { path: 'clone', component: CloneComponent },
            { path: '', redirectTo: 'new', pathMatch: 'full' }
        ]

    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AddRepositoryRoutingModule { }
