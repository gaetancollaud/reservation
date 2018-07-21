import {BaseEntity} from './../../shared';

export class Reservation implements BaseEntity {
	constructor(
		public id?: number,
		public timestampStart?: any,
		public timestampEnd?: any,
		public resourceId?: number,
		public userId?: number,
	) {
	}
}

export class ReservationCriteria {
	constructor(public from: Date, public to: Date) {
	}

	public clone(): ReservationCriteria {
		return new ReservationCriteria(this.from, this.to);
	}
}
