package net.collaud.gaetan.reservation.service.dto;


import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the ResourceType entity.
 */
public class ResourceTypeDTO implements Serializable {

    private Long id;

    private String name;

    private Long minTimeSec;

    private Long maxTimeSec;

    private Long maxResource;

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

    public Long getMinTimeSec() {
        return minTimeSec;
    }

    public void setMinTimeSec(Long minTimeSec) {
        this.minTimeSec = minTimeSec;
    }

    public Long getMaxTimeSec() {
        return maxTimeSec;
    }

    public void setMaxTimeSec(Long maxTimeSec) {
        this.maxTimeSec = maxTimeSec;
    }

    public Long getMaxResource() {
        return maxResource;
    }

    public void setMaxResource(Long maxResource) {
        this.maxResource = maxResource;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        ResourceTypeDTO resourceTypeDTO = (ResourceTypeDTO) o;
        if(resourceTypeDTO.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), resourceTypeDTO.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "ResourceTypeDTO{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", minTimeSec=" + getMinTimeSec() +
            ", maxTimeSec=" + getMaxTimeSec() +
            ", maxResource=" + getMaxResource() +
            "}";
    }
}
