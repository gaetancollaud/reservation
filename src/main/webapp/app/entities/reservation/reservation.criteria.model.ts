export class ReservationCriteria {
    constructor(public from: Date, public to: Date) {}

    public clone(): ReservationCriteria {
        return new ReservationCriteria(this.from, this.to);
    }
}
