package net.collaud.gaetan.reservation.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;
import java.util.Objects;

/**
 * A Resource.
 */
@Entity
@Table(name = "resource")
//@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Resource implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "calendar_link")
    private String calendarLink;

    @Column(name = "calendar_search_regex")
    private String calendarSearchRegex;

    @ManyToOne
    @JsonIgnoreProperties("")
    private ResourceType type;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public Resource name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCalendarLink() {
        return calendarLink;
    }

    public Resource calendarLink(String calendarLink) {
        this.calendarLink = calendarLink;
        return this;
    }

    public void setCalendarLink(String calendarLink) {
        this.calendarLink = calendarLink;
    }

    public String getCalendarSearchRegex() {
        return calendarSearchRegex;
    }

    public Resource calendarSearchRegex(String calendarSearchRegex) {
        this.calendarSearchRegex = calendarSearchRegex;
        return this;
    }

    public void setCalendarSearchRegex(String calendarSearchRegex) {
        this.calendarSearchRegex = calendarSearchRegex;
    }

    public ResourceType getType() {
        return type;
    }

    public Resource type(ResourceType resourceType) {
        this.type = resourceType;
        return this;
    }

    public void setType(ResourceType resourceType) {
        this.type = resourceType;
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
        Resource resource = (Resource) o;
        if (resource.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), resource.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Resource{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", calendarLink='" + getCalendarLink() + "'" +
            ", calendarSearchRegex='" + getCalendarSearchRegex() + "'" +
            "}";
    }
}
