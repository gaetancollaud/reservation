import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IResourceType } from 'app/shared/model/resource-type.model';

type EntityResponseType = HttpResponse<IResourceType>;
type EntityArrayResponseType = HttpResponse<IResourceType[]>;

@Injectable({ providedIn: 'root' })
export class ResourceTypeService {
    public resourceUrl = SERVER_API_URL + 'api/resource-types';

    constructor(private http: HttpClient) {}

    create(resourceType: IResourceType): Observable<EntityResponseType> {
        return this.http.post<IResourceType>(this.resourceUrl, resourceType, { observe: 'response' });
    }

    update(resourceType: IResourceType): Observable<EntityResponseType> {
        return this.http.put<IResourceType>(this.resourceUrl, resourceType, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IResourceType>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IResourceType[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }
}
