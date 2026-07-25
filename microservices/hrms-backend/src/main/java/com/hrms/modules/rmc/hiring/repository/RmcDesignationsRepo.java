package com.hrms.modules.rmc.hiring.repository;

import com.hrms.modules.rmc.hiring.models.RmcDesignations;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface RmcDesignationsRepo extends JpaRepository<RmcDesignations, Long> {
	@Query(value = "SELECT * FROM rmc.rmc_designations WHERE desig_name ILIKE %:desig_name%  ORDER BY desig_id ASC LIMIT 1", nativeQuery = true)
    RmcDesignations findByDesig(@Param("desig_name") String desig_name);
}
