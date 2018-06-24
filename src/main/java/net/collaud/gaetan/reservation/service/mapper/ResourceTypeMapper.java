package net.collaud.gaetan.reservation.service.mapper;

import net.collaud.gaetan.reservation.domain.*;
import net.collaud.gaetan.reservation.service.dto.ResourceTypeDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity ResourceType and its DTO ResourceTypeDTO.
 */
@Mapper(componentModel = "spring", uses = {})
public interface ResourceTypeMapper extends EntityMapper<ResourceTypeDTO, ResourceType> {



    default ResourceType fromId(Long id) {
        if (id == null) {
            return null;
        }
        ResourceType resourceType = new ResourceType();
        resourceType.setId(id);
        return resourceType;
    }
}
