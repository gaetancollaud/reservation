import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';

import { NgbDateMomentAdapter } from './util/datepicker-adapter';
import { ReservationSharedLibsModule, ReservationSharedCommonModule, HasAnyAuthorityDirective } from './';
import { UsernamePipe } from 'app/shared/filters/username.pipe';
import { DatetimePipe } from 'app/shared/filters/datetime.pipe';

@NgModule({
    imports: [ReservationSharedLibsModule, ReservationSharedCommonModule],
    declarations: [HasAnyAuthorityDirective, DatetimePipe, UsernamePipe],
    providers: [{ provide: NgbDateAdapter, useClass: NgbDateMomentAdapter }],
    exports: [ReservationSharedCommonModule, HasAnyAuthorityDirective, DatetimePipe, UsernamePipe],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ReservationSharedModule {}
