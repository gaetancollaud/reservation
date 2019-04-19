package net.collaud.gaetan.reservation.service.dto;

import java.time.ZonedDateTime;
import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the Reservation entity.
 */
public class ReservationDTO implements Serializable {

    private Long id;

    private ZonedDateTime timestampStart;

    private ZonedDateTime timestampEnd;

    private Long resourceId;

    private Long userId;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ZonedDateTime getTimestampStart() {
        return timestampStart;
    }

    public void setTimestampStart(ZonedDateTime timestampStart) {
        this.timestampStart = timestampStart;
    }

    public ZonedDateTime getTimestampEnd() {
        return timestampEnd;
    }

    public void setTimestampEnd(ZonedDateTime timestampEnd) {
        this.timestampEnd = timestampEnd;
    }

    public Long getResourceId() {
        return resourceId;
    }

    public void setResourceId(Long resourceId) {
        this.resourceId = resourceId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        ReservationDTO reservationDTO = (ReservationDTO) o;
        if (reservationDTO.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), reservationDTO.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "ReservationDTO{" +
            "id=" + getId() +
            ", timestampStart='" + getTimestampStart() + "'" +
            ", timestampEnd='" + getTimestampEnd() + "'" +
            ", resource=" + getResourceId() +
            ", user='" + getUserId() + "'" +
            "}";
    }
}
