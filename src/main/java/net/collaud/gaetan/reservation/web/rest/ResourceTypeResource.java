package net.collaud.gaetan.reservation.web.rest;

import com.codahale.metrics.annotation.Timed;
import net.collaud.gaetan.reservation.domain.ResourceType;
import net.collaud.gaetan.reservation.repository.ResourceTypeRepository;
import net.collaud.gaetan.reservation.web.rest.errors.BadRequestAlertException;
import net.collaud.gaetan.reservation.web.rest.util.HeaderUtil;
import net.collaud.gaetan.reservation.service.dto.ResourceTypeDTO;
import net.collaud.gaetan.reservation.service.mapper.ResourceTypeMapper;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing ResourceType.
 */
@RestController
@RequestMapping("/api")
public class ResourceTypeResource {

    private final Logger log = LoggerFactory.getLogger(ResourceTypeResource.class);

    private static final String ENTITY_NAME = "resourceType";

    private final ResourceTypeRepository resourceTypeRepository;

    private final ResourceTypeMapper resourceTypeMapper;

    public ResourceTypeResource(ResourceTypeRepository resourceTypeRepository, ResourceTypeMapper resourceTypeMapper) {
        this.resourceTypeRepository = resourceTypeRepository;
        this.resourceTypeMapper = resourceTypeMapper;
    }

    /**
     * POST  /resource-types : Create a new resourceType.
     *
     * @param resourceTypeDTO the resourceTypeDTO to create
     * @return the ResponseEntity with status 201 (Created) and with body the new resourceTypeDTO, or with status 400 (Bad Request) if the resourceType has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/resource-types")
    @Timed
    public ResponseEntity<ResourceTypeDTO> createResourceType(@RequestBody ResourceTypeDTO resourceTypeDTO) throws URISyntaxException {
        log.debug("REST request to save ResourceType : {}", resourceTypeDTO);
        if (resourceTypeDTO.getId() != null) {
            throw new BadRequestAlertException("A new resourceType cannot already have an ID", ENTITY_NAME, "idexists");
        }

        ResourceType resourceType = resourceTypeMapper.toEntity(resourceTypeDTO);
        resourceType = resourceTypeRepository.save(resourceType);
        ResourceTypeDTO result = resourceTypeMapper.toDto(resourceType);
        return ResponseEntity.created(new URI("/api/resource-types/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /resource-types : Updates an existing resourceType.
     *
     * @param resourceTypeDTO the resourceTypeDTO to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated resourceTypeDTO,
     * or with status 400 (Bad Request) if the resourceTypeDTO is not valid,
     * or with status 500 (Internal Server Error) if the resourceTypeDTO couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/resource-types")
    @Timed
    public ResponseEntity<ResourceTypeDTO> updateResourceType(@RequestBody ResourceTypeDTO resourceTypeDTO) throws URISyntaxException {
        log.debug("REST request to update ResourceType : {}", resourceTypeDTO);
        if (resourceTypeDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }

        ResourceType resourceType = resourceTypeMapper.toEntity(resourceTypeDTO);
        resourceType = resourceTypeRepository.save(resourceType);
        ResourceTypeDTO result = resourceTypeMapper.toDto(resourceType);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, resourceTypeDTO.getId().toString()))
            .body(result);
    }

    /**
     * GET  /resource-types : get all the resourceTypes.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of resourceTypes in body
     */
    @GetMapping("/resource-types")
    @Timed
    public List<ResourceTypeDTO> getAllResourceTypes() {
        log.debug("REST request to get all ResourceTypes");
        List<ResourceType> resourceTypes = resourceTypeRepository.findAll();
        return resourceTypeMapper.toDto(resourceTypes);
    }

    /**
     * GET  /resource-types/:id : get the "id" resourceType.
     *
     * @param id the id of the resourceTypeDTO to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the resourceTypeDTO, or with status 404 (Not Found)
     */
    @GetMapping("/resource-types/{id}")
    @Timed
    public ResponseEntity<ResourceTypeDTO> getResourceType(@PathVariable Long id) {
        log.debug("REST request to get ResourceType : {}", id);
        Optional<ResourceTypeDTO> resourceTypeDTO = resourceTypeRepository.findById(id)
            .map(resourceTypeMapper::toDto);
        return ResponseUtil.wrapOrNotFound(resourceTypeDTO);
    }

    /**
     * DELETE  /resource-types/:id : delete the "id" resourceType.
     *
     * @param id the id of the resourceTypeDTO to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/resource-types/{id}")
    @Timed
    public ResponseEntity<Void> deleteResourceType(@PathVariable Long id) {
        log.debug("REST request to delete ResourceType : {}", id);

        resourceTypeRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
