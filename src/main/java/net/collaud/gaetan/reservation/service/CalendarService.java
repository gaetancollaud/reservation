package net.collaud.gaetan.reservation.service;

import net.collaud.gaetan.reservation.domain.Interval;
import net.fortuna.ical4j.model.*;
import net.fortuna.ical4j.model.component.CalendarComponent;
import net.fortuna.ical4j.model.property.DtEnd;
import net.fortuna.ical4j.model.property.DtStart;
import net.fortuna.ical4j.model.property.RRule;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;

@Service
public class CalendarService {

	private final Logger LOG = LoggerFactory.getLogger(CalendarService.class);

	private final IcalLoaderService icalLoaderService;

	@Autowired
	public CalendarService(IcalLoaderService icalLoaderService) {
		this.icalLoaderService = icalLoaderService;
	}

	public boolean isAllowed(String icalUrl, Optional<String> regex, Interval requestedInterval) {
		try {

			Calendar calendar = icalLoaderService.getCalendar(icalUrl);

			Date dateToTest = new Date(requestedInterval.getStart().toEpochMilli());

			ComponentList<CalendarComponent> components = calendar.getComponents();
			return components.stream()
				.filter(comp -> comp.getProperty("SUMMARY") != null)
				.filter(comp -> !regex.isPresent() || comp.getProperty("SUMMARY").getValue().matches(regex.get()))
				.anyMatch(comp -> {
//					LOG.info("\tComp: {}", comp.getName());
//					comp.getProperties().forEach(prop -> {
//						LOG.info("\t\tProp: {}={}", prop.getName(), prop.getValue());
//					});

					Date dtstart = ((DtStart) comp.getProperty("DTSTART")).getDate();
					Date dtend = ((DtEnd) comp.getProperty("DTEND")).getDate();

					Property rrule = comp.getProperty("RRULE");
					if (rrule != null) {
						// recurence
						Recur recur = ((RRule) rrule).getRecur();
						Date nextDateStart = recur.getNextDate(dtstart, dateToTest);
						Date nextDateEnd = recur.getNextDate(dtend, dateToTest);
						if (nextDateStart == null || nextDateEnd == null) {
							return false;
						}
						Interval eventInterval = new Interval(nextDateStart.toInstant(), nextDateEnd.toInstant());
						return eventInterval.canContains(requestedInterval);
					} else {
						Interval eventInterval = new Interval(dtstart.toInstant(), dtend.toInstant());
						return eventInterval.canContains(requestedInterval);
					}
				});
		} catch (Exception ex) {
			throw new RuntimeException("Unable to check for date", ex);
		}
	}

	protected boolean isInBetween(Date from, Date to, Instant instantToTest) {
		// from <= instant <= to
		return !from.toInstant().isAfter(instantToTest) && !to.toInstant().isBefore(instantToTest);
	}
}
