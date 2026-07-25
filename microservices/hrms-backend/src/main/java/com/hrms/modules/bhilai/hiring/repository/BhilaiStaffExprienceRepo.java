package com.hrms.modules.bhilai.hiring.repository;

import com.hrms.modules.bhilai.hiring.models.BhilaiStaffExprience;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BhilaiStaffExprienceRepo extends JpaRepository<BhilaiStaffExprience, Long> {

	@Query(value = "SELECT * FROM bhilai.bhilai_staff_exprience WHERE staff_id =:staffId", nativeQuery = true)
	List<BhilaiStaffExprience> findByStaff(@Param("staffId") Long staffId);
}
