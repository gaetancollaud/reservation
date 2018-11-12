package net.collaud.gaetan.reservation.repository;

import net.collaud.gaetan.reservation.domain.ResourceType;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the ResourceType entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ResourceTypeRepository extends JpaRepository<ResourceType, Long> {

}
