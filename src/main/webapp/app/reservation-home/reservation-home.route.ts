import {Route} from '@angular/router';

import {ReservationHomeComponent} from './';

export const RESERVATION_HOME_ROUTE: Route = {
	path: '',
	component: ReservationHomeComponent,
	data: {
		authorities: [],
		pageTitle: 'reservation-home.title'
	}
};
