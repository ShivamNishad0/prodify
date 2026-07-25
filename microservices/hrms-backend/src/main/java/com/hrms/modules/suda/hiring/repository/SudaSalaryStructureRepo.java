package com.hrms.modules.suda.hiring.repository;

import com.hrms.modules.suda.hiring.models.SudaSalaryStructure;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;

public interface SudaSalaryStructureRepo extends JpaRepository<SudaSalaryStructure, Long> {

	@Query(value = "SELECT * FROM suda.suda_salary_structure WHERE gross = :gross", nativeQuery = true)
	SudaSalaryStructure findByGross(@Param("gross") BigDecimal gross);
	
	@Query(value = "SELECT * FROM suda.suda_salary_structure WHERE staff_id = :staff_id", nativeQuery = true)
	SudaSalaryStructure findByStaffId(@Param("staff_id")Long staff_id);

	@Query(value = "SELECT * FROM suda.suda_salary_structure WHERE target_based = 'TRUE'", nativeQuery = true)
	Page<SudaSalaryStructure> staffOnTarget(Pageable pageable);

	@Query(value = "SELECT bss.* FROM suda.suda_salary_structure AS bss " +
			"LEFT JOIN suda.suda_staff AS bs ON bs.staff_id = bss.staff_id " +
			"WHERE bss.target_based = 'TRUE' AND bs.area_id IN :area_id ORDER BY bss.emp_no", nativeQuery = true)
	Page<SudaSalaryStructure> staffOnTarget(@Param("area_id") Long[] areaId, Pageable pageable);

	@Query(value = "SELECT COUNT(*) FROM suda.suda_salary_structure  WHERE target_based = 'TRUE'", nativeQuery = true)
	Long countByZoneIdAndIsTargetBasedTrue();

	@Query(value = "SELECT bss.* FROM suda.suda_salary_structure AS bss " +
			"LEFT JOIN suda.suda_staff AS bs ON bs.staff_id = bss.staff_id " +
			"WHERE bss.target_based = 'TRUE' AND bs.area_id IN :area_id " +
			"AND bs.temp_emp LIKE %:emp_no% ORDER BY bss.emp_no", nativeQuery = true)
	Page<SudaSalaryStructure> staffOnTargetWithEmpNo(@Param("area_id") Long[] areaId,
													 @Param("emp_no") String emp_no,
													 Pageable pageable);

	@Query(value = "SELECT * FROM suda.suda_salary_structure WHERE emp_no LIKE %:emp_no% AND target_based = 'TRUE' ORDER BY emp_no", nativeQuery = true)
	Page<SudaSalaryStructure> staffOnTargetByEmpNo(@Param("emp_no") String empNo, Pageable pageable);


	@Query(value = "SELECT bss.* FROM suda.suda_salary_structure AS bss " +
			"LEFT JOIN suda.suda_staff AS bs ON bs.staff_id = bss.staff_id " +
			"WHERE bss.target_based = 'FALSE' AND bs.area_id IN :area_id " +
			"AND bs.temp_emp LIKE %:emp_no% ORDER BY bss.emp_no", nativeQuery = true)
	Page<SudaSalaryStructure> staffNotOnTargetWithEmpNo(@Param("area_id") Long[] areaId,
														@Param("emp_no") String emp_no,
														Pageable pageable);

	@Query(value = "SELECT bss.* FROM suda.suda_salary_structure AS bss " +
			"LEFT JOIN suda.suda_staff AS bs ON bs.staff_id = bss.staff_id " +
			"WHERE bss.target_based = 'FALSE' AND bs.area_id IN :area_id ORDER BY bss.emp_no", nativeQuery = true)
	Page<SudaSalaryStructure> staffNotOnTarget(@Param("area_id") Long[] areaId, Pageable pageable);


	@Query(value = "SELECT * FROM suda.suda_salary_structure WHERE target_based = 'FALSE'", nativeQuery = true)
	Page<SudaSalaryStructure> staffNotOnTarget(Pageable pageable);

	@Query(value = "SELECT * FROM suda.suda_salary_structure WHERE emp_no LIKE %:emp_no% AND target_based = 'FALSE' ORDER BY emp_no", nativeQuery = true)
	Page<SudaSalaryStructure> staffNotOnTargetByEmpNo(@Param("emp_no") String empNo, Pageable pageable);


	@Query(value = "SELECT bss.* FROM suda.suda_salary_structure AS bss " +
			"LEFT JOIN suda.suda_staff AS bs ON bs.staff_id = bss.staff_id " +
			"WHERE bss.target_based = 'FIXED' AND bs.area_id IN :area_id " +
			"AND bs.temp_emp LIKE %:emp_no% ORDER BY bss.emp_no", nativeQuery = true)
	Page<SudaSalaryStructure> staffOnFixedWithEmpNo(@Param("area_id") Long[] areaId,
													 @Param("emp_no") String emp_no,
													 Pageable pageable);

	@Query(value = "SELECT bss.* FROM suda.suda_salary_structure AS bss " +
			"LEFT JOIN suda.suda_staff AS bs ON bs.staff_id = bss.staff_id " +
			"WHERE bss.target_based = 'FIXED' AND bs.area_id IN :area_id ORDER BY bss.emp_no", nativeQuery = true)
	Page<SudaSalaryStructure> staffOnFixed(@Param("area_id") Long[] areaId, Pageable pageable);

	@Query(value = "SELECT * FROM suda.suda_salary_structure WHERE emp_no LIKE %:emp_no% AND target_based = 'FIXED' ORDER BY emp_no", nativeQuery = true)
	Page<SudaSalaryStructure> staffOnFixedByEmpNo(@Param("emp_no") String empNo, Pageable pageable);

	@Query(value = "SELECT * FROM suda.suda_salary_structure WHERE target_based = 'FIXED'", nativeQuery = true)
	Page<SudaSalaryStructure> staffOnFixed(Pageable pageable);

	@Query(value = "SELECT * FROM suda.suda_salary_structure WHERE emp_no = :emp_no", nativeQuery = true)
	SudaSalaryStructure findByEmpNo(@Param("emp_no") String emp_no);
}
