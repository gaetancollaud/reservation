import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {SERVER_API_URL} from '../../app.constants';

import {JhiDateUtils} from 'ng-jhipster';

import {Reservation, ReservationCriteria} from './reservation.model';
import {createRequestOption} from '../../shared';

export type EntityResponseType = HttpResponse<Reservation>;

@Injectable()
export class ReservationService {

	private resourceUrl = SERVER_API_URL + 'api/reservations';

	constructor(private http: HttpClient, private dateUtils: JhiDateUtils) {
	}

	create(reservation: Reservation): Observable<EntityResponseType> {
		const copy = this.convert(reservation);
		return this.http.post<Reservation>(this.resourceUrl, copy, {observe: 'response'})
			.map((res: EntityResponseType) => this.convertResponse(res));
	}

	update(reservation: Reservation): Observable<EntityResponseType> {
		const copy = this.convert(reservation);
		return this.http.put<Reservation>(this.resourceUrl, copy, {observe: 'response'})
			.map((res: EntityResponseType) => this.convertResponse(res));
	}

	find(id: number): Observable<EntityResponseType> {
		return this.http.get<Reservation>(`${this.resourceUrl}/${id}`, {observe: 'response'})
			.map((res: EntityResponseType) => this.convertResponse(res));
	}

	search(criteria: ReservationCriteria): Observable<HttpResponse<Reservation[]>> {
		return this.http.post<Reservation[]>(`${this.resourceUrl}/search`, criteria, {observe: 'response'})
			.map((res: HttpResponse<Reservation[]>) => this.convertArrayResponse(res));
	}

	query(req?: any): Observable<HttpResponse<Reservation[]>> {
		const options = createRequestOption(req);
		return this.http.get<Reservation[]>(this.resourceUrl, {params: options, observe: 'response'})
			.map((res: HttpResponse<Reservation[]>) => this.convertArrayResponse(res));
	}

	delete(id: number): Observable<HttpResponse<any>> {
		return this.http.delete<any>(`${this.resourceUrl}/${id}`, {observe: 'response'});
	}

	private convertResponse(res: EntityResponseType): EntityResponseType {
		const body: Reservation = this.convertItemFromServer(res.body);
		return res.clone({body});
	}

	private convertArrayResponse(res: HttpResponse<Reservation[]>): HttpResponse<Reservation[]> {
		const jsonResponse: Reservation[] = res.body;
		const body: Reservation[] = [];
		for (let i = 0; i < jsonResponse.length; i++) {
			body.push(this.convertItemFromServer(jsonResponse[i]));
		}
		return res.clone({body});
	}

	/**
	 * Convert a returned JSON object to Reservation.
	 */
	private convertItemFromServer(reservation: Reservation): Reservation {
		const copy: Reservation = Object.assign({}, reservation);
		copy.timestampStart = this.dateUtils
			.convertDateTimeFromServer(reservation.timestampStart);
		copy.timestampEnd = this.dateUtils
			.convertDateTimeFromServer(reservation.timestampEnd);
		return copy;
	}

	/**
	 * Convert a Reservation to a JSON which can be sent to the server.
	 */
	private convert(reservation: Reservation): Reservation {
		const copy: Reservation = Object.assign({}, reservation);

		copy.timestampStart = this.dateUtils.toDate(reservation.timestampStart);

		copy.timestampEnd = this.dateUtils.toDate(reservation.timestampEnd);
		return copy;
	}
}
