package com.hrms.modules.ho.hiring.repository;

import com.hrms.modules.ho.hiring.models.HoSalaryStructure;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface HoSalaryStructureRepo extends JpaRepository<HoSalaryStructure, Long> {

	
	@Query(value = "SELECT * FROM ho.ho_salary_structure WHERE staff_id = :staff_id", nativeQuery = true)
	HoSalaryStructure findByStaffId(@Param("staff_id")Long staff_id);

	@Query(value = "SELECT * FROM ho.ho_salary_structure WHERE target_based = 'TRUE'", nativeQuery = true)
	Page<HoSalaryStructure> staffOnTarget(Pageable pageable);

	@Query(value = "SELECT COUNT(*) FROM ho.ho_salary_structure  WHERE target_based = 'TRUE'", nativeQuery = true)
	Long countByZoneIdAndIsTargetBasedTrue();

	@Query(value = "SELECT * FROM ho.ho_salary_structure WHERE emp_no = :emp_no", nativeQuery = true)
	HoSalaryStructure findByEmpNo(@Param("emp_no")String emp_no);
}
