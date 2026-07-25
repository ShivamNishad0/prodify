package com.hrms.modules.rmc.hiring.repository;

import com.hrms.modules.rmc.hiring.models.RmcStaffArea;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RmcStaffAreaRepo extends JpaRepository<RmcStaffArea, Long> {
	@Query(value = "SELECT * FROM rmc.rmc_staff_area WHERE staff_id = :staffId", nativeQuery = true)
    List<RmcStaffArea> findByStaff(@Param("staffId") Long staffId);

	@Query(value = "SELECT * FROM rmc.rmc_staff_area WHERE sub_division ILIKE %:sub_division% ORDER BY area_id ASC LIMIT 1", nativeQuery = true)
	RmcStaffArea findBySubdivision(@Param("sub_division") String sub_division);
	
	@Query(value="SELECT * FROM rmc.rmc_staff_area", nativeQuery = true)
	List<RmcStaffArea> areaByZone (@Param("zone_id")Long zone_id);
}
