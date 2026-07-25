package com.hrms.modules.ho.hiring.repository;

import com.hrms.modules.ho.hiring.models.HoDesignations;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface HoDesignationsRepo extends JpaRepository<HoDesignations, Long> {


	@Query(value = "SELECT * FROM ho.ho_designations WHERE desig_name ILIKE %:desig_name%  ORDER BY desig_id ASC LIMIT 1", nativeQuery = true)
    HoDesignations findByDesig(@Param("desig_name") String desig_name);

}
