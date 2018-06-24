import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ReservationSharedModule } from '../shared';

import { RESERVATION_HOME_ROUTE, ReservationHomeComponent } from './';
import { ReservationSearchComponent } from './reservation-search/reservation-search.component';
import { ReservationListComponent } from './reservation-list/reservation-list.component';
import {ReservationHomeDatastoreService} from './reservation-home-datastore.service';

@NgModule({
    imports: [
        ReservationSharedModule,
        RouterModule.forChild([ RESERVATION_HOME_ROUTE ])
    ],
    declarations: [
        ReservationHomeComponent,
        ReservationSearchComponent,
        ReservationListComponent,
    ],
    entryComponents: [
    ],
    providers: [
        ReservationHomeDatastoreService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ReservationHomeModule {}
