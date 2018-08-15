package net.collaud.gaetan.reservation.service;

import net.collaud.gaetan.reservation.domain.Reservation;
import net.collaud.gaetan.reservation.domain.User;
import net.collaud.gaetan.reservation.repository.ReservationRepository;
import net.collaud.gaetan.reservation.security.AuthoritiesConstants;
import net.collaud.gaetan.reservation.security.SecurityUtils;
import net.collaud.gaetan.reservation.service.dto.critieria.ReservationCriteria;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReservationService {
	@Autowired
	private ReservationRepository reservationRepository;

	@Autowired
	private UserService userService;

	public Reservation addReservation(Reservation reservation) {
		reservation.setUser(userService.getCurrentUserOrThrow());
		checkConflict(reservation);
		return reservationRepository.save(reservation);
	}

	public Reservation editReservation(Reservation reservation) {
		Reservation old = checkSecurity(reservation.getId());
		checkConflict(reservation);

		// update the updatable field
		old.setResource(reservation.getResource());
		old.setTimestampStart(reservation.getTimestampStart());
		old.setTimestampEnd(reservation.getTimestampEnd());

		return reservationRepository.save(old);
	}

	public void deleteReservation(long reservationId) {
		checkSecurity(reservationId);
		reservationRepository.delete(reservationId);
	}

	protected void checkConflict(Reservation reservation) {
		Optional<Reservation> inConflict = reservationRepository.search(new ReservationCriteria(
			reservation.getTimestampStart(),
			reservation.getTimestampEnd(),
			reservation.getResource().getId())).stream()
			.filter(r -> !r.getId().equals(reservation.getId()))
			.findFirst();

		inConflict.ifPresent(conflict -> {
			throw new RuntimeException("Conflict found with reservation " + conflict.getId());
		});
	}

	protected Reservation checkSecurity(long reservationId) {
		Reservation old = reservationRepository.findOne(reservationId);
		if (SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.RESERVATION_MANAGE)) {
			return old;
		}
		User currentUser = userService.getCurrentUserOrThrow();
		if (!currentUser.getId().equals(old.getUser().getId())) {
			throw new RuntimeException("You cannot edit the reservation of others");
		}
		return old;
	}


}
