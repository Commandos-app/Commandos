import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { appWindow } from '@tauri-apps/api/window.js';

type WindowState = 'fullscreen' | 'minimized' | 'windowed';

@Injectable({
    providedIn: 'root'
})
export class TauriService {

    private windowState = new BehaviorSubject<WindowState>('windowed')
    windowState$ = this.windowState.asObservable();

    constructor() {
        this.windowState.subscribe(val => console.log(val))
        window.addEventListener('resize', () => {
            if (this.windowState.getValue() === 'fullscreen') {
                this.windowState.next('windowed');
            }
        });
    }

    async minimize(): Promise<void> {
        await appWindow.minimize();
        // this.windowState.next('minimized');
    }

    async maximize(): Promise<void> {
        await appWindow.maximize();
        this.windowState.next('fullscreen');
    }

    async unmaximize(): Promise<void> {
        await appWindow.unmaximize();
        this.windowState.next('windowed');
    }

    async closeClient(): Promise<void> {
        appWindow.close();
    }
}
