package net.collaud.gaetan.reservation.repository;

import net.collaud.gaetan.reservation.domain.Reservation;
import net.collaud.gaetan.reservation.service.dto.critieria.ReservationCriteria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.ZonedDateTime;
import java.util.List;

/**
 * Spring Data JPA repository for the Reservation entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ReservationRepositoryCustom{

    List<Reservation> search(ReservationCriteria criteria);

}
