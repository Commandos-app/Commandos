import { DOCUMENT } from '@angular/common';
import { Component, Inject, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { ErrorService, GitService, LoggerService, StoreService, TauriService } from '@core/services';
import { environment } from '@env/environment';
import { TranslateService } from '@ngx-translate/core';
import { commandosModalService, commandosService, ICommand } from '@shared/services';
import { listen } from '@tauri-apps/api/event';
import { UpdateResult } from '@tauri-apps/api/updater';

@Component({
    selector: 'commandos-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    devEnv: boolean = !environment.production;
    update: UpdateResult;
    hasUpdate: boolean = false;

    constructor(
        private translate: TranslateService,
        private logger: LoggerService,
        private commandosService: commandosService,
        private gitService: GitService,
        private router: Router,
        private errorService: ErrorService,
        @Inject(DOCUMENT) private document: Document,
        private renderer: Renderer2,
        public commandosModalService: commandosModalService,
        private storeService: StoreService,
        private tauriService: TauriService

    ) {
        this.load();
    }

    async load() {
        await this.storeService.loadSettings();
        this.gitService.registerGitCommands();
        this.translate.setDefaultLang('de');
        this.translate.use('de');

        this.logger.info(`Starting The commandos`);


        // if (!process.env.LOCAL_GIT_DIRECTORY) {
        //     this.errorService.setError({
        //         type: 'danger',
        //         message: 'Git executable is not set!',
        //         callback: () => { this.openSettings() }
        //     });
        // }

        this.setDarkMode();

        // Register commands for commandos
        this.registerToggleDarkModeCommand();
        this.registerSettingsCommand();
        this.registerNewRepoCommand();

        // listen<UpdateResult>("tauri://update-available", (res) => {

        // });

        this.update = await this.tauriService.checkUpdate();
        this.hasUpdate = this.update.shouldUpdate;

    }

    closeUpdate() {
        this.hasUpdate = false;
    }

    private setDarkMode() {
        if (this.storeService.DarkMode) {
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
        this.commandosService.registerCommand(command);
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
        this.commandosService.registerCommand(command);
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
        this.commandosService.registerCommand(command);
    }

    private toggleDarkMode(command: ICommand): void {
        this.storeService.DarkMode = !this.storeService.DarkMode;
        this.storeService.saveSettings();
        command.icon = this.getDarkModeIcon();
        this.setDarkMode();
    }

    private getDarkModeIcon(): string {
        return this.storeService.DarkMode ? 'sun' : 'moon';
    }
}
