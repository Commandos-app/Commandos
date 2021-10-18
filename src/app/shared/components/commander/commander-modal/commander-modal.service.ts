import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { commandosModalOptions, CommandParams, FieldDefinition } from '../types';

@Injectable({
    providedIn: 'root'
})
export class commandosModalService {

    open = false;
    title = 'not Set!';
    fields: Array<FieldDefinition> = [];

    private onClose = new Subject<CommandParams>();

    constructor() { }

    openModal(options: commandosModalOptions): Observable<CommandParams> {
        this.open = true;
        this.title = options.title;
        if (options.fields) {
            this.fields = JSON.parse(JSON.stringify(options.fields));
        }
        this.onClose = new Subject<CommandParams>();
        return this.onClose.asObservable();
    }

    closeModal(): void {
        this.open = false;
        this.onClose.complete();
    }

    run(params: CommandParams): void {
        this.onClose.next(params);
    }

    preventKeyboardShortcuts(): boolean {
        return this.open;
    }

}
