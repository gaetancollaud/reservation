import {Component, OnDestroy, OnInit} from '@angular/core';
import {ReservationHomeDatastoreService} from '../reservation-home-datastore.service';
import {ReservationCriteria} from '../../entities/reservation';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SubscriptionHelper} from '../../utils/subscription-helper';
import 'rxjs/add/operator/distinctUntilChanged';
import * as moment from 'moment';

@Component({
	selector: 'jhi-reservation-search',
	templateUrl: './reservation-search.component.html',
	styleUrls: ['./reservation-search.component.css']
})
export class ReservationSearchComponent extends SubscriptionHelper implements OnInit, OnDestroy {

	public formGroup: FormGroup;

	constructor(private datastore: ReservationHomeDatastoreService, private fb: FormBuilder) {
		super();
	}

	ngOnInit() {
		this.formGroup = this.fb.group({
			from: [new Date(), Validators.required],
			to: [new Date(), Validators.required],
		});
		this.addSubscription(this.datastore.search
			.distinctUntilChanged()
			.subscribe((search: ReservationCriteria) => {
				// const v = new ReservationSearchForm(search);
				// if (!v.equals(this.formGroup.value)) {
				this.formGroup.setValue(search);
				// }
			}));

		this.addSubscription(this.formGroup.valueChanges.subscribe((value: ReservationCriteria) => {
			const newStart = moment(value.from).startOf('day');
			const newTo = moment(value.to).endOf('day');
			const old = this.datastore.search.getValue();
			const oldStart = moment(old.from).startOf('day');
			const oldTo = moment(old.to).endOf('day');

			if (!newStart.isSame(oldStart) || !newTo.isSame(oldTo)) {
				this.datastore.search.next(new ReservationCriteria(newStart.toDate(), newTo.toDate()));
			}
		}));
	}

	ngOnDestroy(): void {
		this.unsubscribeAll();
	}

	public selectDateUnit(unit: moment.unitOfTime.StartOf): void {
		this.datastore.search.next(new ReservationCriteria(moment().startOf(unit).toDate(), moment().endOf(unit).toDate()));
	}

	public nextDays(days: number) {
		this.datastore.search.next(new ReservationCriteria(moment().startOf('day').toDate(), moment().add(days, 'day').startOf('day').toDate()));
	}

}
