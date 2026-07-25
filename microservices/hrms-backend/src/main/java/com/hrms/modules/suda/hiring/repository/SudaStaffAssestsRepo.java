package com.hrms.modules.suda.hiring.repository;

import com.hrms.modules.suda.hiring.models.SudaStaffAssests;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SudaStaffAssestsRepo extends JpaRepository<SudaStaffAssests, Long> {
	@Query(value = "SELECT * FROM suda.suda_staff_assests WHERE staff_id =:staff_id", nativeQuery = true)
	List<SudaStaffAssests> findByStaff(@Param("staff_id") Long staff_id);

	@Query(value = "SELECT * FROM suda.suda_staff_assests WHERE emp_no =:emp_no", nativeQuery = true)
	List<SudaStaffAssests> findByEmpNo(@Param("emp_no") String emp_no);
}
