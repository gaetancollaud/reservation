package net.collaud.gaetan.reservation.exceptions;

public class ResourceLimitationException extends RuntimeException {
	public ResourceLimitationException(String message) {
		super(message);
	}
}
