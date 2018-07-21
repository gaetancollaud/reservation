import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';

import {Observable} from 'rxjs/Observable';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {JhiAlertService, JhiEventManager} from 'ng-jhipster';

import {User} from '../../shared';
import {Reservation} from '../../entities/reservation';
import {Resource} from '../../entities/resource';
import {Operation, ReservationExtended, ReservationHomeDatastoreService} from '../reservation-home-datastore.service';
import {UserReservationPopupService} from '../user-reservation-popup.service';
import {SubscriptionHelper} from '../../utils/subscription-helper';
import * as moment from 'moment';
import {DatePipe} from '@angular/common';

@Component({
	selector: 'jhi-user-reservation-dialog',
	templateUrl: './user-reservation-dialog.component.html'
})
export class UserReservationDialogComponent extends SubscriptionHelper implements OnInit, OnDestroy {

	reservation: ReservationExtended;
	isSaving: boolean;

	resources: Resource[];
	durationMin: number;
	dateStart: string;

	users: User[];

	constructor(
		private datePipe: DatePipe,
		public activeModal: NgbActiveModal,
		private jhiAlertService: JhiAlertService,
		private datastore: ReservationHomeDatastoreService,
		private eventManager: JhiEventManager
	) {
		super();
	}

	ngOnInit() {
		this.addSubscription(this.datastore.operation.subscribe((op) => {
			this.reservation = op.reservation;
			this.durationMin = moment.duration(moment(op.reservation.timestampEnd).diff(moment(op.reservation.timestampStart))).asMinutes();
			this.dateStart = this.datePipe.transform(op.reservation.timestampStart, 'yyyy-MM-ddTHH:mm:ss');
		}));
		this.addSubscription(this.datastore.resources
			.subscribe((list) => this.resources = list));
	}

	ngOnDestroy(): void {
		this.unsubscribeAll();
	}

	clear() {
		this.activeModal.dismiss('cancel');
	}

	save() {
		this.isSaving = true;
		this.subscribeToSaveResponse(this.datastore.save(this.reservation));
	}

	private subscribeToSaveResponse(result: Observable<Reservation>) {
		result.subscribe(
			(res: Reservation) => this.onSaveSuccess(res),
			(res: HttpErrorResponse) => this.onSaveError());
	}

	private onSaveSuccess(result: Reservation) {
		this.eventManager.broadcast({name: 'reservationListModification', content: 'OK'});
		this.isSaving = false;
		this.activeModal.dismiss(result);
	}

	private onSaveError() {
		this.isSaving = false;
	}

	private onError(error: any) {
		this.jhiAlertService.error(error.message, null, null);
	}

	trackResourceById(index: number, item: Resource) {
		return item.id;
	}

	trackUserById(index: number, item: User) {
		return item.id;
	}
}

@Component({
	selector: 'jhi-user-reservation-popup',
	template: ''
})
export class UserReservationPopupComponent implements OnInit, OnDestroy {

	routeSub: any;

	constructor(
		private route: ActivatedRoute,
		private reservationPopupService: UserReservationPopupService
	) {
	}

	ngOnInit() {
		this.routeSub = this.route.params.subscribe((params) => {
			if (params['id']) {
				this.reservationPopupService
					.open(UserReservationDialogComponent as Component, Operation.EDIT, parseInt(params['id'], 10));
			} else {
				this.reservationPopupService
					.open(UserReservationDialogComponent as Component, Operation.ADD);
			}
		});
	}

	ngOnDestroy() {
		this.routeSub.unsubscribe();
	}
}
