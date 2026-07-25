package com.hrms.modules.bijli.hiring.repository;

import com.hrms.modules.bijli.hiring.models.BijliSalaryStructure;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface BijliSalaryStructureRepo extends JpaRepository<BijliSalaryStructure, Long> {

    @Query(value = "SELECT * FROM bijli.bijli_salary_structure WHERE gross = :gross", nativeQuery = true)
    BijliSalaryStructure findByGross(@Param("gross") BigDecimal gross);

    @Query(value = "SELECT * FROM bijli.bijli_salary_structure WHERE staff_id = :staff_id", nativeQuery = true)
    BijliSalaryStructure findByStaffId(@Param("staff_id") Long staff_id);

    @Query(value = "SELECT * FROM bijli.bijli_salary_structure WHERE target_based = 'TRUE'", nativeQuery = true)
    Page<BijliSalaryStructure> staffOnTarget(Pageable pageable);

    @Query(value = "SELECT * FROM bijli.bijli_salary_structure WHERE target_based = 'FALSE'", nativeQuery = true)
    Page<BijliSalaryStructure> staffNotOnTarget(Pageable pageable);

    @Query(value = "SELECT bss.* FROM bijli.bijli_salary_structure AS bss " +
            "LEFT JOIN bijli.bijli_staff AS bs ON bs.staff_id = bss.staff_id " +
            "WHERE bss.target_based = 'TRUE' AND bs.area_id IN :area_id ORDER BY bss.emp_no", nativeQuery = true)
    Page<BijliSalaryStructure> staffOnTarget(@Param("area_id") Long[] areaId, Pageable pageable);


	@Query(value = "SELECT bss.* FROM bijli.bijli_salary_structure AS bss " +
			"LEFT JOIN bijli.bijli_staff AS bs ON bs.staff_id = bss.staff_id " +
			"WHERE bss.target_based = 'FALSE' AND bs.area_id IN :area_id ORDER BY bss.emp_no", nativeQuery = true)
	Page<BijliSalaryStructure> staffNotOnTarget(@Param("area_id") Long[] areaId, Pageable pageable);


    @Query(value = "SELECT bss.* FROM bijli.bijli_salary_structure AS bss " +
            "LEFT JOIN bijli.bijli_staff AS bs ON bs.staff_id = bss.staff_id " +
            "WHERE bss.target_based = 'TRUE' AND bs.area_id IN :area_id " +
            "AND bs.temp_emp LIKE %:emp_no% ORDER BY bss.emp_no", nativeQuery = true)
    Page<BijliSalaryStructure> staffOnTargetWithEmpNo(@Param("area_id") Long[] areaId,
                                                      @Param("emp_no") String emp_no,
                                                      Pageable pageable);

	@Query(value = "SELECT bss.* FROM bijli.bijli_salary_structure AS bss " +
			"LEFT JOIN bijli.bijli_staff AS bs ON bs.staff_id = bss.staff_id " +
			"WHERE bss.target_based = 'FALSE' AND bs.area_id IN :area_id " +
			"AND bs.temp_emp LIKE %:emp_no% ORDER BY bss.emp_no", nativeQuery = true)
	Page<BijliSalaryStructure> staffNotOnTargetWithEmpNo(@Param("area_id") Long[] areaId,
													  @Param("emp_no") String emp_no,
													  Pageable pageable);

    @Query(value = "SELECT bss.* FROM bijli.bijli_salary_structure AS bss " +
            "LEFT JOIN bijli.bijli_staff AS bs ON bs.staff_id = bss.staff_id " +
            "WHERE bss.target_based = 'TRUE' AND bs.area_id = :area_id AND bs.desig_id=:desig_id", nativeQuery = true)
    Page<BijliSalaryStructure> staffOnTargetWithDesignation(@Param("area_id") Long areaId, @Param("desig_id") Long desig_id, Pageable pageable);

    @Query(value = "SELECT bss.* FROM bijli.bijli_salary_structure AS bss " +
            "LEFT JOIN bijli.bijli_staff AS bs ON bs.staff_id = bss.staff_id " +
            "WHERE bss.target_based = 'TRUE' AND bs.area_id = :area_id AND bs.desig_id=:desig_id AND bs.temp_emp LIKE %:emp_no%", nativeQuery = true)
    Page<BijliSalaryStructure> staffOnTargetWithEmpNoAndDesignation(@Param("area_id") Long areaId, @Param("desig_id") Long desig_id, @Param("emp_no") String empNo, Pageable pageable);

    @Query(value = "SELECT COUNT(*) FROM bijli.bijli_salary_structure  WHERE target_based = 'FALSE'", nativeQuery = true)
    Integer countTargetBasedFalse();

    @Query(value = "SELECT * FROM bijli.bijli_salary_structure WHERE emp_no LIKE %:emp_no% AND target_based = 'TRUE' ORDER BY emp_no", nativeQuery = true)
    Page<BijliSalaryStructure> staffOnTargetByEmpNo(@Param("emp_no") String empNo, Pageable pageable);

	@Query(value = "SELECT * FROM bijli.bijli_salary_structure WHERE emp_no LIKE %:emp_no% AND target_based = 'FALSE' ORDER BY emp_no", nativeQuery = true)
	Page<BijliSalaryStructure> staffNotOnTargetByEmpNo(@Param("emp_no") String empNo, Pageable pageable);

    @Query(value = "SELECT COUNT(*) FROM bijli.bijli_salary_structure WHERE emp_no LIKE %:emp_no% AND target_based = 'TRUE'", nativeQuery = true)
    Long countStaffOnTargetByEmpNo(@Param("emp_no") String empNo);


    @Query(value = "WITH staff_data AS (  SELECT temp_emp, name, area_id, staff_id  FROM bijli.bijli_staff " +
            "    WHERE area_id IS NOT NULL ) SELECT sd.staff_id,sd.temp_emp, sd.name, sd.area_id, bss.gross, bstd.month, bstd.year, bss.ss_id," +
            "    bstd.extra_achived, bstd.target FROM staff_data AS sd LEFT JOIN bijli.bijli_salary_structure AS bss ON sd.staff_id = bss.staff_id " +
            "LEFT JOIN bijli.bijli_staff_target_details AS bstd ON sd.temp_emp = bstd.emp_no WHERE bss.target_based = 'TRUE' " +
            "  AND bstd.month = :month AND bstd.year = :year AND sd.area_id = :area_id ",
            nativeQuery = true)
//	AND sd.temp_emp LIKE :temp_emp
    Page<Object[]> uniqueSearch(@Param("month") String month, @Param("year") String year, @Param("area_id") Long area_id, Pageable pageable);

    //	@Query(value = "SELECT COUNT(*) FROM bijli.bijli_salary_structure AS bss " +
//			"LEFT JOIN bijli.bijli_staff AS bs ON bs.staff_id = bss.staff_id " +
//			"WHERE bss.target_based = 'TRUE' AND bs.area_id = :area_id",
//			nativeQuery = true)
//	Long countByAreaId(@Param("area_id") Long area_id);
    @Query(value = "SELECT COUNT(*) FROM bijli.bijli_salary_structure AS bss " +
            "LEFT JOIN bijli.bijli_staff AS bs ON bs.staff_id = bss.staff_id " +
            "WHERE bss.target_based = 'TRUE' AND bs.area_id IN :area_id",
            nativeQuery = true)
    Long countByAreaId(@Param("area_id") Long[] area_id);


    @Query(value = "SELECT * FROM bijli.bijli_salary_structure WHERE emp_no = :emp_no", nativeQuery = true)
    BijliSalaryStructure findByEmpNo(@Param("emp_no")String emp_no);
}
