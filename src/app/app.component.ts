import { CommanderModalService } from '@shared/services';
import { DOCUMENT } from '@angular/common';
import { Component, Inject, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { ErrorService, LoggerService, SettingsService, GitService } from '@core/services';
import { TranslateService } from '@ngx-translate/core';
import { CommanderService, ICommand } from '@shared/services';

@Component({
    selector: 'commander-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {


    constructor(
        private translate: TranslateService,
        private settingsService: SettingsService,
        private logger: LoggerService,
        private commanderService: CommanderService,
        private gitService: GitService,
        private router: Router,
        private errorService: ErrorService,
        @Inject(DOCUMENT) private document: Document,
        private renderer: Renderer2,
        public commanderModalService: CommanderModalService

    ) {
        this.gitService.registerGitCommands();
        this.settingsService.init();
        this.translate.setDefaultLang('de');
        this.translate.use('de');

        this.logger.trace(`Starting The Commander`);
        this.logger.debug(`Starting The Commander`);
        this.logger.info(`Starting The Commander`);
        this.logger.error(`Starting The Commander`);
        this.logger.warn(`Starting The Commander`);

        // if (!process.env.LOCAL_GIT_DIRECTORY) {
        //     this.errorService.setError({
        //         type: 'danger',
        //         message: 'Git executable is not set!',
        //         callback: () => { this.openSettings() }
        //     });
        // }

        this.setDarkMode();

        // Register commands for Commander
        this.registerToggleDarkModeCommand();
        this.registerSettingsCommand();
        this.registerNewRepoCommand();

        this.load();
    }

    load() {
        // const valu = invoke('getPath');
        // console.log(`TCL: ~ file: app.component.ts ~ line 62 ~ AppComponent ~ load ~ valu`, valu);
    }

    private setDarkMode() {
        if (this.settingsService.DarkMode) {
            this.renderer.setAttribute(this.document.body, 'cds-theme', 'dark');
        }
        else {
            this.renderer.setAttribute(this.document.body, 'cds-theme', '');
        }
    }

    registerSettingsCommand(): void {
        const command: ICommand = {
            name: 'Open settings',
            icon: 'cog',
            callback: () => { this.openSettings() }
        };
        this.commanderService.registerCommand(command);
    }

    private openSettings(): void {
        this.router.navigate(['/settings']);
    }


    registerNewRepoCommand(): void {
        const command: ICommand = {
            name: 'Add repository',
            icon: 'plus',
            callback: () => { this.openAddRepo() }
        };
        this.commanderService.registerCommand(command);
    }

    private openAddRepo(): void {
        this.router.navigate(['/add-repository']);
    }


    registerToggleDarkModeCommand(): void {
        const command: ICommand = {
            name: 'Toggle dark mode',
            icon: this.getDarkModeIcon(),
            callback: () => { this.toggleDarkMode(command) }
        }
        this.commanderService.registerCommand(command);
    }

    private toggleDarkMode(command: ICommand): void {
        this.settingsService.DarkMode = !this.settingsService.DarkMode;
        command.icon = this.getDarkModeIcon();
        this.setDarkMode();
    }

    private getDarkModeIcon(): string {
        return this.settingsService.DarkMode ? 'sun' : 'moon';
    }
}
