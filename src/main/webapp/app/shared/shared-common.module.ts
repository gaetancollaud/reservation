import {NgModule, LOCALE_ID} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {registerLocaleData} from '@angular/common';
import locale from '@angular/common/locales/en';

import {
	ReservationSharedLibsModule,
	JhiLanguageHelper,
	FindLanguageFromKeyPipe,
	JhiAlertComponent,
	JhiAlertErrorComponent
} from './';

@NgModule({
	imports: [
		ReservationSharedLibsModule
	],
	declarations: [
		FindLanguageFromKeyPipe,
		JhiAlertComponent,
		JhiAlertErrorComponent
	],
	providers: [
		JhiLanguageHelper,
		Title,
		{
			provide: LOCALE_ID,
			useValue: 'fr'
		},
	],
	exports: [
		ReservationSharedLibsModule,
		FindLanguageFromKeyPipe,
		JhiAlertComponent,
		JhiAlertErrorComponent
	]
})
export class ReservationSharedCommonModule {
	constructor() {
		registerLocaleData(locale);
	}
}
