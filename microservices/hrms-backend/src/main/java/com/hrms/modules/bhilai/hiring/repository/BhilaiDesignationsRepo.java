package com.hrms.modules.bhilai.hiring.repository;

import com.hrms.modules.bhilai.hiring.models.BhilaiDesignations;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BhilaiDesignationsRepo extends JpaRepository<BhilaiDesignations, Long> {

//	@Query(value = "SELECT * FROM designations WHERE desig_name = :desig_name", nativeQuery = true)
//	Designations FindByDesig_name(@Param("desig_name") String desig_name);

	@Query(value = "SELECT * FROM bhilai.bhilai_designations WHERE desig_name ILIKE %:desig_name%  ORDER BY desig_id ASC LIMIT 1", nativeQuery = true)
    BhilaiDesignations findByDesig(@Param("desig_name") String desig_name);


//	@Query(value = "SELECT * FROM designations WHERE desig_name =:desig_name AND zone_id=:zone_id ORDER BY desig_id ASC LIMIT 1", nativeQuery = true)
//	Designations findByDesig(@Param("desig_name") String desig_name, @Param("zone_id") Long zone_id);

}
