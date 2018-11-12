package net.collaud.gaetan.reservation.web.rest;

import net.collaud.gaetan.reservation.ReservationApp;

import net.collaud.gaetan.reservation.domain.ResourceType;
import net.collaud.gaetan.reservation.repository.ResourceTypeRepository;
import net.collaud.gaetan.reservation.service.dto.ResourceTypeDTO;
import net.collaud.gaetan.reservation.service.mapper.ResourceTypeMapper;
import net.collaud.gaetan.reservation.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.util.List;


import static net.collaud.gaetan.reservation.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the ResourceTypeResource REST controller.
 *
 * @see ResourceTypeResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = ReservationApp.class)
public class ResourceTypeResourceIntTest {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final Long DEFAULT_MIN_TIME_SEC = 1L;
    private static final Long UPDATED_MIN_TIME_SEC = 2L;

    private static final Long DEFAULT_MAX_TIME_SEC = 1L;
    private static final Long UPDATED_MAX_TIME_SEC = 2L;

    private static final Long DEFAULT_MAX_RESOURCE = 1L;
    private static final Long UPDATED_MAX_RESOURCE = 2L;

    @Autowired
    private ResourceTypeRepository resourceTypeRepository;

    @Autowired
    private ResourceTypeMapper resourceTypeMapper;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restResourceTypeMockMvc;

    private ResourceType resourceType;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final ResourceTypeResource resourceTypeResource = new ResourceTypeResource(resourceTypeRepository, resourceTypeMapper);
        this.restResourceTypeMockMvc = MockMvcBuilders.standaloneSetup(resourceTypeResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ResourceType createEntity(EntityManager em) {
        ResourceType resourceType = new ResourceType()
            .name(DEFAULT_NAME)
            .minTimeSec(DEFAULT_MIN_TIME_SEC)
            .maxTimeSec(DEFAULT_MAX_TIME_SEC)
            .maxResource(DEFAULT_MAX_RESOURCE);
        return resourceType;
    }

    @Before
    public void initTest() {
        resourceType = createEntity(em);
    }

    @Test
    @Transactional
    public void createResourceType() throws Exception {
        int databaseSizeBeforeCreate = resourceTypeRepository.findAll().size();

        // Create the ResourceType
        ResourceTypeDTO resourceTypeDTO = resourceTypeMapper.toDto(resourceType);
        restResourceTypeMockMvc.perform(post("/api/resource-types")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(resourceTypeDTO)))
            .andExpect(status().isCreated());

        // Validate the ResourceType in the database
        List<ResourceType> resourceTypeList = resourceTypeRepository.findAll();
        assertThat(resourceTypeList).hasSize(databaseSizeBeforeCreate + 1);
        ResourceType testResourceType = resourceTypeList.get(resourceTypeList.size() - 1);
        assertThat(testResourceType.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testResourceType.getMinTimeSec()).isEqualTo(DEFAULT_MIN_TIME_SEC);
        assertThat(testResourceType.getMaxTimeSec()).isEqualTo(DEFAULT_MAX_TIME_SEC);
        assertThat(testResourceType.getMaxResource()).isEqualTo(DEFAULT_MAX_RESOURCE);
    }

    @Test
    @Transactional
    public void createResourceTypeWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = resourceTypeRepository.findAll().size();

        // Create the ResourceType with an existing ID
        resourceType.setId(1L);
        ResourceTypeDTO resourceTypeDTO = resourceTypeMapper.toDto(resourceType);

