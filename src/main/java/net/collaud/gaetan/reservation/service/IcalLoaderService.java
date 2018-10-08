package net.collaud.gaetan.reservation.service;

import net.fortuna.ical4j.data.CalendarBuilder;
import net.fortuna.ical4j.data.CalendarParser;
import net.fortuna.ical4j.data.CalendarParserFactory;
import net.fortuna.ical4j.extensions.parameter.Filename;
import net.fortuna.ical4j.extensions.property.WrCalName;
import net.fortuna.ical4j.extensions.property.WrTimezone;
import net.fortuna.ical4j.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.StringReader;
import java.net.URI;

@Service
public class IcalLoaderService {

	private final RestTemplate restTemplate;

	@Autowired
	public IcalLoaderService(RestTemplate restTemplate) {
		this.restTemplate = restTemplate;
	}


	// TODO add cache
	protected String loadIcal(String url) {
		try {
			String ical = restTemplate.getForObject(new URI(url), String.class);
			return ical;
		} catch (Exception ex) {
			throw new RuntimeException("Unable to get ical from " + url, ex);
		}
	}

	public Calendar getCalendar(String icalUrl) {
		String ical = loadIcal(icalUrl);

		CalendarParser parser = CalendarParserFactory.getInstance().createParser();

		PropertyFactoryRegistry propertyFactoryRegistry = new PropertyFactoryRegistry();
		propertyFactoryRegistry.register(WrTimezone.PROPERTY_NAME, new WrTimezone.Factory());
		propertyFactoryRegistry.register(WrCalName.PROPERTY_NAME, new WrCalName.Factory());

		ParameterFactoryRegistry parameterFactoryRegistry = new ParameterFactoryRegistry();
		parameterFactoryRegistry.register("FILENAME", new Filename.Factory());

		TimeZoneRegistry tzRegistry = TimeZoneRegistryFactory.getInstance().createRegistry();

		CalendarBuilder builder = new CalendarBuilder(parser, propertyFactoryRegistry, parameterFactoryRegistry, tzRegistry);
		try {
			return builder.build(new StringReader(ical));
		} catch (Exception ex) {
			throw new RuntimeException("Unable to parse calendar at " + icalUrl, ex);
		}
	}
}
