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
import {ResourceType} from '../../entities/resource-type';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/delay';

export class ReservationForm {

	public static fromReservation(r: ReservationExtended, datePipe: DatePipe): ReservationForm {
		let durationMin = moment.duration(moment(r.timestampEnd).diff(moment(r.timestampStart))).asMinutes();
		if (durationMin === 0) {
			durationMin = 60;
		}
		const dateStart = datePipe.transform(r.timestampStart, 'yyyy-MM-ddTHH:mm:ss');
		return new ReservationForm(r.resourceId || 0, dateStart, durationMin);
	}

	constructor(public resourceId: number,
				public dateStart: string,
				public durationMin: number) {
	}

}

@Component({
	selector: 'jhi-user-reservation-dialog',
	templateUrl: './user-reservation-dialog.component.html'
})
export class UserReservationDialogComponent extends SubscriptionHelper implements OnInit, OnDestroy {

	public isSaving: boolean;

	public reservation: Reservation;

	public resources: Resource[];
	public durationMin: number;
	public dateStart: string;
	public resourceType: ResourceType;

	public reservationForm: FormGroup;

	constructor(
		private datePipe: DatePipe,
		public activeModal: NgbActiveModal,
		private jhiAlertService: JhiAlertService,
		private datastore: ReservationHomeDatastoreService,
		private eventManager: JhiEventManager,
		private fb: FormBuilder
	) {
		super();
	}

	ngOnInit() {
		this.reservationForm = this.fb.group({
			resourceId: ['', Validators.required],
			dateStart: ['', Validators.required],
			durationMin: ['', [
				Validators.required,
				(ctrl: AbstractControl) => {
					if (!this.resourceType) {
						return {noResource: 'noResource'};
					}
					const valueSec = ctrl.value ? parseInt(ctrl.value, 10) * 60 : 0;
					if (valueSec < this.resourceType.minTimeSec) {
						return {tooSmall: 'tooSmall'};
					}
					if (valueSec > this.resourceType.maxTimeSec) {
						return {tooBig: 'tooBig'};
					}
				}]]
		});
		this.addSubscription(this.reservationForm.valueChanges.delay(1).subscribe((v) => {
			console.log('form value changed');
			this.updateMaxDuration();
		}));
		this.addSubscription(this.datastore.operation.subscribe((op) => {
			this.reservation = op.reservation;
			this.reservationForm.setValue(ReservationForm.fromReservation(op.reservation, this.datePipe));
		}));
		this.addSubscription(this.datastore.resources
			.subscribe((list) => {
				this.resources = list;
				this.updateMaxDuration();
			}));
	}

	ngOnDestroy(): void {
		this.unsubscribeAll();
	}

	clear() {
		this.activeModal.dismiss('cancel');
	}

	save() {
		this.isSaving = true;
		const formValue = this.reservationForm.value;
		this.reservation.timestampStart = new Date(formValue.dateStart).getTime();
		this.reservation.timestampEnd = this.reservation.timestampStart + formValue.durationMin * 60 * 1000;

		this.subscribeToSaveResponse(this.datastore.save(this.reservation));
	}

	updateMaxDuration() {
		if (this.resources) {
			const resource = this.resources.find((r) => r.id === this.reservationForm.value.resourceId);
			if (resource) {
				this.datastore.resourceTypes
					.first()
					.subscribe((types) => {
						this.resourceType = types.find((t) => t.id === resource.typeId);
					});
			}
		}
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
