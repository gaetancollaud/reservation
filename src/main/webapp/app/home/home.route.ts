import {Route} from '@angular/router';

import {HomeComponent} from './';

export const HOME_ROUTE: Route = {
	path: 'old-home',
	component: HomeComponent,
	data: {
		authorities: [],
		pageTitle: 'home.title'
	}
};
