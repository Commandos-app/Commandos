import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Error = {
    type: 'danger' | 'info' | 'warning' | 'success' | 'neutral',
    message: string,
    // eslint-disable-next-line @typescript-eslint/ban-types
    callback: Function

}

@Injectable({
    providedIn: 'root'
})
export class ErrorService {

    private hasError = new BehaviorSubject<Error | null>(null);
    hasError$ = this.hasError.asObservable();

    constructor() { }

    setError(error: Error): void {
        this.hasError.next(error);
    }

    clearError(): void {
        this.hasError.next(null);
    }
}
