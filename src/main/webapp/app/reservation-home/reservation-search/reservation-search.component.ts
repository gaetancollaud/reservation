import {Component, OnDestroy, OnInit} from '@angular/core';
import {ReservationHomeDatastoreService} from '../reservation-home-datastore.service';
import {ReservationCriteria} from '../../entities/reservation';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SubscriptionHelper} from '../../utils/subscription-helper';
import 'rxjs/add/operator/distinctUntilChanged';
import * as moment from 'moment';
import StartOf = moment.unitOfTime.StartOf;

class ReservationSearchForm {

	public from: string;
	public to: string;

	public constructor(criteria: ReservationCriteria) {
		this.from = criteria.from.toISOString().substring(0, 10);
		this.to = criteria.to.toISOString().substring(0, 10);
	}

	public equals(other: ReservationSearchForm) {
		return this.from === other.from && this.to === other.to;
	}
}

@Component({
	selector: 'jhi-reservation-search',
	templateUrl: './reservation-search.component.html',
	styles: []
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
				const v = new ReservationSearchForm(search);
				if (!v.equals(this.formGroup.value)) {
					this.formGroup.setValue(v);
				}
			}));

		this.addSubscription(this.formGroup.valueChanges.subscribe((value: ReservationCriteria) => {
			this.datastore.search.next(new ReservationCriteria(new Date(value.from), new Date(value.to)));
		}));
	}

	ngOnDestroy(): void {
		this.unsubscribeAll();
	}

	public selectDateUnit(unit: StartOf): void {
		this.datastore.search.next(new ReservationCriteria(moment().startOf(unit).toDate(), moment().endOf(unit).toDate()));
	}

}
