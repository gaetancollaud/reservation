import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { ReservationResourceTypeModule } from './resource-type/resource-type.module';
import { ReservationResourceModule } from './resource/resource.module';
import { ReservationReservationModule } from './reservation/reservation.module';
/* jhipster-needle-add-entity-module-import - JHipster will add entity modules imports here */

@NgModule({
    // prettier-ignore
    imports: [
        ReservationResourceTypeModule,
        ReservationResourceModule,
        ReservationReservationModule,
        /* jhipster-needle-add-entity-module - JHipster will add entity modules here */
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ReservationEntityModule {}
