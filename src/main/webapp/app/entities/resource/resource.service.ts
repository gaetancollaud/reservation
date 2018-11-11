import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { Resource } from './resource.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<Resource>;

@Injectable()
export class ResourceService {

    private resourceUrl =  SERVER_API_URL + 'api/resources';

    constructor(private http: HttpClient) { }

    create(resource: Resource): Observable<EntityResponseType> {
        const copy = this.convert(resource);
        return this.http.post<Resource>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(resource: Resource): Observable<EntityResponseType> {
        const copy = this.convert(resource);
        return this.http.put<Resource>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<Resource>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<Resource[]>> {
        const options = createRequestOption(req);
        return this.http.get<Resource[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Resource[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Resource = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<Resource[]>): HttpResponse<Resource[]> {
        const jsonResponse: Resource[] = res.body;
        const body: Resource[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Resource.
     */
    private convertItemFromServer(resource: Resource): Resource {
        const copy: Resource = Object.assign({}, resource);
        return copy;
    }

    /**
     * Convert a Resource to a JSON which can be sent to the server.
     */
    private convert(resource: Resource): Resource {
        const copy: Resource = Object.assign({}, resource);
        return copy;
    }
}
