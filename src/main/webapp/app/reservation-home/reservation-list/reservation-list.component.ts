import {Component, OnInit} from '@angular/core';
import {ReservationHomeDatastoreService} from '../reservation-home-datastore.service';

@Component({
	selector: 'jhi-reservation-list',
	templateUrl: './reservation-list.component.html',
	styleUrls: ['./reservation-list.component.css']
})
export class ReservationListComponent implements OnInit {

	constructor(public datastore: ReservationHomeDatastoreService) {
	}

	ngOnInit() {
	}

}
