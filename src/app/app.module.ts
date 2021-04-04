
import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { SharedModule } from '@shared/shared.module';

import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppComponent } from './app.component';

import '@cds/core/alert/register.js';
import '@cds/core/button/register.js';
import '@cds/core/checkbox/register.js';
import '@cds/core/forms/register.js';
import '@cds/core/input/register.js';
import '@cds/core/select/register.js';
import '@cds/core/textarea/register.js';
import '@cds/core/accordion/register.js';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,

        FormsModule,
        HttpClientModule,
        SharedModule,
        AppRoutingModule,

        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        })
    ],
    providers: [],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
