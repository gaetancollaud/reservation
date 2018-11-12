package net.collaud.gaetan.reservation.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;
import java.util.Objects;

/**
 * A ResourceType.
 */
@Entity
@Table(name = "resource_type")
//@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class ResourceType implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "min_time_sec")
    private Long minTimeSec;

    @Column(name = "max_time_sec")
    private Long maxTimeSec;

    @Column(name = "max_resource")
    private Long maxResource;

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

    public ResourceType name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getMinTimeSec() {
        return minTimeSec;
    }

    public ResourceType minTimeSec(Long minTimeSec) {
        this.minTimeSec = minTimeSec;
        return this;
    }

    public void setMinTimeSec(Long minTimeSec) {
        this.minTimeSec = minTimeSec;
    }

    public Long getMaxTimeSec() {
        return maxTimeSec;
    }

    public ResourceType maxTimeSec(Long maxTimeSec) {
        this.maxTimeSec = maxTimeSec;
        return this;
    }

    public void setMaxTimeSec(Long maxTimeSec) {
        this.maxTimeSec = maxTimeSec;
    }

    public Long getMaxResource() {
        return maxResource;
    }

    public ResourceType maxResource(Long maxResource) {
        this.maxResource = maxResource;
        return this;
    }

    public void setMaxResource(Long maxResource) {
        this.maxResource = maxResource;
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
        ResourceType resourceType = (ResourceType) o;
        if (resourceType.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), resourceType.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "ResourceType{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", minTimeSec=" + getMinTimeSec() +
            ", maxTimeSec=" + getMaxTimeSec() +
            ", maxResource=" + getMaxResource() +
            "}";
    }
}
