package com.hrms.modules.bhilai.hiring.repository;

import com.hrms.modules.bhilai.hiring.models.BhilaiStaffArea;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BhilaiStaffAreaRepo extends JpaRepository<BhilaiStaffArea, Long> {
	@Query(value = "SELECT * FROM bhilai.bhilai_staff_area WHERE staff_id = :staffId", nativeQuery = true)
    List<BhilaiStaffArea> findByStaff(@Param("staffId") Long staffId);
	
	
//	@Query(value = "SELECT * FROM designations WHERE sub_division = :sub_division", nativeQuery = true)
//	StaffArea FindBySub_division(@Param("sub_division") String sub_division);
	
	@Query(value = "SELECT * FROM bhilai.bhilai_staff_area WHERE sub_division ILIKE %:sub_division% ORDER BY area_id ASC LIMIT 1", nativeQuery = true)
	BhilaiStaffArea findBySubdivision(@Param("sub_division") String sub_division);
	
	@Query(value="SELECT * FROM bhilai.bhilai_staff_area", nativeQuery = true)
	List<BhilaiStaffArea> areaByZone ();
}
