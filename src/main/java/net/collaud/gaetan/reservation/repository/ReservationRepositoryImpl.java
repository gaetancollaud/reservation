package net.collaud.gaetan.reservation.repository;

import com.querydsl.core.types.Predicate;
import com.querydsl.jpa.impl.JPAQuery;
import com.sun.org.apache.regexp.internal.RE;
import net.collaud.gaetan.reservation.domain.QReservation;
import net.collaud.gaetan.reservation.domain.Reservation;
import net.collaud.gaetan.reservation.service.dto.critieria.ReservationCriteria;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.ArrayList;
import java.util.List;

/**
 * Spring Data JPA repository for the Reservation entity.
 */
@SuppressWarnings("unused")
@Repository
public class ReservationRepositoryImpl implements ReservationRepositoryCustom {

    private QReservation RESERVATION = QReservation.reservation;

    @PersistenceContext
    private EntityManager em;

    @Override
    public List<Reservation> search(ReservationCriteria criteria) {
        List<Predicate> predicates = new ArrayList<>();

        if(criteria.getFrom()!=null){
            predicates.add(RESERVATION.timestampEnd.after(criteria.getFrom()));
        }
        if(criteria.getTo()!=null){
            predicates.add(RESERVATION.timestampStart.before(criteria.getTo()));
        }

        return new JPAQuery<Reservation>(em)
            .select(RESERVATION)
            .from(RESERVATION)
            .where(predicates.toArray(new Predicate[predicates.size()]))
            .fetch();
    }
}
