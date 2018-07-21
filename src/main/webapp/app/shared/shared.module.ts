import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {DatePipe} from '@angular/common';

import {
	AccountService,
	AuthServerProvider,
	CSRFService,
	HasAnyAuthorityDirective,
	LoginService,
	Principal,
	ReservationSharedCommonModule,
	ReservationSharedLibsModule,
	StateStorageService,
	UserService,
} from './';
import {DatetimePipe} from './filters/datetime.pipe';
import {UsernamePipe} from './filters/username.pipe';

@NgModule({
	imports: [
		ReservationSharedLibsModule,
		ReservationSharedCommonModule
	],
	declarations: [
		HasAnyAuthorityDirective,
		DatetimePipe,
		UsernamePipe
	],
	providers: [
		LoginService,
		AccountService,
		StateStorageService,
		Principal,
		CSRFService,
		AuthServerProvider,
		UserService,
		DatePipe
	],
	exports: [
		ReservationSharedCommonModule,
		HasAnyAuthorityDirective,
		DatePipe,
		DatetimePipe,
		UsernamePipe
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class ReservationSharedModule {
}
