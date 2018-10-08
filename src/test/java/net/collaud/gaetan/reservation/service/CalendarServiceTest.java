package net.collaud.gaetan.reservation.service;

import org.junit.Test;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

//@RunWith(SpringRunner.class)
//@SpringBootTest(classes = ReservationApp.class)
//@Transactional(propagation = Propagation.NOT_SUPPORTED)
public class CalendarServiceTest {

	//	@Autowired
	private CalendarService calendarService;

	@Test
	public void testIcalAllowed() {
		calendarService = new CalendarService(new IcalLoaderService(new RestTemplate()));
//		assertThat(calendarService.isAllowed(Optional.of("Formation Découpeuse laser par Julien"), Instant.now())).isFalse();
		assertThat(calendarService.isAllowed(Optional.of(".*Formation Découpeuse laser.*"), Instant.ofEpochMilli(1539021415000L))).isTrue();
	}
}
