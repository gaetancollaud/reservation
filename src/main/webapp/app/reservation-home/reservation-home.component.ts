import {Component, OnDestroy, OnInit} from '@angular/core';
import {ReservationHomeDatastoreService} from './reservation-home-datastore.service';

@Component({
	selector: 'jhi-reservation-home',
	templateUrl: './reservation-home.component.html',
	styleUrls: [
		'reservation-home.scss'
	]

})
export class ReservationHomeComponent implements OnInit, OnDestroy {

	constructor(public datastore: ReservationHomeDatastoreService) {
	}

	ngOnInit() {
		this.datastore.start();
	}

	ngOnDestroy(): void {
		this.datastore.stop();
	}

}
