import { SplashScreenResolver } from '@core/services';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
    },
    {
        path: '',
        children: [
            {
                path: 'home',
                loadChildren: () => import('./routes/home/home.module').then((m) => m.HomeModule),
            },
            { path: 'settings', loadChildren: () => import('./routes/settings/settings.module').then((m) => m.SettingsModule) },
            { path: 'detail', loadChildren: () => import('./routes/detail/detail.module').then((m) => m.DetailModule) },
            {
                path: 'add-repository',
                loadChildren: () => import('./routes/add-repository/add-repository.module').then((m) => m.AddRepositoryModule),
            },
            {
                path: 'repository',
                loadChildren: () => import('./routes/repository/repository.module').then((m) => m.RepositoryModule),
            },
            { path: 'about', loadChildren: () => import('./routes/about/about.module').then((m) => m.AboutModule) },
            {
                path: 'changelog',
                loadChildren: () => import('./routes/changelog/changelog.module').then((m) => m.ChangelogModule),
            },
            { path: '**', loadChildren: () => import('./routes/error-page/error-page.module').then((m) => m.ErrorPageModule) },
        ],
        resolve: { data: SplashScreenResolver },
    },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            enableTracing: false,
            paramsInheritanceStrategy: 'always',
            relativeLinkResolution: 'legacy',
            anchorScrolling: 'enabled',
            useHash: false,
        }),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
