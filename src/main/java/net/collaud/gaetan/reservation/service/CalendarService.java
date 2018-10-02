package net.collaud.gaetan.reservation.service;

import net.fortuna.ical4j.data.CalendarBuilder;
import net.fortuna.ical4j.data.CalendarParser;
import net.fortuna.ical4j.data.CalendarParserFactory;
import net.fortuna.ical4j.extensions.parameter.Filename;
import net.fortuna.ical4j.extensions.property.WrCalName;
import net.fortuna.ical4j.extensions.property.WrTimezone;
import net.fortuna.ical4j.model.*;
import net.fortuna.ical4j.model.component.CalendarComponent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.StringReader;
import java.util.Date;

@Service
public class CalendarService {

	private final Logger LOG = LoggerFactory.getLogger(CalendarService.class);

	private final IcalLoaderService icalLoaderService;

	@Autowired
	public CalendarService(IcalLoaderService icalLoaderService) {
		this.icalLoaderService = icalLoaderService;
	}

	public boolean isAllowed(Date date) {
		try {
			String icalUrl = "https://calendar.google.com/calendar/ical/nulu08ntleed9c5peukoeaifl8%40group.calendar.google.com/public/basic.ics";

			Calendar calendar = icalLoaderService.getCalendar(icalUrl);

			ComponentList<CalendarComponent> components = calendar.getComponents();
			components.stream()
				.filter(comp -> comp.getProperty("SUMMARY") != null)
				.filter(comp -> comp.getProperty("SUMMARY").getValue().contains("Formation Découpeuse laser par Julien"))
				.forEach(comp -> {
//					https://www.programcreek.com/java-api-examples/?api=net.fortuna.ical4j.model.property.RRule
					LOG.info("\tComp: {}", comp.getName());
					comp.getProperties().forEach(prop -> {
						LOG.info("\t\tProp: {}={}", prop.getName(), prop.getValue());
					});
				});
			return calendar != null;
		} catch (Exception ex) {
			throw new RuntimeException("Unable to check for date", ex);
		}
	}

}