        // An entity with an existing ID cannot be created, so this API call must fail
        restResourceTypeMockMvc.perform(post("/api/resource-types")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(resourceTypeDTO)))
            .andExpect(status().isBadRequest());

        // Validate the ResourceType in the database
        List<ResourceType> resourceTypeList = resourceTypeRepository.findAll();
        assertThat(resourceTypeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllResourceTypes() throws Exception {
        // Initialize the database
        resourceTypeRepository.saveAndFlush(resourceType);

        // Get all the resourceTypeList
        restResourceTypeMockMvc.perform(get("/api/resource-types?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(resourceType.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].minTimeSec").value(hasItem(DEFAULT_MIN_TIME_SEC.intValue())))
            .andExpect(jsonPath("$.[*].maxTimeSec").value(hasItem(DEFAULT_MAX_TIME_SEC.intValue())))
            .andExpect(jsonPath("$.[*].maxResource").value(hasItem(DEFAULT_MAX_RESOURCE.intValue())));
    }
    
    @Test
    @Transactional
    public void getResourceType() throws Exception {
        // Initialize the database
        resourceTypeRepository.saveAndFlush(resourceType);

        // Get the resourceType
        restResourceTypeMockMvc.perform(get("/api/resource-types/{id}", resourceType.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(resourceType.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.minTimeSec").value(DEFAULT_MIN_TIME_SEC.intValue()))
            .andExpect(jsonPath("$.maxTimeSec").value(DEFAULT_MAX_TIME_SEC.intValue()))
            .andExpect(jsonPath("$.maxResource").value(DEFAULT_MAX_RESOURCE.intValue()));
    }

    @Test
    @Transactional
    public void getNonExistingResourceType() throws Exception {
        // Get the resourceType
        restResourceTypeMockMvc.perform(get("/api/resource-types/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateResourceType() throws Exception {
        // Initialize the database
        resourceTypeRepository.saveAndFlush(resourceType);

        int databaseSizeBeforeUpdate = resourceTypeRepository.findAll().size();

        // Update the resourceType
        ResourceType updatedResourceType = resourceTypeRepository.findById(resourceType.getId()).get();
        // Disconnect from session so that the updates on updatedResourceType are not directly saved in db
        em.detach(updatedResourceType);
        updatedResourceType
            .name(UPDATED_NAME)
            .minTimeSec(UPDATED_MIN_TIME_SEC)
            .maxTimeSec(UPDATED_MAX_TIME_SEC)
            .maxResource(UPDATED_MAX_RESOURCE);
        ResourceTypeDTO resourceTypeDTO = resourceTypeMapper.toDto(updatedResourceType);

        restResourceTypeMockMvc.perform(put("/api/resource-types")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(resourceTypeDTO)))
            .andExpect(status().isOk());

        // Validate the ResourceType in the database
        List<ResourceType> resourceTypeList = resourceTypeRepository.findAll();
        assertThat(resourceTypeList).hasSize(databaseSizeBeforeUpdate);
        ResourceType testResourceType = resourceTypeList.get(resourceTypeList.size() - 1);
        assertThat(testResourceType.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testResourceType.getMinTimeSec()).isEqualTo(UPDATED_MIN_TIME_SEC);
        assertThat(testResourceType.getMaxTimeSec()).isEqualTo(UPDATED_MAX_TIME_SEC);
        assertThat(testResourceType.getMaxResource()).isEqualTo(UPDATED_MAX_RESOURCE);
    }

    @Test
    @Transactional
    public void updateNonExistingResourceType() throws Exception {
        int databaseSizeBeforeUpdate = resourceTypeRepository.findAll().size();

        // Create the ResourceType
        ResourceTypeDTO resourceTypeDTO = resourceTypeMapper.toDto(resourceType);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restResourceTypeMockMvc.perform(put("/api/resource-types")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(resourceTypeDTO)))
            .andExpect(status().isBadRequest());

        // Validate the ResourceType in the database
        List<ResourceType> resourceTypeList = resourceTypeRepository.findAll();
        assertThat(resourceTypeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteResourceType() throws Exception {
        // Initialize the database
        resourceTypeRepository.saveAndFlush(resourceType);

        int databaseSizeBeforeDelete = resourceTypeRepository.findAll().size();

        // Get the resourceType
        restResourceTypeMockMvc.perform(delete("/api/resource-types/{id}", resourceType.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<ResourceType> resourceTypeList = resourceTypeRepository.findAll();
        assertThat(resourceTypeList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ResourceType.class);
        ResourceType resourceType1 = new ResourceType();
        resourceType1.setId(1L);
        ResourceType resourceType2 = new ResourceType();
        resourceType2.setId(resourceType1.getId());
        assertThat(resourceType1).isEqualTo(resourceType2);
        resourceType2.setId(2L);
        assertThat(resourceType1).isNotEqualTo(resourceType2);
        resourceType1.setId(null);
        assertThat(resourceType1).isNotEqualTo(resourceType2);
    }

    @Test
    @Transactional
    public void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(ResourceTypeDTO.class);
        ResourceTypeDTO resourceTypeDTO1 = new ResourceTypeDTO();
        resourceTypeDTO1.setId(1L);
        ResourceTypeDTO resourceTypeDTO2 = new ResourceTypeDTO();
        assertThat(resourceTypeDTO1).isNotEqualTo(resourceTypeDTO2);
        resourceTypeDTO2.setId(resourceTypeDTO1.getId());
        assertThat(resourceTypeDTO1).isEqualTo(resourceTypeDTO2);
        resourceTypeDTO2.setId(2L);
        assertThat(resourceTypeDTO1).isNotEqualTo(resourceTypeDTO2);
        resourceTypeDTO1.setId(null);
        assertThat(resourceTypeDTO1).isNotEqualTo(resourceTypeDTO2);
    }

    @Test
    @Transactional
    public void testEntityFromId() {
        assertThat(resourceTypeMapper.fromId(42L).getId()).isEqualTo(42);
        assertThat(resourceTypeMapper.fromId(null)).isNull();
    }
}
