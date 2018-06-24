import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {SERVER_API_URL} from '../../app.constants';

@Injectable()
export class AuthServerProvider {

    private readonly authServer = 'https://keycloak.collaud.me/auth/';

    constructor(private http: HttpClient) {
    }

    logout(): Observable<any> {
        // logout from the server
        return this.http.post(SERVER_API_URL + 'api/logout', {}, {observe: 'response'}).map((response: HttpResponse<any>) => {
            window.location.href = this.authServer + '/realms/fablab/protocol/openid-connect/logout?redirect_uri=http://localhost:8080';
            // to get a new csrf token call the api
            // this.http.get(SERVER_API_URL + 'api/account').subscribe(() => {}, () => {});
            return response;
        });
    }

    profile(): void {
        window.location.href = this.authServer + 'realms/fablab/account';
    }
}
