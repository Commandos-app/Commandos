import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { RepositoryRoutingModule } from './repository-routing.module';
import { RepositoryComponent } from './repository.component';
import { SharedModule } from '@shared/shared.module';
import { RepositoryBranchComponent } from './repository-branch/repository-branch.component';
import { RepositoryCommitComponent } from './repository-commit/repository-commit.component';
import { RepositoryHistoryComponent } from './repository-history/repository-history.component';
import { RepositorySettingComponent } from './repository-setting/repository-setting.component';
import { TextFieldModule } from '@angular/cdk/text-field';
import { RepositoryHistoryCommitComponent } from './repository-history/repository-history-commit/repository-history-commit.component';

@NgModule({
    declarations: [
        RepositoryComponent,
        RepositoryBranchComponent,
        RepositoryCommitComponent,
        RepositoryHistoryComponent,
        RepositorySettingComponent,
        RepositoryHistoryCommitComponent,
    ],
    imports: [
        SharedModule,
        RepositoryRoutingModule,
        TextFieldModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RepositoryModule { }
