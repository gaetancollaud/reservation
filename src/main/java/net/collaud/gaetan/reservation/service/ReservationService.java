package net.collaud.gaetan.reservation.service;

import net.collaud.gaetan.reservation.domain.Interval;
import net.collaud.gaetan.reservation.domain.Reservation;
import net.collaud.gaetan.reservation.domain.Resource;
import net.collaud.gaetan.reservation.domain.User;
import net.collaud.gaetan.reservation.exceptions.ReservationConflictException;
import net.collaud.gaetan.reservation.exceptions.ResourceLimitationException;
import net.collaud.gaetan.reservation.repository.ReservationRepository;
import net.collaud.gaetan.reservation.repository.ResourceRepository;
import net.collaud.gaetan.reservation.security.AuthoritiesConstants;
import net.collaud.gaetan.reservation.security.SecurityUtils;
import net.collaud.gaetan.reservation.service.dto.critieria.ReservationCriteria;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Transactional
@Service
public class ReservationService {
	@Autowired
	private ReservationRepository reservationRepository;

	@Autowired
	private ResourceRepository resourceRepository;

	@Autowired
	private UserService userService;

	@Autowired
	private CalendarService calendarService;

	public Reservation addReservation(Reservation reservation) {
		reservation.setUser(userService.getCurrentUserOrThrow());
		checkConflict(reservation);
		checkReservationRestriction(reservation);
		return reservationRepository.save(reservation);
	}

	public Reservation editReservation(Reservation reservation) {
		Reservation old = checkSecurity(reservation.getId());
		checkConflict(reservation);
		checkReservationRestriction(reservation);

		// update the updatable field
		old.setResource(reservation.getResource());
		old.setTimestampStart(reservation.getTimestampStart());
		old.setTimestampEnd(reservation.getTimestampEnd());

		return reservationRepository.save(old);
	}

	public void deleteReservation(long reservationId) {
		checkSecurity(reservationId);
		reservationRepository.deleteById(reservationId);
	}

	protected void checkConflict(Reservation reservation) {
		Optional<Reservation> inConflict = reservationRepository.search(new ReservationCriteria(
			reservation.getTimestampStart(),
			reservation.getTimestampEnd(),
			reservation.getResource().getId())).stream()
			.filter(r -> !r.getId().equals(reservation.getId()))
			.findFirst();

		inConflict.ifPresent(conflict -> {
			throw new ReservationConflictException("Conflict found with reservation " + conflict.getId());
		});
	}

	protected Reservation checkSecurity(long reservationId) {
		Reservation old = reservationRepository.getOne(reservationId);
		if (SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.RESERVATION_MANAGE)) {
			return old;
		}
		User currentUser = userService.getCurrentUserOrThrow();
		if (!currentUser.getId().equals(old.getUser().getId())) {
			throw new RuntimeException("You cannot edit the reservation of others");
		}
		return old;
	}

	protected void checkReservationRestriction(Reservation reservation) {
		Resource resource = resourceRepository.getOne(reservation.getResource().getId());
		if (!StringUtils.isEmpty(resource.getCalendarLink())) {
			Optional<String> regex = Optional.ofNullable(resource.getCalendarSearchRegex())
				.filter(v -> !StringUtils.isEmpty(v));
			Interval interval = new Interval(reservation.getTimestampStart().toInstant(), reservation.getTimestampEnd().toInstant());

			if (!calendarService.isAllowed(
				resource.getCalendarLink(),
				regex,
				interval)) {
				throw new ResourceLimitationException("Unable to book because there is a calendar restriction");
			}
		}
	}
}
