import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { appWindow, getCurrent } from '@tauri-apps/api/window';
import { $ } from 'protractor';


type WindowState = 'maximized' | 'minimized' | 'windowed';

@Injectable({
    providedIn: 'root'
})
export class TauriService {

    private windowState = new BehaviorSubject<WindowState>('windowed');
    windowState$ = this.windowState.asObservable();

    isPinned = false;

    constructor() {
        const win = getCurrent();
        win.listen('tauri://resize', async (e) => {
            const maxed = await appWindow.isMaximized();
            console.log(`TCL: ~ file: tauri.service.ts ~ line 23 ~ TauriService ~ win.listen ~ maxed`, maxed);

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
}
