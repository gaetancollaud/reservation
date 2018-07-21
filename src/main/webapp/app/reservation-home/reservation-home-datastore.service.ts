import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Reservation, ReservationCriteria, ReservationService} from '../entities/reservation';
import {Principal, User, UserService} from '../shared';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/observable/fromPromise';
import * as moment from 'moment';
import {Observable} from 'rxjs/Observable';
import {HttpResponse} from '@angular/common/http';
import {Resource, ResourceService} from '../entities/resource';
import {Subject} from 'rxjs/Subject';
import {SubscriptionHelper} from '../utils/subscription-helper';

export class ReservationExtended extends Reservation {
	public resource: Resource;
	public user: User;
	public duration: string;
	public canEdit: boolean;
}

@Injectable()
export class ReservationHomeDatastoreService extends SubscriptionHelper {

	private _reservations: BehaviorSubject<ReservationExtended[]>;
	private _searchResult: Subject<HttpResponse<Reservation[]>>;
	private _search: BehaviorSubject<ReservationCriteria>;

	constructor(private principal: Principal, private reservationService: ReservationService,
				private resourceService: ResourceService, private userService: UserService) {
		super();
		this._reservations = new BehaviorSubject<ReservationExtended[]>([]);
		this._searchResult = new Subject();
		this._search = new BehaviorSubject<ReservationCriteria>(new ReservationCriteria(
			moment().startOf('week').toDate(),
			moment().endOf('week').toDate()));
	}

	public start(): void {
		this.addSubscription(this.search.subscribe((criteria) => this.updateSearch()));

		this.addSubscription(Observable.combineLatest(this._searchResult, this.resourceService.query(), this.userService.query(),
			Observable.fromPromise(this.principal.identity()))
			.subscribe((res) => {
				const reservations: Reservation[] = res[0].body;
				const resources: Resource[] = res[1].body;
				const users: User[] = res[2].body;
				const identity: any = res[3];

				this._reservations.next(reservations
					.sort((l, r) => -moment(l.timestampStart).diff(moment(r.timestampStart)))
					.map((reservation: Reservation) => {
						const extended: ReservationExtended = new ReservationExtended();
						Object.assign(extended, reservation);

						const duration = moment.duration(moment(reservation.timestampEnd).diff(moment(reservation.timestampStart)));
						let durationStr = '';
						if (duration.hours()) {
							durationStr += ` ${duration.hours()}h`;
						}
						if (duration.minutes()) {
							durationStr += ` ${duration.minutes()}m`;
						}
						if (duration.seconds()) {
							durationStr += ` ${duration.seconds()}s`;
						}
						extended.duration = durationStr.trim();

						extended.user = users.find((u: User) => u.id === reservation.userId);
						extended.resource = resources.find((r: Resource) => r.id === reservation.resourceId);
						extended.canEdit = identity.id === reservation.userId;

						return extended;
					}));
			}));
	}

	public stop(): void {
		this.unsubscribeAll();
	}

	protected updateSearch(): void {
		this.reservationService.search(this._search.getValue()).subscribe((response) => this._searchResult.next(response));
	}

	get reservations(): BehaviorSubject<Reservation[]> {
		return this._reservations;
	}

	get search(): BehaviorSubject<ReservationCriteria> {
		return this._search;
	}
}
