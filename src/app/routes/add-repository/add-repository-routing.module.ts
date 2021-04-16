import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { AddRepositoryComponent } from './add-repository.component';

const routes: Routes = [
    {
        path: '',
        component: AddRepositoryComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AddRepositoryRoutingModule { }
