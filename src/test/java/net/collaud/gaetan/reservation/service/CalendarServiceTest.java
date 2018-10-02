package net.collaud.gaetan.reservation.service;

import net.collaud.gaetan.reservation.ReservationApp;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.Date;

//@RunWith(SpringRunner.class)
//@SpringBootTest(classes = ReservationApp.class)
//@Transactional(propagation = Propagation.NOT_SUPPORTED)
public class CalendarServiceTest {

//	@Autowired
	private CalendarService calendarService;

	@Test
	public void testIcalAllowed() {
		calendarService = new CalendarService(new IcalLoaderService(new RestTemplate()));
		calendarService.isAllowed(new Date());
	}
}
