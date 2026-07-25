package com.hrms.modules.bhilai.hiring.repository;

import com.hrms.modules.bhilai.hiring.models.BhilaiStaffQualification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BhilaiStaffQualificationRepo extends JpaRepository<BhilaiStaffQualification, Long> {
	@Query(value = "SELECT * FROM bhilai.bhilai_staff_qualification WHERE staff_id =:staffId", nativeQuery = true)
	List<BhilaiStaffQualification> findByStaffId(@Param("staffId") Long staffId);
}
