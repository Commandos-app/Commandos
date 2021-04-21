import { RepositoryHistoryCommitComponent } from './repository-history/repository-history-commit/repository-history-commit.component';
import { RepositoryBranchComponent } from './repository-branch/repository-branch.component';
import { RepositorySettingComponent } from './repository-setting/repository-setting.component';
import { RepositoryHistoryComponent } from './repository-history/repository-history.component';
import { RepositoryCommitComponent } from './repository-commit/repository-commit.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RepositoryComponent } from './repository.component';

const routes: Routes = [
    {
        path: ':id',
        component: RepositoryComponent,
        children: [
            { path: 'commit', component: RepositoryCommitComponent },
            { path: 'branches', component: RepositoryBranchComponent },
            {
                path: 'history', component: RepositoryHistoryComponent,
                children: [
                    { path: ':sha', component: RepositoryHistoryCommitComponent }
                ]
            },
            { path: 'setting', component: RepositorySettingComponent },
            { path: '', redirectTo: 'branches', pathMatch: 'full' }
        ],


    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RepositoryRoutingModule { }
