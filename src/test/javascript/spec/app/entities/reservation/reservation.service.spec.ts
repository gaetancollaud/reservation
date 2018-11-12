/* tslint:disable max-line-length */
import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { take, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { ReservationService } from 'app/entities/reservation/reservation.service';
import { IReservation, Reservation } from 'app/shared/model/reservation.model';

describe('Service Tests', () => {
    describe('Reservation Service', () => {
        let injector: TestBed;
        let service: ReservationService;
        let httpMock: HttpTestingController;
        let elemDefault: IReservation;
        let currentDate: moment.Moment;
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [HttpClientTestingModule]
            });
            injector = getTestBed();
            service = injector.get(ReservationService);
            httpMock = injector.get(HttpTestingController);
            currentDate = moment();

            elemDefault = new Reservation(0, currentDate, currentDate);
        });

        describe('Service methods', async () => {
            it('should find an element', async () => {
                const returnedFromService = Object.assign(
                    {
                        timestampStart: currentDate.format(DATE_TIME_FORMAT),
                        timestampEnd: currentDate.format(DATE_TIME_FORMAT)
                    },
                    elemDefault
                );
                service
                    .find(123)
                    .pipe(take(1))
                    .subscribe(resp => expect(resp).toMatchObject({ body: elemDefault }));

                const req = httpMock.expectOne({ method: 'GET' });
                req.flush(JSON.stringify(returnedFromService));
            });

            it('should create a Reservation', async () => {
                const returnedFromService = Object.assign(
                    {
                        id: 0,
                        timestampStart: currentDate.format(DATE_TIME_FORMAT),
                        timestampEnd: currentDate.format(DATE_TIME_FORMAT)
                    },
                    elemDefault
                );
                const expected = Object.assign(
                    {
                        timestampStart: currentDate,
                        timestampEnd: currentDate
                    },
                    returnedFromService
                );
                service
                    .create(new Reservation(null))
                    .pipe(take(1))
                    .subscribe(resp => expect(resp).toMatchObject({ body: expected }));
                const req = httpMock.expectOne({ method: 'POST' });
                req.flush(JSON.stringify(returnedFromService));
            });

            it('should update a Reservation', async () => {
                const returnedFromService = Object.assign(
                    {
                        timestampStart: currentDate.format(DATE_TIME_FORMAT),
                        timestampEnd: currentDate.format(DATE_TIME_FORMAT)
                    },
                    elemDefault
                );

                const expected = Object.assign(
                    {
                        timestampStart: currentDate,
                        timestampEnd: currentDate
                    },
                    returnedFromService
                );
                service
                    .update(expected)
                    .pipe(take(1))
                    .subscribe(resp => expect(resp).toMatchObject({ body: expected }));
                const req = httpMock.expectOne({ method: 'PUT' });
                req.flush(JSON.stringify(returnedFromService));
            });

            it('should return a list of Reservation', async () => {
                const returnedFromService = Object.assign(
                    {
                        timestampStart: currentDate.format(DATE_TIME_FORMAT),
                        timestampEnd: currentDate.format(DATE_TIME_FORMAT)
                    },
                    elemDefault
                );
                const expected = Object.assign(
                    {
                        timestampStart: currentDate,
                        timestampEnd: currentDate
                    },
                    returnedFromService
                );
                service
                    .query(expected)
                    .pipe(
                        take(1),
                        map(resp => resp.body)
                    )
                    .subscribe(body => expect(body).toContainEqual(expected));
                const req = httpMock.expectOne({ method: 'GET' });
                req.flush(JSON.stringify([returnedFromService]));
                httpMock.verify();
            });

            it('should delete a Reservation', async () => {
                const rxPromise = service.delete(123).subscribe(resp => expect(resp.ok));

                const req = httpMock.expectOne({ method: 'DELETE' });
                req.flush({ status: 200 });
            });
        });

        afterEach(() => {
            httpMock.verify();
        });
    });
});
