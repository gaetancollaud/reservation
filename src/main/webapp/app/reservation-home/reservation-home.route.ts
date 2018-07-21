import {Routes} from '@angular/router';

import {ReservationHomeComponent} from './';
import {UserRouteAccessService} from '../shared';
import {UserReservationPopupComponent} from './reservation-operation/user-reservation-dialog.component';
import {ReservationDeletePopupComponent} from '../entities/reservation';

export const RESERVATION_HOME_ROUTES: Routes = [
	{
		path: '',
		component: ReservationHomeComponent,
		data: {
			authorities: [],
			pageTitle: 'reservation-home.title'
		}
	},
	{
		path: 'user-reservation-new',
		component: UserReservationPopupComponent,
		data: {
			authorities: ['ROLE_RESERVATION_USE'],
			pageTitle: 'reservationApp.reservation.home.title'
		},
		canActivate: [UserRouteAccessService],
		outlet: 'popup'
	},
	{
		path: 'user-reservation/:id/edit',
		component: UserReservationPopupComponent,
		data: {
			authorities: ['ROLE_RESERVATION_USE'],
			pageTitle: 'reservationApp.reservation.home.title'
		},
		canActivate: [UserRouteAccessService],
		outlet: 'popup'
	},
	{
		path: 'user-reservation/:id/delete',
		component: ReservationDeletePopupComponent,
		data: {
			authorities: ['ROLE_RESERVATION_USE'],
			pageTitle: 'reservationApp.reservation.home.title'
		},
		canActivate: [UserRouteAccessService],
		outlet: 'popup'
	}
];
