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
import {EntityResponseType} from '../entities/resource/resource.service';
import {ResourceType, ResourceTypeService} from '../entities/resource-type';

export class ReservationGrouped {
	constructor(private _date: Date, private _key: string, private _reservations: ReservationExtended[]) {

	}

	get date(): Date {
		return this._date;
	}

	get key(): string {
		return this._key;
	}

	get reservations(): ReservationExtended[] {
		return this._reservations;
	}
}

export class ReservationExtended extends Reservation {
	public resource: Resource;
	public user: User;
	public duration: string;
	public canEdit: boolean;

	public clone(): ReservationExtended {
		const c: ReservationExtended = new ReservationExtended();
		Object.assign(c, this);
		return c;
	}
}

export enum Operation {
	ADD,
	EDIT,
	DELETE
}

export class ReservationOperation {

	public static add(): ReservationOperation {
		return new ReservationOperation(new ReservationExtended(null, new Date()), Operation.ADD);
	}

	public static edit(r: ReservationExtended): ReservationOperation {
		return new ReservationOperation(r, Operation.EDIT);
	}

	public static delete(r: ReservationExtended): ReservationOperation {
		return new ReservationOperation(r, Operation.DELETE);
	}

	constructor(public reservation: ReservationExtended,
				public action: Operation) {
	}

}

@Injectable()
export class ReservationHomeDatastoreService extends SubscriptionHelper {

	private _reservationsGrouped: BehaviorSubject<ReservationGrouped[]>;
	private _reservations: BehaviorSubject<ReservationExtended[]>;
	private _operation: BehaviorSubject<ReservationOperation>;
	private _searchResult: Subject<HttpResponse<Reservation[]>>;
	private _search: BehaviorSubject<ReservationCriteria>;
	private _resources: BehaviorSubject<Resource[]>;
	private _resourceTypes: BehaviorSubject<ResourceType[]>;

	constructor(private principal: Principal, private reservationService: ReservationService,
				private resourceService: ResourceService, private userService: UserService,
				private resourceTypeService: ResourceTypeService) {
		super();
		this._resources = new BehaviorSubject<Resource[]>(null);
		this._resourceTypes = new BehaviorSubject<ResourceType[]>(null);
		this._operation = new BehaviorSubject<ReservationOperation>(null);
		this._reservations = new BehaviorSubject<ReservationExtended[]>(null);
		this._reservationsGrouped = new BehaviorSubject<ReservationGrouped[]>(null);
		this._searchResult = new Subject();
		this._search = new BehaviorSubject<ReservationCriteria>(new ReservationCriteria(
			moment().toDate(),
			moment().add(1, 'month').toDate()));
	}

	public start(): void {
		this.resourceTypeService.query().subscribe((res) => this._resourceTypes.next(res.body));
		this.addSubscription(this.search.subscribe((criteria) => this.updateSearch()));
		const userIdentity = Observable.fromPromise(this.principal.identity());
		this.addSubscription(Observable.combineLatest(this._searchResult, this.resourceService.query(), this.userService.query(),
			userIdentity)
			.subscribe((res) => {
				const reservations: Reservation[] = res[0].body;
				const resources: Resource[] = res[1].body;
				const users: User[] = res[2].body;
				const identity: any = res[3];

				this._resources.next(resources);

				const reservationExtendeds = reservations
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
						extended.canEdit = identity && (identity.id === reservation.userId || !!identity.authorities
							.find((s: string) => s === 'ROLE_RESERVATION_MANAGE'));

						return extended;
					});
				this._reservationsGrouped.next(this.groupReservations(reservationExtendeds));
				this._reservations.next(reservationExtendeds);
			}));
	}

	public stop(): void {
		this.unsubscribeAll();
	}

	protected updateSearch(): void {
		this.reservationService.search(this._search.getValue()).subscribe((response) => this._searchResult.next(response));
	}

	public get reservations(): BehaviorSubject<ReservationExtended[]> {
		return this._reservations;
	}

	get reservationsGrouped(): BehaviorSubject<ReservationGrouped[]> {
		return this._reservationsGrouped;
	}

	public get search(): BehaviorSubject<ReservationCriteria> {
		return this._search;
	}

	public get operation(): BehaviorSubject<ReservationOperation> {
		return this._operation;
	}

	public get resources(): Observable<Resource[]> {
		return this._resources.filter((v) => !!v);
	}

	public get resourceTypes(): Observable<ResourceType[]> {
		return this._resourceTypes.filter((v) => !!v);
	}

	public save(reservation: Reservation): Observable<Reservation> {
		let response: Observable<EntityResponseType>;
		if (reservation.id) {
			response = this.reservationService.update(reservation);
		} else {
			response = this.reservationService.create(reservation);
		}
		return response
			.map((r) => r.body)
			.do(() => this.updateSearch());
	}

	public delete(id: number): Observable<any> {
		return this.reservationService.delete(id)
			.map((r) => r.body)
			.do(() => this.updateSearch());
	}

	public groupReservations(reservations: ReservationExtended[]): ReservationGrouped[] {
		const grouped: ReservationGrouped[] = [];

		const map: Map<string, ReservationGrouped> = new Map<string, ReservationGrouped>();
		reservations.forEach((r: ReservationExtended) => {
			const key = this.getGroupKey(r);
			if (!map.has(key)) {
				const group = new ReservationGrouped(r.timestampStart, key, []);
				map.set(key, group);
				grouped.push(group);
			}
			map.get(key).reservations.push(r);
		});

		return grouped.sort((l, r) => l.date.getTime() - r.date.getTime());
	}

	private getGroupKey(reservation: Reservation): string {
		const mom = moment(reservation.timestampStart);
		return `${mom.format('DD/MM/YYYY')}`;
		// return `${mom.fromNow()} (${mom.format('DD/MM/YYYY')})`;
	}
}
