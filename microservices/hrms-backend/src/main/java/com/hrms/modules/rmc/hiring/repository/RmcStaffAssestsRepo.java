package com.hrms.modules.rmc.hiring.repository;

import com.hrms.modules.rmc.hiring.models.RmcStaffAssests;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RmcStaffAssestsRepo extends JpaRepository<RmcStaffAssests, Long> {
	@Query(value = "SELECT * FROM rmc.rmc_staff_assests WHERE staff_id =:staff_id", nativeQuery = true)
	List<RmcStaffAssests> findByStaff(@Param("staff_id") Long staff_id);

	@Query(value = "SELECT * FROM rmc.rmc_staff_assests WHERE emp_no =:emp_no", nativeQuery = true)
	List<RmcStaffAssests> findByEmpNo(@Param("emp_no") String emp_no);
}
