import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { CommanderModalOptions, CommandParams, FieldDefinition } from '../types';

@Injectable({
    providedIn: 'root'
})
export class CommanderModalService {

    open = false;
    title = 'not Set!';
    fields: Array<FieldDefinition> = [];

    private onClose = new Subject<CommandParams>();

    constructor() { }

    openModal(options: CommanderModalOptions): Observable<CommandParams> {
        this.open = true;
        this.title = options.title;
        this.fields = JSON.parse(JSON.stringify(options.fields));
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
