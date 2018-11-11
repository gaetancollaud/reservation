import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService } from 'ng-jhipster';

import { IReservation } from 'app/shared/model/reservation.model';
import { ReservationService } from './reservation.service';
import { IResource } from 'app/shared/model/resource.model';
import { ResourceService } from 'app/entities/resource';
import { IUser, UserService } from 'app/core';

@Component({
    selector: 'jhi-reservation-update',
    templateUrl: './reservation-update.component.html'
})
export class ReservationUpdateComponent implements OnInit {
    reservation: IReservation;
    isSaving: boolean;

    resources: IResource[];

    users: IUser[];
    timestampStart: string;
    timestampEnd: string;

    constructor(
        private jhiAlertService: JhiAlertService,
        private reservationService: ReservationService,
        private resourceService: ResourceService,
        private userService: UserService,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ reservation }) => {
            this.reservation = reservation;
            this.timestampStart = this.reservation.timestampStart != null ? this.reservation.timestampStart.format(DATE_TIME_FORMAT) : null;
            this.timestampEnd = this.reservation.timestampEnd != null ? this.reservation.timestampEnd.format(DATE_TIME_FORMAT) : null;
        });
        this.resourceService.query().subscribe(
            (res: HttpResponse<IResource[]>) => {
                this.resources = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
        this.userService.query().subscribe(
            (res: HttpResponse<IUser[]>) => {
                this.users = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        this.reservation.timestampStart = this.timestampStart != null ? moment(this.timestampStart, DATE_TIME_FORMAT) : null;
        this.reservation.timestampEnd = this.timestampEnd != null ? moment(this.timestampEnd, DATE_TIME_FORMAT) : null;
        if (this.reservation.id !== undefined) {
            this.subscribeToSaveResponse(this.reservationService.update(this.reservation));
        } else {
            this.subscribeToSaveResponse(this.reservationService.create(this.reservation));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IReservation>>) {
        result.subscribe((res: HttpResponse<IReservation>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    trackResourceById(index: number, item: IResource) {
        return item.id;
    }

    trackUserById(index: number, item: IUser) {
        return item.id;
    }
}
