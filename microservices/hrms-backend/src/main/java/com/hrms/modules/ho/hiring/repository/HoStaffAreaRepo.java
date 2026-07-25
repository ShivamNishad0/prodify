package com.hrms.modules.ho.hiring.repository;

import com.hrms.modules.ho.hiring.models.HoStaffArea;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface HoStaffAreaRepo extends JpaRepository<HoStaffArea, Long> {
	@Query(value = "SELECT * FROM ho.ho_staff_area WHERE staff_id = :staffId", nativeQuery = true)
    List<HoStaffArea> findByStaff(@Param("staffId") Long staffId);
	
	@Query(value = "SELECT * FROM ho.ho_staff_area WHERE sub_division ILIKE %:sub_division% ORDER BY area_id ASC LIMIT 1", nativeQuery = true)
	HoStaffArea findBySubdivision(@Param("sub_division") String sub_division);
	
	@Query(value="SELECT * FROM ho.ho_staff_area ", nativeQuery = true)
	List<HoStaffArea> areaByZone ();
}
