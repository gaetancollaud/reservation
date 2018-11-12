import { Component, OnInit } from '@angular/core';
import { ReservationHomeDatastoreService } from '../reservation-home-datastore.service';
import * as moment from 'moment';

@Component({
    selector: 'jhi-reservation-list',
    templateUrl: './reservation-list.component.html',
    styleUrls: ['./reservation-list.component.css']
})
export class ReservationListComponent implements OnInit {
    public todaysKey: string = moment().format('DD/MM/YYYY');

    constructor(public datastore: ReservationHomeDatastoreService) {}

    ngOnInit() {}
}
