package com.hrms.modules.rmc.hiring.repository;

import com.hrms.modules.rmc.hiring.models.RmcSalaryStructure;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface RmcSalaryStructureRepo extends JpaRepository<RmcSalaryStructure, Long> {

	@Query(value = "SELECT * FROM rmc.rmc_salary_structure WHERE gross = :gross", nativeQuery = true)
	RmcSalaryStructure findByGross(@Param("gross") BigDecimal gross);
	
	@Query(value = "SELECT * FROM rmc.rmc_salary_structure WHERE staff_id = :staff_id", nativeQuery = true)
	RmcSalaryStructure findByStaffId(@Param("staff_id")Long staff_id);

	@Query(value = "SELECT * FROM rmc.rmc_salary_structure WHERE target_based = 'TRUE' ORDER BY emp_no", nativeQuery = true)
	Page<RmcSalaryStructure> staffOnTarget(Pageable pageable);

	@Query(value = "SELECT COUNT(*) FROM rmc.rmc_salary_structure  WHERE target_based = 'TRUE'", nativeQuery = true)
	Long countByZoneIdAndIsTargetBasedTrue();

	@Query(value = "SELECT * FROM rmc.rmc_salary_structure WHERE emp_no LIKE %:searchTerm%", nativeQuery = true)
	List<RmcSalaryStructure> methodForSearch(@Param("searchTerm")String searchTerm);

	@Query(value = "SELECT * FROM rmc.rmc_salary_structure WHERE emp_no LIKE %:emp_no% AND target_based = 'TRUE' ORDER BY emp_no",nativeQuery = true)
	Page<RmcSalaryStructure> staffOnTargetByEmpNo(@Param("emp_no") String empNo, Pageable pageable);

	@Query(value = "SELECT bss.* FROM rmc.rmc_salary_structure AS bss " +
			"LEFT JOIN rmc.rmc_staff AS bs ON bs.staff_id = bss.staff_id " +
			"WHERE bss.target_based = 'FIXED' AND bs.area_id IN :area_id " +
			"AND bs.temp_emp LIKE %:emp_no% ORDER BY bss.emp_no", nativeQuery = true)
	Page<RmcSalaryStructure> staffOnFixedWithEmpNo(@Param("area_id") Long[] areaId,
												   @Param("emp_no") String emp_no,
												   Pageable pageable);

	@Query(value = "SELECT bss.* FROM rmc.rmc_salary_structure AS bss " +
			"LEFT JOIN rmc.rmc_staff AS bs ON bs.staff_id = bss.staff_id " +
			"WHERE bss.target_based = 'FIXED' AND bs.area_id IN :area_id ORDER BY bss.emp_no", nativeQuery = true)
	Page<RmcSalaryStructure> staffOnFixed(@Param("area_id") Long[] areaId, Pageable pageable);

	@Query(value = "SELECT * FROM rmc.rmc_salary_structure WHERE emp_no LIKE %:emp_no% AND target_based = 'FIXED' ORDER BY emp_no", nativeQuery = true)
	Page<RmcSalaryStructure> staffOnFixedByEmpNo(@Param("emp_no") String empNo, Pageable pageable);

	@Query(value = "SELECT * FROM rmc.rmc_salary_structure WHERE target_based = 'FIXED'", nativeQuery = true)
	Page<RmcSalaryStructure> staffOnFixed(Pageable pageable);

	@Query(value = "SELECT bss.* FROM rmc.rmc_salary_structure AS bss " +
			"LEFT JOIN rmc.rmc_staff AS bs ON bs.staff_id = bss.staff_id " +
			"WHERE bss.target_based = 'TRUE' AND bs.area_id IN :area_id " +
			"AND bs.temp_emp LIKE %:emp_no% ORDER BY bss.emp_no", nativeQuery = true)
	Page<RmcSalaryStructure> staffOnTargetWithEmpNo(@Param("area_id") Long[] areaId,
													@Param("emp_no") String emp_no,
													Pageable pageable);

	@Query(value = "SELECT bss.* FROM rmc.rmc_salary_structure AS bss " +
			"LEFT JOIN rmc.rmc_staff AS bs ON bs.staff_id = bss.staff_id " +
			"WHERE bss.target_based = 'TRUE' AND bs.area_id IN :area_id ORDER BY bss.emp_no", nativeQuery = true)
	Page<RmcSalaryStructure> staffOnTarget(@Param("area_id") Long[] areaId, Pageable pageable);

	@Query(value = "SELECT * FROM rmc.rmc_salary_structure WHERE emp_no = :emp_no", nativeQuery = true)
	RmcSalaryStructure findByEmpNo(@Param("emp_no") String emp_no);
}
