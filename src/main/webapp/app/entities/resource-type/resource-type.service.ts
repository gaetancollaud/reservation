import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {SERVER_API_URL} from '../../app.constants';

import {ResourceType} from './resource-type.model';
import {createRequestOption} from '../../shared';

export type EntityResponseType = HttpResponse<ResourceType>;

@Injectable()
export class ResourceTypeService {

	private resourceUrl = SERVER_API_URL + 'api/resource-types';

	constructor(private http: HttpClient) {
	}

	create(resourceType: ResourceType): Observable<EntityResponseType> {
		const copy = this.convert(resourceType);
		return this.http.post<ResourceType>(this.resourceUrl, copy, {observe: 'response'})
			.map((res: EntityResponseType) => this.convertResponse(res));
	}

	update(resourceType: ResourceType): Observable<EntityResponseType> {
		const copy = this.convert(resourceType);
		return this.http.put<ResourceType>(this.resourceUrl, copy, {observe: 'response'})
			.map((res: EntityResponseType) => this.convertResponse(res));
	}

	find(id: number): Observable<EntityResponseType> {
		return this.http.get<ResourceType>(`${this.resourceUrl}/${id}`, {observe: 'response'})
			.map((res: EntityResponseType) => this.convertResponse(res));
	}

	query(req?: any): Observable<HttpResponse<ResourceType[]>> {
		const options = createRequestOption(req);
		return this.http.get<ResourceType[]>(this.resourceUrl, {params: options, observe: 'response'})
			.map((res: HttpResponse<ResourceType[]>) => this.convertArrayResponse(res));
	}

	delete(id: number): Observable<HttpResponse<any>> {
		return this.http.delete<any>(`${this.resourceUrl}/${id}`, {observe: 'response'});
	}

	private convertResponse(res: EntityResponseType): EntityResponseType {
		const body: ResourceType = this.convertItemFromServer(res.body);
		return res.clone({body});
	}

	private convertArrayResponse(res: HttpResponse<ResourceType[]>): HttpResponse<ResourceType[]> {
		const jsonResponse: ResourceType[] = res.body;
		const body: ResourceType[] = [];
		for (let i = 0; i < jsonResponse.length; i++) {
			body.push(this.convertItemFromServer(jsonResponse[i]));
		}
		return res.clone({body});
	}

	/**
	 * Convert a returned JSON object to ResourceType.
	 */
	private convertItemFromServer(resourceType: ResourceType): ResourceType {
		const copy: ResourceType = Object.assign({}, resourceType);
		return copy;
	}

	/**
	 * Convert a ResourceType to a JSON which can be sent to the server.
	 */
	private convert(resourceType: ResourceType): ResourceType {
		const copy: ResourceType = Object.assign({}, resourceType);
		return copy;
	}
}
