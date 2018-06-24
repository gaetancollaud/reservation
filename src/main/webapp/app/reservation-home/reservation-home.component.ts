import {Component, OnInit} from '@angular/core';
import {ReservationHomeDatastoreService} from './reservation-home-datastore.service';
import {LoginService, Principal} from '../shared';
import {JhiEventManager} from 'ng-jhipster';

@Component({
    selector: 'jhi-reservation-home',
    templateUrl: './reservation-home.component.html',
    styleUrls: [
        'reservation-home.scss'
    ]

})
export class ReservationHomeComponent implements OnInit {

    constructor(public datastore: ReservationHomeDatastoreService,
    private principal: Principal,
    private loginService: LoginService,
    private eventManager: JhiEventManager) {
    }

    ngOnInit() {
        // this.principal.identity().then((account) => {
        //     //
        // });
        this.datastore.start();
    }

}
