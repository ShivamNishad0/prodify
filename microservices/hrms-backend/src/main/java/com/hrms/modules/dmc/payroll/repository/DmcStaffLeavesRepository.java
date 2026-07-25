package com.hrms.modules.dmc.payroll.repository;

import com.hrms.modules.dmc.payroll.modles.DmcStaffLeaves;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.sql.Date;
import java.util.List;

public interface DmcStaffLeavesRepository extends JpaRepository<DmcStaffLeaves, Long> {
	 @Query(value = "SELECT * FROM dmc.dmc_staff_leaves WHERE staff_id = :staff_id", nativeQuery = true)
	List<DmcStaffLeaves> findLeaveByStaffId(@Param("staff_id")Long staff_id);

	@Query(value = "SELECT * FROM dmc.dmc_staff_leaves WHERE from_date=:from_date AND staff_id=:staff_id",nativeQuery = true)
	DmcStaffLeaves findByFromDate(@Param("from_date") Date from_date, @Param("staff_id")Long staff_id);

	@Query(value = "SELECT * FROM dmc.dmc_staff_leaves WHERE emp_no = :emp_no", nativeQuery = true)
	List<DmcStaffLeaves> findLeaveByEmp_no(@Param("emp_no") String emp_no);
}
