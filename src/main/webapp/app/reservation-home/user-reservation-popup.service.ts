import { Component, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import {
    Operation,
    ReservationExtended,
    ReservationHomeDatastoreService,
    ReservationOperation
} from './reservation-home-datastore.service';
import { filter, take } from 'rxjs/operators';
import { Reservation } from 'app/shared/model/reservation.model';

@Injectable()
export class UserReservationPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private datePipe: DatePipe,
        private modalService: NgbModal,
        private router: Router,
        private datastore: ReservationHomeDatastoreService
    ) {
        this.ngbModalRef = null;
    }

    open(component: Component, operation: Operation, id?: number | any): Promise<NgbModalRef> {
        return new Promise<NgbModalRef>((resolve, reject) => {
            const isOpen = this.ngbModalRef !== null;
            if (isOpen) {
                resolve(this.ngbModalRef);
            }

            if (id) {
                this.datastore.reservations
                    .pipe(
                        take(1),
                        filter((list: ReservationExtended[]) => !!list)
                    )
                    .subscribe((list: ReservationExtended[]) => {
                        const theOne = list.find((r: ReservationExtended) => r.id === id);
                        if (!theOne) {
                            throw new Error(`Unable to find a reservation with the id '${id}'`);
                        }
                        this.datastore.operation.next(new ReservationOperation(theOne, operation));
                        this.ngbModalRef = this.reservationModalRef(component, theOne);
                        resolve(this.ngbModalRef);
                    });
            } else {
                this.datastore.operation.next(ReservationOperation.add());
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.reservationModalRef(component, new Reservation());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    reservationModalRef(component: Component, reservation: Reservation): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static' });
        modalRef.componentInstance.reservation = reservation;
        modalRef.result.then(
            () => {
                this.router.navigate([{ outlets: { popup: null } }], { replaceUrl: true, queryParamsHandling: 'merge' });
                this.ngbModalRef = null;
            },
            () => {
                this.router.navigate([{ outlets: { popup: null } }], { replaceUrl: true, queryParamsHandling: 'merge' });
                this.ngbModalRef = null;
            }
        );
        return modalRef;
    }
}
