package net.collaud.gaetan.reservation.service.dto.critieria;

import java.time.ZonedDateTime;

public class ReservationCriteria {
	private ZonedDateTime from;
	private ZonedDateTime to;
	private Long resourceId;

	public ReservationCriteria() {
	}

	public ReservationCriteria(ZonedDateTime from, ZonedDateTime to, Long resourceId) {
		this.from = from;
		this.to = to;
		this.resourceId = resourceId;
	}

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

	public Long getResourceId() {
		return resourceId;
	}

	public void setResourceId(Long resourceId) {
		this.resourceId = resourceId;
	}
}
