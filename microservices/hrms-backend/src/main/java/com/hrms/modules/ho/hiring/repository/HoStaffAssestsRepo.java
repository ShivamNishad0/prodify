package com.hrms.modules.ho.hiring.repository;

import com.hrms.modules.ho.hiring.models.HoStaffAssests;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface HoStaffAssestsRepo extends JpaRepository<HoStaffAssests, Long> {
	@Query(value = "SELECT * FROM ho.ho_staff_assests WHERE staff_id =:staff_id", nativeQuery = true)
	List<HoStaffAssests> findByStaff(@Param("staff_id") Long staff_id);

	@Query(value = "SELECT * FROM ho.ho_staff_assests WHERE emp_no =:emp_no", nativeQuery = true)
	List<HoStaffAssests> findByEmpNo(@Param("emp_no") String emp_no);
}
