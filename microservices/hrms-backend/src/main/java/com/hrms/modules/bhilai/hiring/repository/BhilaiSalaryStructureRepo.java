package com.hrms.modules.bhilai.hiring.repository;

import com.hrms.modules.bhilai.hiring.models.BhilaiSalaryStructure;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;

public interface BhilaiSalaryStructureRepo extends JpaRepository<BhilaiSalaryStructure, Long> {

	@Query(value = "SELECT * FROM bhilai.bhilai_salary_structure WHERE gross = :gross", nativeQuery = true)
    BhilaiSalaryStructure findByGross(@Param("gross") BigDecimal gross);
	
	@Query(value = "SELECT * FROM bhilai.bhilai_salary_structure WHERE staff_id = :staff_id", nativeQuery = true)
    BhilaiSalaryStructure findByStaffId(@Param("staff_id")Long staff_id);

	@Query(value = "SELECT * FROM bhilai.bhilai_salary_structure WHERE target_based = 'TRUE'", nativeQuery = true)
	Page<BhilaiSalaryStructure> staffOnTarget(Pageable pageable);

	@Query(value = "SELECT COUNT(*) FROM bhilai.bhilai_salary_structure  WHERE target_based = 'TRUE'", nativeQuery = true)
	Long countByZoneIdAndIsTargetBasedTrue();
	@Query(value = "SELECT bss.* FROM bhilai.bhilai_salary_structure AS bss " +
			"LEFT JOIN bhilai.bhilai_staff AS bs ON bs.staff_id = bss.staff_id " +
			"WHERE bss.target_based = 'FALSE' AND bs.area_id IN :area_id " +
			"AND bs.temp_emp LIKE %:emp_no% ORDER BY bss.emp_no", nativeQuery = true)
	Page<BhilaiSalaryStructure> staffNotOnTargetWithEmpNo(@Param("area_id") Long[] areaId,
														  @Param("emp_no") String emp_no,
														  Pageable pageable);

	@Query(value = "SELECT bss.* FROM bhilai.bhilai_salary_structure AS bss " +
			"LEFT JOIN bhilai.bhilai_staff AS bs ON bs.staff_id = bss.staff_id " +
			"WHERE bss.target_based = 'FALSE' AND bs.area_id IN :area_id ORDER BY bss.emp_no", nativeQuery = true)
	Page<BhilaiSalaryStructure> staffNotOnTarget(@Param("area_id") Long[] areaId, Pageable pageable);

	@Query(value = "SELECT * FROM bhilai.bhilai_salary_structure WHERE emp_no LIKE %:emp_no% AND target_based = 'FALSE' ORDER BY emp_no", nativeQuery = true)
	Page<BhilaiSalaryStructure> staffNotOnTargetByEmpNo(@Param("emp_no") String empNo, Pageable pageable);

	@Query(value = "SELECT * FROM bhilai.bhilai_salary_structure WHERE target_based = 'FALSE'", nativeQuery = true)
	Page<BhilaiSalaryStructure> staffNotOnTarget(Pageable pageable);

	@Query(value = "SELECT * FROM bhilai.bhilai_salary_structure WHERE emp_no = :emp_no", nativeQuery = true)
	BhilaiSalaryStructure findByEmpNo(@Param("emp_no")String emp_no);

	@Query(value = "SELECT bss.* FROM bhilai.bhilai_salary_structure AS bss " +
			"LEFT JOIN bhilai.bhilai_staff AS bs ON bs.staff_id = bss.staff_id " +
			"WHERE bss.target_based = 'TRUE' AND bs.area_id IN :area_id " +
			"AND bs.temp_emp LIKE %:emp_no% ORDER BY bss.emp_no", nativeQuery = true)
	Page<BhilaiSalaryStructure> staffOnTargetWithEmpNo(@Param("area_id") Long[] areaId,
													   @Param("emp_no") String emp_no,	Pageable pageable);



	@Query(value = "SELECT bss.* FROM bhilai.bhilai_salary_structure AS bss " +
			"LEFT JOIN bhilai.bhilai_staff AS bs ON bs.staff_id = bss.staff_id " +
			"WHERE bss.target_based = 'TRUE' AND bs.area_id IN :area_id ORDER BY bss.emp_no", nativeQuery = true)
	Page<BhilaiSalaryStructure> staffOnTarget(@Param("area_id") Long[] areaId, Pageable pageable);


	@Query(value = "SELECT * FROM bhilai.bhilai_salary_structure WHERE emp_no LIKE %:emp_no% AND target_based = 'TRUE' ORDER BY emp_no",nativeQuery = true)
	Page<BhilaiSalaryStructure> staffOnTargetByEmpNo(@Param("emp_no") String empNo, Pageable pageable);

}
