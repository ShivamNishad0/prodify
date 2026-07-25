package com.hrms.modules.rmc.payroll.repository;

import com.hrms.modules.rmc.payroll.modles.RmcStaffLeaves;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RmcStaffLeavesRepository extends JpaRepository<RmcStaffLeaves, Long> {
	 @Query(value = "SELECT * FROM rmc.rmc_staff_leaves WHERE staff_id = :staff_id", nativeQuery = true)
	List<RmcStaffLeaves> findLeaveByStaffId(@Param("staff_id")Long staff_id);

	@Query(value = "SELECT * FROM rmc.rmc_staff_leaves WHERE emp_no = :emp_no", nativeQuery = true)
	List<RmcStaffLeaves> findLeaveByEmp_no(@Param("emp_no") String emp_no);
}
