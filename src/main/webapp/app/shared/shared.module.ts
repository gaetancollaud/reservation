import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DatePipe } from '@angular/common';

import {
    ReservationSharedLibsModule,
    ReservationSharedCommonModule,
    CSRFService,
    AuthServerProvider,
    AccountService,
    UserService,
    StateStorageService,
    LoginService,
    Principal,
    HasAnyAuthorityDirective,
} from './';
import {DatetimePipe} from './filters/datetime.pipe';

@NgModule({
    imports: [
        ReservationSharedLibsModule,
        ReservationSharedCommonModule
    ],
    declarations: [
        HasAnyAuthorityDirective,
        DatetimePipe
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
        DatetimePipe
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class ReservationSharedModule {}
