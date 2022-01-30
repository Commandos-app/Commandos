import { NgModule } from '@angular/core';
import { SharedModule } from './../../shared/shared.module';
import { ChangelogRoutingModule } from './changelog-routing.module';
import { ChangelogComponent } from './changelog.component';

@NgModule({
    declarations: [ChangelogComponent],
    imports: [SharedModule, ChangelogRoutingModule],
})
export class ChangelogModule {}
