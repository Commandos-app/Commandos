import { NavLessLayoutComponent } from './../../layout/nav-less/nav-less.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ErrorPageComponent } from './error-page.component';

const routes: Routes = [
    {
        path: '',
        component: NavLessLayoutComponent,
        children: [
            {
                path: '',
                component: ErrorPageComponent

            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ErrorPageRoutingModule { }
