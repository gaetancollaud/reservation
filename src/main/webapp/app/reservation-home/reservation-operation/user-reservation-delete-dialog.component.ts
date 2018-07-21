import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {JhiEventManager} from 'ng-jhipster';
import {Reservation} from '../../entities/reservation';
import {UserReservationPopupService} from '../user-reservation-popup.service';
import {Operation, ReservationHomeDatastoreService} from '../reservation-home-datastore.service';

@Component({
	selector: 'jhi-user-reservation-delete-dialog',
	templateUrl: './user-reservation-delete-dialog.component.html'
})
export class UserReservationDeleteDialogComponent {

	reservation: Reservation;

	constructor(
		private datastore: ReservationHomeDatastoreService,
		public activeModal: NgbActiveModal,
		private eventManager: JhiEventManager
	) {
	}

	clear() {
		this.activeModal.dismiss('cancel');
	}

	confirmDelete(id: number) {
		this.datastore.delete(id).subscribe(() => {
			this.eventManager.broadcast({
				name: 'reservationListModification',
				content: 'Deleted an reservation'
			});
			this.activeModal.dismiss(true);
		});
	}
}

@Component({
	selector: 'jhi-user-reservation-delete-popup',
	template: ''
})
export class UserReservationDeletePopupComponent implements OnInit, OnDestroy {

	routeSub: any;

	constructor(
		private route: ActivatedRoute,
		private reservationPopupService: UserReservationPopupService
	) {
	}

	ngOnInit() {
		this.routeSub = this.route.params.subscribe((params) => {
			this.reservationPopupService
				.open(UserReservationDeleteDialogComponent as Component, Operation.DELETE, parseInt(params['id'], 10));
		});
	}

	ngOnDestroy() {
		this.routeSub.unsubscribe();
	}
}
