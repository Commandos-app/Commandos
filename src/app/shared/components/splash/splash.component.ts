import { SplashScreenResolver } from '@core/services';
import { Component, OnInit } from '@angular/core';
import { filter, first } from 'rxjs/operators';

@Component({
    selector: 'commander-splash',
    templateUrl: './splash.component.html',
    styleUrls: ['./splash.component.scss']
})
export class SplashComponent implements OnInit {

    // The screen starts with the maximum opacity
    opacityChange = 1;
    splashTransition: string;
    // First access the splash is visible
    showSplash = true;

    constructor(private splashScreenResolver: SplashScreenResolver) { }

    async ngOnInit(): Promise<void> {
        this.splashScreenResolver.state$
            .pipe(
                filter(a => a),
                first()
            )
            .subscribe(res => {
                this.hideSplashAnimation();
            });
    }


    private hideSplashAnimation() {
        // Setting the transition
        this.opacityChange = 0;
        setTimeout(() => {
            // After the transition is ended the showSplash will be hided
            this.showSplash = false;
        }, 1000);
    }

}
