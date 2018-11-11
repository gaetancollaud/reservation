package net.collaud.gaetan.reservation.service.mapper;

import net.collaud.gaetan.reservation.domain.*;
import net.collaud.gaetan.reservation.service.dto.ReservationDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity Reservation and its DTO ReservationDTO.
 */
@Mapper(componentModel = "spring", uses = {ResourceMapper.class, UserMapper.class})
public interface ReservationMapper extends EntityMapper<ReservationDTO, Reservation> {

    @Mapping(source = "resource.id", target = "resourceId")
    @Mapping(source = "user.id", target = "userId")
    ReservationDTO toDto(Reservation reservation);

    @Mapping(source = "resourceId", target = "resource")
    @Mapping(source = "userId", target = "user")
    Reservation toEntity(ReservationDTO reservationDTO);

    default Reservation fromId(Long id) {
        if (id == null) {
            return null;
        }
        Reservation reservation = new Reservation();
        reservation.setId(id);
        return reservation;
    }
}
