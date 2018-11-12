package net.collaud.gaetan.reservation.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.Objects;

/**
 * A Reservation.
 */
@Entity
@Table(name = "reservation")
//@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Reservation implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "timestamp_start")
    private ZonedDateTime timestampStart;

    @Column(name = "timestamp_end")
    private ZonedDateTime timestampEnd;

    @ManyToOne
    @JsonIgnoreProperties("")
    private Resource resource;

    @ManyToOne
    @JsonIgnoreProperties("")
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ZonedDateTime getTimestampStart() {
        return timestampStart;
    }

    public Reservation timestampStart(ZonedDateTime timestampStart) {
        this.timestampStart = timestampStart;
        return this;
    }

    public void setTimestampStart(ZonedDateTime timestampStart) {
        this.timestampStart = timestampStart;
    }

    public ZonedDateTime getTimestampEnd() {
        return timestampEnd;
    }

    public Reservation timestampEnd(ZonedDateTime timestampEnd) {
        this.timestampEnd = timestampEnd;
        return this;
    }

    public void setTimestampEnd(ZonedDateTime timestampEnd) {
        this.timestampEnd = timestampEnd;
    }

    public Resource getResource() {
        return resource;
    }

    public Reservation resource(Resource resource) {
        this.resource = resource;
        return this;
    }

    public void setResource(Resource resource) {
        this.resource = resource;
    }

    public User getUser() {
        return user;
    }

    public Reservation user(User user) {
        this.user = user;
        return this;
    }

    public void setUser(User user) {
        this.user = user;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Reservation reservation = (Reservation) o;
        if (reservation.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), reservation.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Reservation{" +
            "id=" + getId() +
            ", timestampStart='" + getTimestampStart() + "'" +
            ", timestampEnd='" + getTimestampEnd() + "'" +
            "}";
    }
}
