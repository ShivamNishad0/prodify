package com.hrms.modules.dmc.hiring.repository;

import com.hrms.modules.dmc.hiring.models.DmcDesignations;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface DmcDesignationsRepo extends JpaRepository<DmcDesignations, Long> {

	@Query(value = "SELECT * FROM dmc.dmc_designations WHERE desig_name ILIKE %:desig_name%  ORDER BY desig_id ASC LIMIT 1", nativeQuery = true)
    DmcDesignations findByDesig(@Param("desig_name") String desig_name);

}
