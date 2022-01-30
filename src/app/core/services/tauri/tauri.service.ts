import { Injectable } from '@angular/core';
import { getVersion } from '@tauri-apps/api/app';
import { checkUpdate, UpdateResult } from '@tauri-apps/api/updater';
import { appWindow, getCurrent } from '@tauri-apps/api/window';
import { BehaviorSubject } from 'rxjs';

type WindowState = 'maximized' | 'minimized' | 'windowed';

@Injectable({
    providedIn: 'root',
})
export class TauriService {
    private windowState = new BehaviorSubject<WindowState>('windowed');
    windowState$ = this.windowState.asObservable();

    isPinned = false;

    constructor() {
        const win = getCurrent();
        win.listen('tauri://resize', async (e) => {
            const maxed = await appWindow.isMaximized();

            if (maxed) {
                this.windowState.next('maximized');
            } else {
                this.windowState.next('windowed');
            }
        });
    }

    async minimize(): Promise<void> {
        await appWindow.minimize();
    }

    async maximize(): Promise<void> {
        await appWindow.maximize();
    }

    async unmaximize(): Promise<void> {
        await appWindow.unmaximize();
    }

    async closeClient(): Promise<void> {
        appWindow.close();
    }

    async tooglePin(): Promise<void> {
        this.isPinned = !this.isPinned;
        appWindow.setAlwaysOnTop(this.isPinned);
    }

    async getVersion(): Promise<string> {
        return getVersion();
    }

    async checkUpdate(): Promise<UpdateResult> {
        try {
            return checkUpdate();
        } catch (error) {
            console.log(error);
            return null;
        }
    }
}
