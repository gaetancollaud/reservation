package net.collaud.gaetan.reservation.domain;

import java.time.Instant;

public class Interval {
	private Instant start;
	private Instant end;

	public Interval(Instant start, Instant end) {
		this.start = start;
		this.end = end;
	}

	public Instant getStart() {
		return start;
	}

	public Instant getEnd() {
		return end;
	}

	public boolean canContains(Interval other) {
		return other.end.isAfter(start) && this.end.isAfter(other.start);
	}
}
