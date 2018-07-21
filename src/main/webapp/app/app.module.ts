import './vendor.ts';

import {Injector, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {Ng2Webstorage} from 'ngx-webstorage';
import {JhiEventManager} from 'ng-jhipster';

import {AuthExpiredInterceptor} from './blocks/interceptor/auth-expired.interceptor';
import {ErrorHandlerInterceptor} from './blocks/interceptor/errorhandler.interceptor';
import {NotificationInterceptor} from './blocks/interceptor/notification.interceptor';
import {ReservationSharedModule, UserRouteAccessService} from './shared';
import {ReservationAppRoutingModule} from './app-routing.module';
import {HomeModule} from './home/home.module';
import {ReservationAdminModule} from './admin/admin.module';
import {ReservationEntityModule} from './entities/entity.module';
import {PaginationConfig} from './blocks/config/uib-pagination.config';
import {StateStorageService} from './shared/auth/state-storage.service';
// jhipster-needle-angular-add-module-import JHipster will add new module here
import {
	ActiveMenuDirective,
	ErrorComponent,
	FooterComponent,
	JhiMainComponent,
	NavbarComponent,
	PageRibbonComponent,
	ProfileService
} from './layouts';
import {ReservationHomeModule} from './reservation-home';

@NgModule({
	imports: [
		BrowserModule,
		ReservationAppRoutingModule,
		Ng2Webstorage.forRoot({prefix: 'jhi', separator: '-'}),
		ReservationSharedModule,
		HomeModule,
		ReservationHomeModule,
		ReservationAdminModule,
		ReservationEntityModule,
		// jhipster-needle-angular-add-module JHipster will add new module here
	],
	declarations: [
		JhiMainComponent,
		NavbarComponent,
		ErrorComponent,
		PageRibbonComponent,
		ActiveMenuDirective,
		FooterComponent
	],
	providers: [
		ProfileService,
		PaginationConfig,
		UserRouteAccessService,
		{
			provide: HTTP_INTERCEPTORS,
			useClass: AuthExpiredInterceptor,
			multi: true,
			deps: [
				StateStorageService,
				Injector
			]
		},
		{
			provide: HTTP_INTERCEPTORS,
			useClass: ErrorHandlerInterceptor,
			multi: true,
			deps: [
				JhiEventManager
			]
		},
		{
			provide: HTTP_INTERCEPTORS,
			useClass: NotificationInterceptor,
			multi: true,
			deps: [
				Injector
			]
		}
	],
	bootstrap: [JhiMainComponent]
})
export class ReservationAppModule {
}
