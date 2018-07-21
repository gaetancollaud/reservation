import {Component, Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {DatePipe} from '@angular/common';
import {Operation, ReservationHomeDatastoreService, ReservationOperation} from './reservation-home-datastore.service';
import {Reservation} from '../entities/reservation';

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
					.filter((list) => !!list)
					.subscribe((list) => {
						const theOne = list.find((r) => r.id === id);
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
		const modalRef = this.modalService.open(component, {size: 'lg', backdrop: 'static'});
		modalRef.componentInstance.reservation = reservation;
		modalRef.result.then((result) => {
			this.router.navigate([{outlets: {popup: null}}], {replaceUrl: true, queryParamsHandling: 'merge'});
			this.ngbModalRef = null;
		}, (reason) => {
			this.router.navigate([{outlets: {popup: null}}], {replaceUrl: true, queryParamsHandling: 'merge'});
			this.ngbModalRef = null;
		});
		return modalRef;
	}
}
