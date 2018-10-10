package net.collaud.gaetan.reservation.domain;

import org.junit.Test;

import java.time.Instant;

import static org.assertj.core.api.Assertions.assertThat;


public class IntervalTest {

	@Test
	public void testInterval() {
		Interval int1 = interval(1000, 10000);

		assertThat(int1.canContains(int1)).isTrue();
		assertThat(int1.canContains(interval(1000, 2000))).isTrue();
		assertThat(int1.canContains(interval(2000, 10000))).isTrue();
		assertThat(int1.canContains(interval(2000, 500))).isTrue();
		assertThat(int1.canContains(interval(999, 500))).isFalse();
		assertThat(int1.canContains(interval(2000, 10001))).isFalse();
		assertThat(int1.canContains(interval(0, 1000))).isFalse();
		assertThat(int1.canContains(interval(10000, 100000))).isFalse();
	}

	protected Interval interval(long left, long right) {
		return new Interval(Instant.ofEpochMilli(left), Instant.ofEpochMilli(right));
	}

}
