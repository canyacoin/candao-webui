import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminComponent } from './admin/admin.component';
import { SearchComponent } from './search/search.component';
import { PageNotFoundComponent } from './pagenotfound/pagenotfound.component';

const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'index.html',
        component: HomeComponent
    },
    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: 'dashboard',
        component: DashboardComponent
    },
    {
        path: 'search/:query',
        component: SearchComponent
    },
    {
        path: 'admin',
        component: AdminComponent
    },
    {
        path: '**',
        component: PageNotFoundComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, { useHash: false })
    ],
    exports: [
        RouterModule
    ],
    declarations: []
})
export class AppRoutingModule { }
