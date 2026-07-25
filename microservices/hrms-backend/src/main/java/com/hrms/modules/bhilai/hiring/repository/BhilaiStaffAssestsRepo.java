package com.hrms.modules.bhilai.hiring.repository;

import com.hrms.modules.bhilai.hiring.models.BhilaiStaffAssests;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BhilaiStaffAssestsRepo extends JpaRepository<BhilaiStaffAssests, Long> {
	@Query(value = "SELECT * FROM bhilai.bhilai_staff_assests WHERE staff_id =:staff_id", nativeQuery = true)
	List<BhilaiStaffAssests> findByStaff(@Param("staff_id") Long staff_id);

	@Query(value = "SELECT * FROM bhilai.bhilai_staff_assests WHERE emp_no =:emp_no", nativeQuery = true)
	List<BhilaiStaffAssests> findByEmpNo(@Param("emp_no") String emp_no);

}
