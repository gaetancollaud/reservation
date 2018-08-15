package net.collaud.gaetan.reservation.service;

import net.collaud.gaetan.reservation.domain.Reservation;
import net.collaud.gaetan.reservation.repository.ReservationRepository;
import net.collaud.gaetan.reservation.security.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ReservationService {
	@Autowired
	private ReservationRepository reservationRepository;

	@Autowired
	private UserService userService;

	public Reservation addReservation(Reservation reservation) {
		reservation.setUser(userService.getCurrentUserOrThrow());
		return reservationRepository.save(reservation);
	}

	public Reservation editReservation(Reservation reservation) {
		reservation.setUser(userService.getCurrentUserOrThrow());
		return reservationRepository.save(reservation);
	}

	public void deleteReservation(long reservationId) {
		reservationRepository.delete(reservationId);
	}


}
