package net.collaud.gaetan.reservation.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value= HttpStatus.CONFLICT, reason="Conflict with another reservation")
public class ReservationConflictException extends RuntimeException {
	public ReservationConflictException(String message) {
		super(message);
	}
}
