package com.hrms.modules.suda.hiring.repository;

import com.hrms.modules.suda.hiring.models.SudaDesignations;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SudaDesignationsRepo extends JpaRepository<SudaDesignations, Long> {


	@Query(value = "SELECT * FROM suda.suda_designations WHERE desig_name ILIKE %:desig_name%  ORDER BY desig_id ASC LIMIT 1", nativeQuery = true)
    SudaDesignations findByDesig(@Param("desig_name") String desig_name);

}
