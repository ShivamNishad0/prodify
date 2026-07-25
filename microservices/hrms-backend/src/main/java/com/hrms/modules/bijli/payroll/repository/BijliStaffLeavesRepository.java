package com.hrms.modules.bijli.payroll.repository;

import com.hrms.modules.bijli.payroll.modles.BijliStaffLeaves;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.sql.Date;
import java.util.List;

public interface BijliStaffLeavesRepository extends JpaRepository<BijliStaffLeaves, Long> {
	 @Query(value = "SELECT * FROM bijli.bijli_staff_leaves WHERE staff_id = :staff_id", nativeQuery = true)
	List<BijliStaffLeaves> findLeaveByStaffId(@Param("staff_id")Long staff_id);

	@Query(value = "SELECT * FROM bijli.bijli_staff_leaves WHERE from_date=:from_date AND staff_id=:staff_id",nativeQuery = true)
	BijliStaffLeaves findByFromDate(@Param("from_date") Date from_date, @Param("staff_id")Long staff_id);

	@Query(value = "SELECT * FROM bijli.bijli_staff_leaves WHERE emp_no = :emp_no", nativeQuery = true)
	List<BijliStaffLeaves> findLeaveByEmp_no(@Param("emp_no")String emp_no);

}
