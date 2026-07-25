package com.hrms.modules.dmc.hiring.repository;

import com.hrms.modules.dmc.hiring.models.DmcStaffAssests;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DmcStaffAssestsRepo extends JpaRepository<DmcStaffAssests, Long> {
	@Query(value = "SELECT * FROM dmc.dmc_staff_assests WHERE staff_id =:staff_id", nativeQuery = true)
	List<DmcStaffAssests> findByStaff(@Param("staff_id") Long staff_id);

	@Query(value = "SELECT * FROM dmc.dmc_staff_assests WHERE emp_no =:emp_no", nativeQuery = true)
	List<DmcStaffAssests> findByEmpNo(@Param("emp_no") String emp_no);
}
