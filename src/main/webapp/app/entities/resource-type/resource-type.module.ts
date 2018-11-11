import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ReservationSharedModule } from '../../shared';
import {
    ResourceTypeService,
    ResourceTypePopupService,
    ResourceTypeComponent,
    ResourceTypeDetailComponent,
    ResourceTypeDialogComponent,
    ResourceTypePopupComponent,
    ResourceTypeDeletePopupComponent,
    ResourceTypeDeleteDialogComponent,
    resourceTypeRoute,
    resourceTypePopupRoute,
} from './';

const ENTITY_STATES = [
    ...resourceTypeRoute,
    ...resourceTypePopupRoute,
];

@NgModule({
    imports: [
        ReservationSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        ResourceTypeComponent,
        ResourceTypeDetailComponent,
        ResourceTypeDialogComponent,
        ResourceTypeDeleteDialogComponent,
        ResourceTypePopupComponent,
        ResourceTypeDeletePopupComponent,
    ],
    entryComponents: [
        ResourceTypeComponent,
        ResourceTypeDialogComponent,
        ResourceTypePopupComponent,
        ResourceTypeDeleteDialogComponent,
        ResourceTypeDeletePopupComponent,
    ],
    providers: [
        ResourceTypeService,
        ResourceTypePopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ReservationResourceTypeModule {}
