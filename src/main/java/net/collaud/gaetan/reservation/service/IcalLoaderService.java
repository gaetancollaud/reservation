package net.collaud.gaetan.reservation.service;

import net.collaud.gaetan.reservation.repository.UserRepository;
import net.fortuna.ical4j.data.CalendarBuilder;
import net.fortuna.ical4j.data.CalendarParser;
import net.fortuna.ical4j.data.CalendarParserFactory;
import net.fortuna.ical4j.extensions.parameter.Filename;
import net.fortuna.ical4j.extensions.property.WrCalName;
import net.fortuna.ical4j.extensions.property.WrTimezone;
import net.fortuna.ical4j.model.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.StringReader;
import java.net.URI;
import java.time.Duration;
import java.time.Instant;
import java.util.Optional;

@Service
public class IcalLoaderService {

	private final Logger LOG = LoggerFactory.getLogger(IcalLoaderService.class);

	public static final String CACHE_ICAL_NAME = "cache_ical";
	public static final Duration CACHE_DURATION = Duration.ofMinutes(5);

	private final CacheManager cacheManager;

	private final RestTemplate restTemplate;

	@Autowired
	public IcalLoaderService(CacheManager cacheManager, RestTemplate restTemplate) {
		this.cacheManager = cacheManager;
		this.restTemplate = restTemplate;
	}

	protected String loadIcal(String url) {
		try {
			String ical = restTemplate.getForObject(new URI(url), String.class);
			return ical;
		} catch (Exception ex) {
			throw new RuntimeException("Unable to get ical from " + url, ex);
		}
	}

	public Calendar getCalendar(String icalUrl) {
		return getCachedCalendar(icalUrl)
			.map(v -> {
				LOG.debug("Using cache for {}", icalUrl);
				return v;
			})
			.orElseGet(() -> {
				LOG.debug("No cache for {}, fetching ical", icalUrl);
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
					Calendar calendar = builder.build(new StringReader(ical));
					CachedCalendar cached = new CachedCalendar(calendar);
					Cache cache = cacheManager.getCache(CACHE_ICAL_NAME);
					cache.put(icalUrl, cached);
					return cached;
				} catch (Exception ex) {
					throw new RuntimeException("Unable to parse calendar at " + icalUrl, ex);
				}
			}).calendar;
	}

	protected Optional<CachedCalendar> getCachedCalendar(String icalUrl) {
		Cache cache = cacheManager.getCache(CACHE_ICAL_NAME);
		return Optional.ofNullable(cache.get(icalUrl, CachedCalendar.class))
			.filter(CachedCalendar::isValid);
	}

	public static class CachedCalendar {
		private Calendar calendar;
		private Instant cacheTime;

		public CachedCalendar(Calendar calendar) {
			this.calendar = calendar;
			this.cacheTime = Instant.now();
		}

		public Calendar getCalendar() {
			return calendar;
		}

		public boolean isValid() {
			return Duration.between(Instant.now(), cacheTime).compareTo(CACHE_DURATION) <= 0;
		}
	}
}
