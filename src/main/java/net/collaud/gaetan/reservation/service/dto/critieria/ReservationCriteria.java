package net.collaud.gaetan.reservation.service.dto.critieria;

import java.time.ZonedDateTime;

public class ReservationCriteria {
    private ZonedDateTime from;
    private ZonedDateTime to;

    public ZonedDateTime getFrom() {
        return from;
    }

    public void setFrom(ZonedDateTime from) {
        this.from = from;
    }

    public ZonedDateTime getTo() {
        return to;
    }

    public void setTo(ZonedDateTime to) {
        this.to = to;
    }
}
