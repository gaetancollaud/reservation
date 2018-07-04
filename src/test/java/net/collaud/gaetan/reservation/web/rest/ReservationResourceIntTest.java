package net.collaud.gaetan.reservation.web.rest;

import net.collaud.gaetan.reservation.ReservationApp;

import net.collaud.gaetan.reservation.domain.Reservation;
import net.collaud.gaetan.reservation.repository.ReservationRepository;
import net.collaud.gaetan.reservation.service.ReservationService;
import net.collaud.gaetan.reservation.service.dto.ReservationDTO;
import net.collaud.gaetan.reservation.service.mapper.ReservationMapper;
import net.collaud.gaetan.reservation.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.time.Instant;
import java.time.ZonedDateTime;
import java.time.ZoneOffset;
import java.time.ZoneId;
import java.util.List;

import static net.collaud.gaetan.reservation.web.rest.TestUtil.sameInstant;
import static net.collaud.gaetan.reservation.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the ReservationResource REST controller.
 *
 * @see ReservationResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = ReservationApp.class)
public class ReservationResourceIntTest {

    private static final ZonedDateTime DEFAULT_TIMESTAMP_START = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_TIMESTAMP_START = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_TIMESTAMP_END = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_TIMESTAMP_END = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private ReservationService reservationService;

    @Autowired
    private ReservationMapper reservationMapper;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restReservationMockMvc;

    private Reservation reservation;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final ReservationResource reservationResource = new ReservationResource(reservationService, reservationRepository, reservationMapper);
        this.restReservationMockMvc = MockMvcBuilders.standaloneSetup(reservationResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     * <p>
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Reservation createEntity(EntityManager em) {
        Reservation reservation = new Reservation()
            .timestampStart(DEFAULT_TIMESTAMP_START)
            .timestampEnd(DEFAULT_TIMESTAMP_END);
        return reservation;
    }

    @Before
    public void initTest() {
        reservation = createEntity(em);
    }

    @Test
    @Transactional
    public void createReservation() throws Exception {
        int databaseSizeBeforeCreate = reservationRepository.findAll().size();

        // Create the Reservation
        ReservationDTO reservationDTO = reservationMapper.toDto(reservation);
        restReservationMockMvc.perform(post("/api/reservations")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(reservationDTO)))
            .andExpect(status().isCreated());

        // Validate the Reservation in the database
        List<Reservation> reservationList = reservationRepository.findAll();
        assertThat(reservationList).hasSize(databaseSizeBeforeCreate + 1);
        Reservation testReservation = reservationList.get(reservationList.size() - 1);
        assertThat(testReservation.getTimestampStart()).isEqualTo(DEFAULT_TIMESTAMP_START);
        assertThat(testReservation.getTimestampEnd()).isEqualTo(DEFAULT_TIMESTAMP_END);
    }

    @Test
    @Transactional
    public void createReservationWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = reservationRepository.findAll().size();

        // Create the Reservation with an existing ID
        reservation.setId(1L);
        ReservationDTO reservationDTO = reservationMapper.toDto(reservation);

