package com.hrms.modules.suda.payroll.repository;

import com.hrms.modules.suda.payroll.modles.SudaStaffLeaves;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.sql.Date;
import java.util.List;

public interface SudaStaffLeavesRepository extends JpaRepository<SudaStaffLeaves, Long> {
	 @Query(value = "SELECT * FROM suda.suda_staff_leaves WHERE staff_id = :staff_id", nativeQuery = true)
	List<SudaStaffLeaves> findLeaveByStaffId(@Param("staff_id")Long staff_id);

	@Query(value = "SELECT * FROM suda.suda_staff_leaves WHERE from_date=:from_date AND staff_id=:staff_id",nativeQuery = true)
	SudaStaffLeaves findByFromDate(@Param("from_date") Date from_date, @Param("staff_id")Long staff_id);

	@Query(value = "SELECT * FROM suda.suda_staff_leaves WHERE emp_no = :emp_no", nativeQuery = true)
	List<SudaStaffLeaves> findLeaveByEmp_no(@Param("emp_no") String emp_no);
}
