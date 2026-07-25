package com.hrms.modules.dmc.hiring.repository;

import com.hrms.modules.dmc.hiring.models.DmcStaffArea;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DmcStaffAreaRepo extends JpaRepository<DmcStaffArea, Long> {
	@Query(value = "SELECT * FROM dmc.dmc_staff_area WHERE staff_id = :staffId", nativeQuery = true)
    List<DmcStaffArea> findByStaff(@Param("staffId") Long staffId);
	
	@Query(value = "SELECT * FROM dmc.dmc_staff_area WHERE sub_division ILIKE %:sub_division% ORDER BY area_id ASC LIMIT 1", nativeQuery = true)
	DmcStaffArea findBySubdivision(@Param("sub_division") String sub_division);
	
	@Query(value="SELECT * FROM dmc.dmc_staff_area", nativeQuery = true)
	List<DmcStaffArea> areaByZone (@Param("zone_id")Long zone_id);
}
