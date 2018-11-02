import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {ReservationSharedModule} from '../shared';

import {ReservationSearchComponent} from './reservation-search/reservation-search.component';
import {ReservationListComponent} from './reservation-list/reservation-list.component';
import {ReservationHomeDatastoreService} from './reservation-home-datastore.service';
import {RESERVATION_HOME_ROUTES} from './reservation-home.route';
import {ReservationHomeComponent} from './reservation-home.component';
import {
	UserReservationDeleteDialogComponent,
	UserReservationDeletePopupComponent
} from './reservation-operation/user-reservation-delete-dialog.component';
import {
	UserReservationDialogComponent,
	UserReservationPopupComponent
} from './reservation-operation/user-reservation-dialog.component';
import {UserReservationPopupService} from './user-reservation-popup.service';
import {
	MatDatepickerModule,
	MatFormFieldModule,
	MatInputModule,
	MatNativeDateModule,
	MatSelectModule
} from '@angular/material';

@NgModule({
	imports: [
		ReservationSharedModule,
		RouterModule.forChild(RESERVATION_HOME_ROUTES),

		MatFormFieldModule,
		MatDatepickerModule,
		MatSelectModule,
		MatNativeDateModule,
		MatInputModule
	],
	declarations: [
		ReservationHomeComponent,
		ReservationSearchComponent,
		ReservationListComponent,

		UserReservationDeleteDialogComponent,
		UserReservationDeletePopupComponent,

		UserReservationDialogComponent,
		UserReservationPopupComponent,
	],
	entryComponents: [
		ReservationHomeComponent,
		UserReservationDeleteDialogComponent,
		UserReservationDialogComponent,
	],
	providers: [
		ReservationHomeDatastoreService,
		UserReservationPopupService
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ReservationHomeModule {
}
