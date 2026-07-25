package com.hrms.modules.ho.payroll.repository;

import com.hrms.modules.ho.payroll.modles.HoStaffLeaves;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.sql.Date;
import java.util.List;

public interface HoStaffLeavesRepository extends JpaRepository<HoStaffLeaves, Long> {
	 @Query(value = "SELECT * FROM ho.ho_staff_leaves WHERE staff_id = :staff_id", nativeQuery = true)
	List<HoStaffLeaves> findLeaveByStaffId(@Param("staff_id")Long staff_id);

	 @Query(value = "SELECT * FROM ho.ho_staff_leaves WHERE from_date=:from_date AND staff_id=:staff_id",nativeQuery = true)
	HoStaffLeaves findByFromDate(@Param("from_date")Date from_date,@Param("staff_id")Long staff_id);

	HoStaffLeaves findByFromDateLessThanEqualAndToDateGreaterThanEqual(Date fromDate, Date toDate);

	@Query(value = "SELECT * FROM ho.ho_staff_leaves WHERE emp_no = :emp_no", nativeQuery = true)
	List<HoStaffLeaves> findLeaveByEmp_no(@Param("emp_no")String emp_no);
}
