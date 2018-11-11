import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { ResourceTypeComponent } from './resource-type.component';
import { ResourceTypeDetailComponent } from './resource-type-detail.component';
import { ResourceTypePopupComponent } from './resource-type-dialog.component';
import { ResourceTypeDeletePopupComponent } from './resource-type-delete-dialog.component';

export const resourceTypeRoute: Routes = [
    {
        path: 'resource-type',
        component: ResourceTypeComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'reservationApp.resourceType.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'resource-type/:id',
        component: ResourceTypeDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'reservationApp.resourceType.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const resourceTypePopupRoute: Routes = [
    {
        path: 'resource-type-new',
        component: ResourceTypePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'reservationApp.resourceType.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'resource-type/:id/edit',
        component: ResourceTypePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'reservationApp.resourceType.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'resource-type/:id/delete',
        component: ResourceTypeDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'reservationApp.resourceType.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