        // An entity with an existing ID cannot be created, so this API call must fail
        restReservationMockMvc.perform(post("/api/reservations")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(reservationDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Reservation in the database
        List<Reservation> reservationList = reservationRepository.findAll();
        assertThat(reservationList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllReservations() throws Exception {
        // Initialize the database
        reservationRepository.saveAndFlush(reservation);

        // Get all the reservationList
        restReservationMockMvc.perform(get("/api/reservations?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(reservation.getId().intValue())))
            .andExpect(jsonPath("$.[*].timestampStart").value(hasItem(sameInstant(DEFAULT_TIMESTAMP_START))))
            .andExpect(jsonPath("$.[*].timestampEnd").value(hasItem(sameInstant(DEFAULT_TIMESTAMP_END))));
    }

    @Test
    @Transactional
    public void getReservation() throws Exception {
        // Initialize the database
        reservationRepository.saveAndFlush(reservation);

        // Get the reservation
        restReservationMockMvc.perform(get("/api/reservations/{id}", reservation.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(reservation.getId().intValue()))
            .andExpect(jsonPath("$.timestampStart").value(sameInstant(DEFAULT_TIMESTAMP_START)))
            .andExpect(jsonPath("$.timestampEnd").value(sameInstant(DEFAULT_TIMESTAMP_END)));
    }

    @Test
    @Transactional
    public void getNonExistingReservation() throws Exception {
        // Get the reservation
        restReservationMockMvc.perform(get("/api/reservations/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateReservation() throws Exception {
        // Initialize the database
        reservationRepository.saveAndFlush(reservation);
        int databaseSizeBeforeUpdate = reservationRepository.findAll().size();

        // Update the reservation
        Reservation updatedReservation = reservationRepository.findOne(reservation.getId());
        // Disconnect from session so that the updates on updatedReservation are not directly saved in db
        em.detach(updatedReservation);
        updatedReservation
            .timestampStart(UPDATED_TIMESTAMP_START)
            .timestampEnd(UPDATED_TIMESTAMP_END);
        ReservationDTO reservationDTO = reservationMapper.toDto(updatedReservation);

        restReservationMockMvc.perform(put("/api/reservations")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(reservationDTO)))
            .andExpect(status().isOk());

        // Validate the Reservation in the database
        List<Reservation> reservationList = reservationRepository.findAll();
        assertThat(reservationList).hasSize(databaseSizeBeforeUpdate);
        Reservation testReservation = reservationList.get(reservationList.size() - 1);
        assertThat(testReservation.getTimestampStart()).isEqualTo(UPDATED_TIMESTAMP_START);
        assertThat(testReservation.getTimestampEnd()).isEqualTo(UPDATED_TIMESTAMP_END);
    }

    @Test
    @Transactional
    public void updateNonExistingReservation() throws Exception {
        int databaseSizeBeforeUpdate = reservationRepository.findAll().size();

        // Create the Reservation
        ReservationDTO reservationDTO = reservationMapper.toDto(reservation);

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restReservationMockMvc.perform(put("/api/reservations")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(reservationDTO)))
            .andExpect(status().isCreated());

        // Validate the Reservation in the database
        List<Reservation> reservationList = reservationRepository.findAll();
        assertThat(reservationList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteReservation() throws Exception {
        // Initialize the database
        reservationRepository.saveAndFlush(reservation);
        int databaseSizeBeforeDelete = reservationRepository.findAll().size();

        // Get the reservation
        restReservationMockMvc.perform(delete("/api/reservations/{id}", reservation.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Reservation> reservationList = reservationRepository.findAll();
        assertThat(reservationList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Reservation.class);
        Reservation reservation1 = new Reservation();
        reservation1.setId(1L);
        Reservation reservation2 = new Reservation();
        reservation2.setId(reservation1.getId());
        assertThat(reservation1).isEqualTo(reservation2);
        reservation2.setId(2L);
        assertThat(reservation1).isNotEqualTo(reservation2);
        reservation1.setId(null);
        assertThat(reservation1).isNotEqualTo(reservation2);
    }

    @Test
    @Transactional
    public void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(ReservationDTO.class);
        ReservationDTO reservationDTO1 = new ReservationDTO();
        reservationDTO1.setId(1L);
        ReservationDTO reservationDTO2 = new ReservationDTO();
        assertThat(reservationDTO1).isNotEqualTo(reservationDTO2);
        reservationDTO2.setId(reservationDTO1.getId());
        assertThat(reservationDTO1).isEqualTo(reservationDTO2);
        reservationDTO2.setId(2L);
        assertThat(reservationDTO1).isNotEqualTo(reservationDTO2);
        reservationDTO1.setId(null);
        assertThat(reservationDTO1).isNotEqualTo(reservationDTO2);
    }

    @Test
    @Transactional
    public void testEntityFromId() {
        assertThat(reservationMapper.fromId(42L).getId()).isEqualTo(42);
        assertThat(reservationMapper.fromId(null)).isNull();
    }
}
