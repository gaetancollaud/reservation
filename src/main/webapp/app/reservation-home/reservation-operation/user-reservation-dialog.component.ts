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
import {DatePipe} from '@angular/common';
import {ResourceType} from '../../entities/resource-type';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/delay';

export class ReservationForm {

	public static fromReservation(r: ReservationExtended, datePipe: DatePipe): ReservationForm {
		const dateStartDate = new Date(r.timestampStart);
		const dateStartTime = 1830;
		return new ReservationForm(r.id || 0, r.resourceId || 0, dateStartDate, dateStartTime, 60 * 60);
	}

	constructor(public id: number,
				public resourceId: number,
				public dateStartDate: Date,
				public dateStartTime: number,
				public durationSec: number) {
	}

}

export class DurationItem {
	constructor(public sec: number,
				public name: string) {
	}
}

export class StartTime {
	public name;
	public value;

	constructor(public hour, public min) {
		const zeroMin = min < 10 ? '0' : '';
		this.name = `${hour}:${zeroMin}${min}`;
		this.value = hour * 100 + min;
	}
}

@Component({
	selector: 'jhi-user-reservation-dialog',
	templateUrl: './user-reservation-dialog.component.html',
	styleUrls: ['./user-reservation-dialog.component.css']
})
export class UserReservationDialogComponent extends SubscriptionHelper implements OnInit, OnDestroy {

	public isSaving: boolean;

	public reservation: ReservationExtended;

	public resources: Resource[];
	public duration: number;
	public dateStartDate: string;
	public dateStartTime: string;
	public resourceType: ResourceType;

	public reservationErrorMessage: string;

	public allDurations: DurationItem[] = [
		new DurationItem(15 * 60, '15 minutes'),
		new DurationItem(30 * 60, '30 minutes'),
		new DurationItem(45 * 60, '45 minutes'),
		new DurationItem(60 * 60, '1 heure'),
		new DurationItem(1.5 * 60 * 60, '1.5 heure'),
		new DurationItem(2 * 60 * 60, '2 heures'),
		new DurationItem(3 * 60 * 60, '3 heures'),
		new DurationItem(4 * 60 * 60, '4 heures'),
	];
	public durations: DurationItem[];
	public startTimes: StartTime[] = [
		new StartTime(18, 30),
		new StartTime(19, 0),
		new StartTime(19, 30),
		new StartTime(20, 0)
	];

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
			id: [''],
			resourceId: ['', Validators.required],
			dateStartDate: [new Date(), Validators.required],
			dateStartTime: [1800, Validators.required],
			durationSec: ['', Validators.required],
		});
		this.addSubscription(this.reservationForm.valueChanges.delay(1).subscribe((v) => {
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
		this.reservation = formValue;
		const dateStart = new Date(formValue.dateStartDate);
		dateStart.setHours(Math.round(formValue.dateStartTime / 100), formValue.dateStartTime % 100);
		this.reservation.timestampStart = dateStart.toISOString();
		this.reservation.timestampEnd = new Date(dateStart.getTime() + formValue.durationSec * 1000).toISOString();

		this.subscribeToSaveResponse(this.datastore.save(this.reservation));
	}

	updateMaxDuration() {
		setTimeout(() => {
			if (this.resources) {
				const resource = this.resources.find((r) => r.id === this.reservationForm.value.resourceId);
				if (resource) {
					this.datastore.resourceTypes
						.first()
						.subscribe((types) => {
							this.resourceType = types.find((t) => t.id === resource.typeId);
							this.durations = this.allDurations
								.filter((d: DurationItem) => d.sec >= this.resourceType.minTimeSec)
								.filter((d: DurationItem) => d.sec <= this.resourceType.maxTimeSec);
						});
				}
			}
		});
	}

	private subscribeToSaveResponse(result: Observable<Reservation>) {
		result.subscribe(
			(res: Reservation) => this.onSaveSuccess(res),
			(res: HttpErrorResponse) => this.onSaveError(res));
	}

	private onSaveSuccess(result: Reservation) {
		this.eventManager.broadcast({name: 'reservationListModification', content: 'OK'});
		this.isSaving = false;
		this.activeModal.dismiss(result);
		this.reservationErrorMessage = null;
	}

	private onSaveError(res: HttpErrorResponse) {
		this.isSaving = false;
		if (res.status === 409) {
			this.reservationErrorMessage = 'Réservation en conflict avec une autre';
		} else if (res.status === 406) {
			this.reservationErrorMessage = 'Réservation impossible à cette date. Est-ce que le Fablab est bien ouvert à ce moment là ?';
		} else {
			this.reservationErrorMessage = res.message;
		}
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
