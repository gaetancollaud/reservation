import { Moment } from 'moment';

export interface IReservation {
    id?: number;
    timestampStart?: Moment;
    timestampEnd?: Moment;
    resourceId?: number;
    userId?: number;
}

export class Reservation implements IReservation {
    constructor(
        public id?: number,
        public timestampStart?: Moment,
        public timestampEnd?: Moment,
        public resourceId?: number,
        public userId?: number
    ) {}
}
