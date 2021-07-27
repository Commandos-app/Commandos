import { environment } from '@env/environment';
import { SplashScreenResolver } from '@core/services';
import { Component, OnInit } from '@angular/core';
import { filter, first } from 'rxjs/operators';
import { Noise } from './noise';

@Component({
    selector: 'commander-splash',
    templateUrl: './splash.component.html',
    styleUrls: ['./splash.component.scss']
})
export class SplashComponent implements OnInit {
    id = "tsparticles";

    // The screen starts with the maximum opacity
    opacityChange = 1;
    splashTransition: string;
    // First access the splash is visible
    showSplash = true;

    noise = new Noise();
    noiseZ: any;
    size: any;
    columns: any;
    rows: any;
    w: any;
    h: any;
    field: any;
    noiseZIncrement: any;
    container: any;

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
        setTimeout(() => {
            // After the transition is ended the showSplash will be hided
            this.opacityChange = 0;
            this.showSplash = false;
        }, environment.splashDuration);
    }

    particlesOptions: any = {
        fps_limit: 60,
        emitters: {
            life: {
                count: 1,
                duration: 10
            },
            position: {
                x: 50,
                y: 50
            },
            rate: {
                delay: 0.1,
                quantity: 10
            },
            size: {
                width: 100,
                height: 100,
                mode: "precise"
            }
        },
        particles: {
            color: {
                value: "#000"
            },
            move: {
                trail: {
                    enable: true,
                    fillColor: "#247bae",
                    length: 20
                },
                bounce: false,
                direction: "none",
                enable: true,
                out_mode: "out",
                random: false,
                speed: 0.1,
                straight: false,
                warp: true,
                noise: {
                    enable: true,
                    delay: {
                        value: 0.1
                    }
                }
            },
            number: { density: { enable: true, value_area: 800 }, value: 0 },
            opacity: {
                anim: { enable: false, opacity_min: 0.1, speed: 1, sync: false },
                random: true,
                value: 0.5
            },
            shape: {
                polygon: { nb_sides: 5 },
                stroke: { color: "random", width: 0 },
                type: "circle"
            },
            size: {
                value: 1
            }
        },
        retina_detect: true
    };

    // particlesLoaded(container: Container): void {
    //     console.log(container);
    // }

    // particlesInit(main: Main): void {
    //     console.log(main);

    //     // Starting from 1.19.0 you can add custom presets or shape here, using the current tsParticles instance (main)
    // }
    getAngle(x: number, y: number) {
        return this.noise.simplex3(x / Math.PI, y / Math.PI, this.noiseZ) * Math.PI * 2;
    }

    getLength(x: number, y: number) {
        return this.noise.simplex3(x / 100, y / 100, this.noiseZ);
    }
    particlesInit(main: any) {
        console.log(`TCL: ~ file: splash.component.ts ~ line 138 ~ SplashComponent ~ particlesInit ~ main`, main);

    }
    setup(container: any) {
        this.size = 20;
        this.noiseZ = 0;
        this.noiseZIncrement = 0.005;
        this.container = container;
        this.reset();
        window.addEventListener("resize", this.reset);
    }

    initField() {
        this.field = new Array(this.columns);
        for (let x = 0; x < this.columns; x++) {
            this.field[x] = new Array(this.columns);
            for (let y = 0; y < this.rows; y++) {
                this.field[x][y] = [0, 0];
            }
        }
    }

    calculateField() {
        for (let x = 0; x < this.columns; x++) {
            for (let y = 0; y < this.rows; y++) {
                let angle = this.getAngle(x, y);
                let length = this.getLength(x, y);
                this.field[x][y][0] = angle;
                this.field[x][y][1] = length;
            }
        }
    }

    reset() {
        const pxRatio = window.devicePixelRatio;
        this.w = this.container.canvas.size.width;
        this.h = this.container.canvas.size.width;
        this.noise.seed(Math.random());
        this.columns = Math.floor(this.w / this.size) + 1;
        this.rows = Math.floor(this.h / this.size) + 1;
        this.initField();
    }
}
