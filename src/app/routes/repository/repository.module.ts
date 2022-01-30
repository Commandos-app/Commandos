import { TextFieldModule } from '@angular/cdk/text-field';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { RepositoryBranchComponent } from './repository-branch/repository-branch.component';
import { RepositoryCommitComponent } from './repository-commit/repository-commit.component';
import { RepositoryHistoryCommitComponent } from './repository-history/repository-history-commit/repository-history-commit.component';
import { RepositoryHistoryComponent } from './repository-history/repository-history.component';
import { RepositoryRoutingModule } from './repository-routing.module';
import { RepositorySettingComponent } from './repository-setting/repository-setting.component';
import { RepositoryComponent } from './repository.component';

@NgModule({
    declarations: [
        RepositoryComponent,
        RepositoryBranchComponent,
        RepositoryCommitComponent,
        RepositoryHistoryComponent,
        RepositorySettingComponent,
        RepositoryHistoryCommitComponent,
    ],
    imports: [SharedModule, RepositoryRoutingModule, TextFieldModule],
})
export class RepositoryModule {}
