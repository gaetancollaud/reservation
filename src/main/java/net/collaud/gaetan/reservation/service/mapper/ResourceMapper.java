package net.collaud.gaetan.reservation.service.mapper;

import net.collaud.gaetan.reservation.domain.*;
import net.collaud.gaetan.reservation.service.dto.ResourceDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity Resource and its DTO ResourceDTO.
 */
@Mapper(componentModel = "spring", uses = {ResourceTypeMapper.class})
public interface ResourceMapper extends EntityMapper<ResourceDTO, Resource> {

    @Mapping(source = "type.id", target = "typeId")
    ResourceDTO toDto(Resource resource);

    @Mapping(source = "typeId", target = "type")
    Resource toEntity(ResourceDTO resourceDTO);

    default Resource fromId(Long id) {
        if (id == null) {
            return null;
        }
        Resource resource = new Resource();
        resource.setId(id);
        return resource;
    }
}
