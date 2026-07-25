package com.hrms.modules.bijli.hiring.repository;

import com.hrms.modules.bijli.hiring.models.BijliStaffArea;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BijliStaffAreaRepo extends JpaRepository<BijliStaffArea, Long> {
	@Query(value = "SELECT * FROM bijli.bijli_staff_area WHERE staff_id = :staffId", nativeQuery = true)
    List<BijliStaffArea> findByStaff(@Param("staffId") Long staffId);
	
	@Query(value = "SELECT * FROM bijli.bijli_staff_area WHERE sub_division ILIKE %:sub_division% ORDER BY area_id ASC LIMIT 1", nativeQuery = true)
	BijliStaffArea findBySubdivision(@Param("sub_division") String sub_division);
	
	@Query(value="SELECT * FROM bijli.bijli_staff_area ", nativeQuery = true)
	List<BijliStaffArea> areaByZone ();
}
