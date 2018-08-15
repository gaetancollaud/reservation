package net.collaud.gaetan.reservation.web.rest;

import com.codahale.metrics.annotation.Timed;
import net.collaud.gaetan.reservation.domain.Reservation;

import net.collaud.gaetan.reservation.repository.ReservationRepository;
import net.collaud.gaetan.reservation.service.ReservationService;
import net.collaud.gaetan.reservation.service.dto.critieria.ReservationCriteria;
import net.collaud.gaetan.reservation.utils.EndOfDayTemporalAduster;
import net.collaud.gaetan.reservation.utils.StartOfDayTemporalAduster;
import net.collaud.gaetan.reservation.web.rest.errors.BadRequestAlertException;
import net.collaud.gaetan.reservation.web.rest.util.HeaderUtil;
import net.collaud.gaetan.reservation.service.dto.ReservationDTO;
import net.collaud.gaetan.reservation.service.mapper.ReservationMapper;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.time.ZonedDateTime;
import java.time.temporal.Temporal;
import java.time.temporal.TemporalAdjuster;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing Reservation.
 */
@RestController
@RequestMapping("/api")
public class ReservationResource {

    private final Logger log = LoggerFactory.getLogger(ReservationResource.class);

    private static final String ENTITY_NAME = "reservation";

    private final ReservationRepository reservationRepository;

    private final ReservationService reservationService;

    private final ReservationMapper reservationMapper;

    public ReservationResource(ReservationService reservationService, ReservationRepository reservationRepository, ReservationMapper reservationMapper) {
        this.reservationService = reservationService;
        this.reservationRepository = reservationRepository;
        this.reservationMapper = reservationMapper;
    }

    /**
     * POST  /reservations : Create a new reservation.
     *
     * @param reservationDTO the reservationDTO to create
     * @return the ResponseEntity with status 201 (Created) and with body the new reservationDTO, or with status 400 (Bad Request) if the reservation has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/reservations")
    @Timed
    public ResponseEntity<ReservationDTO> createReservation(@RequestBody ReservationDTO reservationDTO) throws URISyntaxException {
        log.debug("REST request to save Reservation : {}", reservationDTO);
        reservationDTO.setId(0L);
        Reservation reservation = reservationMapper.toEntity(reservationDTO);
        reservation = reservationService.addReservation(reservation);
        ReservationDTO result = reservationMapper.toDto(reservation);
        return ResponseEntity.created(new URI("/api/reservations/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /reservations : Updates an existing reservation.
     *
     * @param reservationDTO the reservationDTO to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated reservationDTO,
     * or with status 400 (Bad Request) if the reservationDTO is not valid,
     * or with status 500 (Internal Server Error) if the reservationDTO couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/reservations")
    @Timed
    public ResponseEntity<ReservationDTO> updateReservation(@RequestBody ReservationDTO reservationDTO) throws URISyntaxException {
        log.debug("REST request to update Reservation : {}", reservationDTO);
        if (reservationDTO.getId() == null) {
            return createReservation(reservationDTO);
        }
        Reservation reservation = reservationMapper.toEntity(reservationDTO);
        reservation = reservationService.editReservation(reservation);
        ReservationDTO result = reservationMapper.toDto(reservation);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, reservationDTO.getId().toString()))
            .body(result);
    }

    /**
     * GET  /reservations : get all the reservations.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of reservations in body
     */
    @GetMapping("/reservations")
    @Timed
    public List<ReservationDTO> getAllReservations() {
        log.debug("REST request to get all Reservations");
        List<Reservation> reservations = reservationRepository.findAll();
        return reservationMapper.toDto(reservations);
    }

    @PostMapping("/reservations/search")
    @Timed
    public List<ReservationDTO> search(@RequestBody ReservationCriteria criteria) {
        log.debug("Search in reservation {}", criteria);
        List<Reservation> reservations = reservationRepository.search(criteria);
        return reservationMapper.toDto(reservations);
    }

    /**
     * GET  /reservations/:id : get the "id" reservation.
     *
     * @param id the id of the reservationDTO to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the reservationDTO, or with status 404 (Not Found)
     */
    @GetMapping("/reservations/{id}")
    @Timed
    public ResponseEntity<ReservationDTO> getReservation(@PathVariable Long id) {
        log.debug("REST request to get Reservation : {}", id);
        Reservation reservation = reservationRepository.findOne(id);
        ReservationDTO reservationDTO = reservationMapper.toDto(reservation);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(reservationDTO));
    }

    /**
     * DELETE  /reservations/:id : delete the "id" reservation.
     *
     * @param id the id of the reservationDTO to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/reservations/{id}")
    @Timed
    public ResponseEntity<Void> deleteReservation(@PathVariable Long id) {
        log.debug("REST request to delete Reservation : {}", id);
        reservationService.deleteReservation(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
