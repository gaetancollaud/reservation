import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {RouterModule} from '@angular/router';

import {ReservationSharedModule} from '../../shared';
import {ReservationAdminModule} from '../../admin/admin.module';
import {
	ReservationService,
	ReservationPopupService,
	ReservationComponent,
	ReservationDetailComponent,
	ReservationDialogComponent,
	ReservationPopupComponent,
	ReservationDeletePopupComponent,
	ReservationDeleteDialogComponent,
	reservationRoute,
	reservationPopupRoute,
} from './';

const ENTITY_STATES = [
	...reservationRoute,
	...reservationPopupRoute,
];

@NgModule({
	imports: [
		ReservationSharedModule,
		ReservationAdminModule,
		RouterModule.forChild(ENTITY_STATES)
	],
	declarations: [
		ReservationComponent,
		ReservationDetailComponent,
		ReservationDialogComponent,
		ReservationDeleteDialogComponent,
		ReservationPopupComponent,
		ReservationDeletePopupComponent,
	],
	entryComponents: [
		ReservationComponent,
		ReservationDialogComponent,
		ReservationPopupComponent,
		ReservationDeleteDialogComponent,
		ReservationDeletePopupComponent,
	],
	providers: [
		ReservationService,
		ReservationPopupService,
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ReservationReservationModule {
}
