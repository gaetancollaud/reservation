import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Reservation, ReservationService} from '../entities/reservation';
import {Principal} from '../shared';

@Injectable()
export class ReservationHomeDatastoreService {

    private _reservations: BehaviorSubject<Reservation[]>;
    private _search: BehaviorSubject<any>;

    constructor(private principal: Principal, private reservationService: ReservationService) {
        this._reservations = new BehaviorSubject<Reservation[]>([]);
        this._search = new BehaviorSubject<any>({});
    }

    public start(): void {
        this.updateSearch();
    }

    protected updateSearch(): void {
        this.reservationService.query({}).subscribe((r) => {
            this._reservations.next(r.body);
        });
    }

    get reservations(): BehaviorSubject<Reservation[]> {
        return this._reservations;
    }

    get search(): BehaviorSubject<any> {
        return this._search;
    }
}
