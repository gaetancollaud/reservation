import { BaseEntity } from './../../shared';

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
