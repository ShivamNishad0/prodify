package com.hrms.modules.suda.hiring.repository;

import com.hrms.modules.suda.hiring.models.SudaStaffArea;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SudaStaffAreaRepo extends JpaRepository<SudaStaffArea, Long> {
	@Query(value = "SELECT * FROM suda.suda_staff_area WHERE staff_id = :staffId", nativeQuery = true)
    List<SudaStaffArea> findByStaff(@Param("staffId") Long staffId);

	@Query(value = "SELECT * FROM suda.suda_staff_area WHERE sub_division ILIKE %:sub_division% ORDER BY area_id ASC LIMIT 1", nativeQuery = true)
	SudaStaffArea findBySubdivision(@Param("sub_division") String sub_division);
	
	@Query(value="SELECT * FROM suda.suda_staff_area", nativeQuery = true)
	List<SudaStaffArea> areaByZone (@Param("zone_id")Long zone_id);
}
