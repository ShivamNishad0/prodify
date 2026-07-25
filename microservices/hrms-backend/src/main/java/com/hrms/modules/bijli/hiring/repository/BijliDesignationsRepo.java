package com.hrms.modules.bijli.hiring.repository;

import com.hrms.modules.bijli.hiring.models.BijliDesignations;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BijliDesignationsRepo extends JpaRepository<BijliDesignations, Long> {

	@Query(value = "SELECT * FROM bijli.bijli_designations WHERE desig_name ILIKE %:desig_name%  ORDER BY desig_id ASC LIMIT 1", nativeQuery = true)
    BijliDesignations findByDesig(@Param("desig_name") String desig_name);

}
