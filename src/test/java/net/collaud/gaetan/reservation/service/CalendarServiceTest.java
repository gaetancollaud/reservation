package net.collaud.gaetan.reservation.service;

import net.collaud.gaetan.reservation.domain.Interval;
import org.junit.Test;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

public class CalendarServiceTest {

	private CalendarService calendarService;

	//TODO mock ICS !
	String icalUrl = "https://calendar.google.com/calendar/ical/nulu08ntleed9c5peukoeaifl8%40group.calendar.google.com/public/basic.ics";

	@Test
	public void testIcalAllowed() {
		calendarService = new CalendarService(new IcalLoaderService(new ConcurrentMapCacheManager(), new RestTemplate()));
		Interval intervalOut = new Interval(Instant.ofEpochMilli(1539201600000L), Instant.ofEpochMilli(1539208800000L));
		Interval intervalIn = new Interval(Instant.ofEpochMilli(1539018000000L), Instant.ofEpochMilli(1539025200000L));

		assertThat(calendarService.isAllowed(icalUrl, Optional.of("Formation Découpeuse laser par Julien"), intervalOut)).isFalse();
		assertThat(calendarService.isAllowed(icalUrl, Optional.of(".*Formation Découpeuse laser.*"), intervalIn)).isTrue();
	}
}
