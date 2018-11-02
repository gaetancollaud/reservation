package net.collaud.gaetan.reservation.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value= HttpStatus.NOT_ACCEPTABLE, reason="Resource limitation")
public class ResourceLimitationException extends RuntimeException {
	public ResourceLimitationException(String message) {
		super(message);
	}
}
