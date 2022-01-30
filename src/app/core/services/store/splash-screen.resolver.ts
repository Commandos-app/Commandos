import { StoreService } from './store.service';
import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class SplashScreenResolver implements Resolve<boolean> {
    private subject = new BehaviorSubject(true);
    state$ = this.subject.asObservable();

    constructor(private storeService: StoreService) {}

    stop() {
        this.subject.next(false);
    }

    async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        await this.storeService.loadSettings();

        this.stop();
        return true;
    }
}
