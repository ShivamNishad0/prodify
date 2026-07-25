package com.hrms.modules.bijli.hiring.repository;

import com.hrms.modules.bijli.hiring.models.BijliStaffAssests;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BijliStaffAssestsRepo extends JpaRepository<BijliStaffAssests, Long> {
	@Query(value = "SELECT * FROM bijli.bijli_staff_assests WHERE staff_id =:staff_id", nativeQuery = true)
	List<BijliStaffAssests> findByStaff(@Param("staff_id") Long staff_id);

	@Query(value = "SELECT * FROM bijli.bijli_staff_assests WHERE emp_no =:emp_no", nativeQuery = true)
	List<BijliStaffAssests> findByEmpNo(@Param("emp_no") String emp_no);
}
