import {Component, OnInit} from '@angular/core';
import {ReservationHomeDatastoreService} from '../reservation-home-datastore.service';

@Component({
	selector: 'jhi-reservation-list',
	templateUrl: './reservation-list.component.html',
	styles: []
})
export class ReservationListComponent implements OnInit {

	constructor(public datastore: ReservationHomeDatastoreService) {
	}

	ngOnInit() {
	}

}
