package net.collaud.gaetan.reservation.service.dto;

import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the Resource entity.
 */
public class ResourceDTO implements Serializable {

    private Long id;

    private String name;

    private String calendarLink;

    private String calendarSearchRegex;

    private Long typeId;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCalendarLink() {
        return calendarLink;
    }

    public void setCalendarLink(String calendarLink) {
        this.calendarLink = calendarLink;
    }

    public String getCalendarSearchRegex() {
        return calendarSearchRegex;
    }

    public void setCalendarSearchRegex(String calendarSearchRegex) {
        this.calendarSearchRegex = calendarSearchRegex;
    }

    public Long getTypeId() {
        return typeId;
    }

    public void setTypeId(Long resourceTypeId) {
        this.typeId = resourceTypeId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        ResourceDTO resourceDTO = (ResourceDTO) o;
        if (resourceDTO.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), resourceDTO.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "ResourceDTO{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", calendarLink='" + getCalendarLink() + "'" +
            ", calendarSearchRegex='" + getCalendarSearchRegex() + "'" +
            ", type=" + getTypeId() +
            "}";
    }
}
