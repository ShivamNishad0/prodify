package com.hrms.modules.bhilai.payroll.repository;


import com.hrms.modules.bhilai.payroll.modles.BhilaiStaffSalaryDetails;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BhilaiStaffSalaryDetailsRepository extends JpaRepository<BhilaiStaffSalaryDetails, Long> {
	@Query(value = "SELECT * FROM bhilai.bhilai_staff_salary_details WHERE staff_id = :staff_id AND month=:month AND year=:year", nativeQuery = true)
    BhilaiStaffSalaryDetails findBydetails(@Param("staff_id")Long staff_id, @Param("month")String month, @Param("year") String year);

	@Query(value = "SELECT * FROM bhilai.bhilai_staff_salary_details WHERE emp_no = :emp_no AND month=:month AND year=:year", nativeQuery = true)
    BhilaiStaffSalaryDetails findBydetails(@Param("emp_no")String emp_no, @Param("month")String month, @Param("year") String year);

	@Query(value = "SELECT * FROM bhilai.bhilai_staff_salary_details WHERE month = :month AND year = :year AND  is_target_based='FALSE'", nativeQuery = true)
	Page<BhilaiStaffSalaryDetails> findAllData(@Param("month") String month, @Param("year") String year, Pageable pageable);

	@Query(value = "SELECT * FROM bhilai.bhilai_staff_salary_details WHERE month = :month AND year = :year AND is_target_based='TRUE' ORDER BY emp_no", nativeQuery = true)
	Page<BhilaiStaffSalaryDetails> findAllDataForTarget(@Param("month") String month, @Param("year") String year, Pageable pageable);
	 
	@Query(value = "SELECT COUNT(*) FROM bhilai.bhilai_staff_salary_details", nativeQuery = true)
	Long foundData();

	@Query(value = "SELECT COUNT(*) FROM bhilai.bhilai_staff_salary_details WHERE is_target_based='TRUE' ", nativeQuery = true)
	Long foundDataOfTargetBased();
	
	@Query(value = "SELECT * FROM bhilai.bhilai_staff_salary_details WHERE emp_no LIKE %:searchTerm% AND month=:month AND year=:year AND is_target_based=:is_target_based", nativeQuery = true)
	List<BhilaiStaffSalaryDetails> findStaffByTempEmpOrContactNo(@Param("searchTerm") String searchTerm, @Param("month") String month, @Param("year") String year, @Param("is_target_based") String is_target_based);
	
	@Query(value = "SELECT COUNT(*) FROM bhilai.bhilai_staff_salary_details WHERE emp_no LIKE %:emp_no%", nativeQuery = true)
    Long countStaffByTempEmp(@Param("emp_no") String emp_no);
	
	@Query(value = "SELECT * FROM bhilai.bhilai_staff_salary_details WHERE emp_no =:emp_no", nativeQuery = true)
	List<BhilaiStaffSalaryDetails> advDetailsOfEmp(@Param("emp_no") String emp_no);
	
	@Query(value = "SELECT * FROM bhilai.bhilai_staff_salary_details WHERE month =:month AND year =:year ", nativeQuery = true)
	List<BhilaiStaffSalaryDetails> detailsByMonth(@Param("month") String emp_no, @Param("year") String year);

	@Query(value = "SELECT * FROM bhilai.bhilai_staff_salary_details WHERE emp_no = :emp_no AND month=:month AND year=:year", nativeQuery = true)
    BhilaiStaffSalaryDetails findStaffBydetails(@Param("emp_no")String emp_no, @Param("month")String month, @Param("year") String year);

	@Query(value = "SELECT * FROM bhilai.bhilai_staff_salary_details WHERE emp_no = :emp_no AND year = :year", nativeQuery = true)
	List<BhilaiStaffSalaryDetails> detailsAnnually(@Param("emp_no") String emp_no, @Param("year") String year);

	@Query(value = "SELECT * FROM bhilai.bhilai_staff_salary_details WHERE month = :month AND year = :year",nativeQuery = true)
	List<BhilaiStaffSalaryDetails> allDetailsForMonth(@Param("month") String month, @Param("year") String year);

	@Query(value = "SELECT * FROM bhilai.bhilai_staff_salary_details WHERE month=:month AND year=:year AND advance>0.00", nativeQuery = true)
	Page<BhilaiStaffSalaryDetails> findStaffByAdvance(@Param("month") String month, @Param("year") String year, Pageable pageable);

	@Query(value = "SELECT * FROM bhilai.bhilai_staff_salary_details WHERE emp_no=:emp_no", nativeQuery = true)
	List<BhilaiStaffSalaryDetails> findStaffByEmpNo(@Param("emp_no") String emp_no);

	@Query(value = "SELECT COUNT(*) FROM bhilai.bhilai_staff_salary_details WHERE month=:month AND year=:year AND advance>0.00 ", nativeQuery = true)
	Long foundCountOfAdv(@Param("month") String month, @Param("year") String year);


	@Query(value = "SELECT * FROM bhilai.bhilai_staff_salary_details WHERE month=:month AND year=:year AND deduction>0.00", nativeQuery = true)
	Page<BhilaiStaffSalaryDetails> findStaffByDeduction(@Param("month") String month, @Param("year") String year,  Pageable pageable);


	@Query(value = "SELECT COUNT(*) FROM bhilai.bhilai_staff_salary_details WHERE month=:month AND year=:year AND deduction>0.00 ", nativeQuery = true)
	Long foundCountOfDeduction(@Param("month") String month, @Param("year") String year);

	@Query(value = "SELECT bssd.* FROM bhilai.bhilai_staff_salary_details AS bssd JOIN bhilai.bhilai_staff AS bs ON bs.temp_emp = bssd.emp_no WHERE bssd.month = :month AND bssd.year = :year AND bssd.status = :status AND bssd.is_target_based = 'FALSE' AND bs.area_id IN :area_id AND (:desig_id IS NULL OR bs.desig_id = :desig_id) ORDER BY bssd.emp_no", nativeQuery = true)
	Page<BhilaiStaffSalaryDetails> findAllSalariedData(@Param("month") String month,
													   @Param("year") String year,
													   @Param("status") String status,
													   @Param("desig_id") Long desig_id,
													   @Param("area_id") Long[] area_id,
													   Pageable pageable);

	@Query(value = """
            SELECT COUNT(*) 
            FROM bhilai.bhilai_staff_salary_details AS bssd
            JOIN bhilai.bhilai_staff AS bs ON bs.temp_emp = bssd.emp_no
            WHERE bssd.month = :month 
              AND bssd.year = :year 
              AND bssd.status = :status 
              AND bssd.is_target_based = 'FALSE' 
              AND bs.area_id IN :area_id
              AND (:desig_id IS NULL OR bs.desig_id = :desig_id)
            """, nativeQuery = true)
	Long countAllSalariedData(
			@Param("month") String month,
			@Param("year") String year,
			@Param("status") String status,
			@Param("desig_id") Long desigId,
			@Param("area_id") Long[] areaId
	);

	@Query(value = "SELECT bssd.* FROM bhilai.bhilai_staff_salary_details AS bssd JOIN bhilai.bhilai_staff AS bs ON bs.temp_emp = bssd.emp_no WHERE bssd.month = :month AND bssd.year = :year AND bssd.status = :status AND bssd.is_target_based = 'FALSE' AND bs.area_id IN :area_id ORDER BY  bssd.emp_no", nativeQuery = true)
	Page<BhilaiStaffSalaryDetails> findAllSalariedData(@Param("month") String month,
													   @Param("year") String year,
													   @Param("status") String status,
													   @Param("area_id") Long[] area_id,
													   Pageable pageable);


	@Query(value = """
            SELECT COUNT(*) 
            FROM bhilai.bhilai_staff_salary_details AS bssd
            JOIN bhilai.bhilai_staff AS bs ON bs.temp_emp = bssd.emp_no
            WHERE bssd.month = :month 
              AND bssd.year = :year 
              AND bssd.status = :status 
              AND bssd.is_target_based = 'FALSE' 
              AND bs.area_id IN :area_id
            """, nativeQuery = true)
	Long countAllSalariedData(
			@Param("month") String month,
			@Param("year") String year,
			@Param("status") String status,
			@Param("area_id") Long[] areaId
	);

	@Query(value = "SELECT bssd.* FROM bhilai.bhilai_staff_salary_details AS bssd JOIN bhilai.bhilai_staff AS bs ON bs.temp_emp = bssd.emp_no WHERE bssd.month = :month AND bssd.year = :year AND bssd.status = :status AND bssd.is_target_based = 'FALSE' AND (:desig_id IS NULL OR bs.desig_id = :desig_id) ORDER BY  bssd.emp_no", nativeQuery = true)
	Page<BhilaiStaffSalaryDetails> findAllSalariedData(@Param("month") String month,
													   @Param("year") String year,
													   @Param("status") String status,
													   @Param("desig_id") Long desig_id, Pageable pageable);

	@Query(value = """
            SELECT COUNT(*) 
            FROM bhilai.bhilai_staff_salary_details AS bssd
            JOIN bhilai.bhilai_staff AS bs ON bs.temp_emp = bssd.emp_no
            WHERE bssd.month = :month 
              AND bssd.year = :year 
              AND bssd.status = :status 
              AND bssd.is_target_based = 'FALSE' 
              AND (:desig_id IS NULL OR bs.desig_id = :desig_id)
            """, nativeQuery = true)
	Long countAllSalariedData(
			@Param("month") String month,
			@Param("year") String year,
			@Param("status") String status,
			@Param("desig_id") Long desigId
	);

	@Query(value = "SELECT bssd.* FROM bhilai.bhilai_staff_salary_details AS bssd JOIN bhilai.bhilai_staff AS bs ON bs.temp_emp = bssd.emp_no WHERE bssd.month = :month AND bssd.year = :year AND bssd.status = :status AND bssd.is_target_based = 'FALSE' ORDER BY  bssd.emp_no", nativeQuery = true)
	Page<BhilaiStaffSalaryDetails> findAllSalariedData(@Param("month") String month,
													   @Param("year") String year,
													   @Param("status") String status,Pageable pageable);

	@Query(value = "SELECT COUNT(*) " +
			"FROM bhilai.bhilai_staff_salary_details AS bssd " +
			"JOIN bhilai.bhilai_staff AS bs " +
			"ON bs.temp_emp = bssd.emp_no " +
			"WHERE bssd.month = :month " +
			"AND bssd.year = :year " +
			"AND bssd.status = :status " +
			"AND bssd.is_target_based = 'FALSE' ",
			nativeQuery = true)
	Long foundDataSalaried(@Param("month") String month,
						   @Param("year") String year,
						   @Param("status") String status);

	@Query(value = "SELECT bssd.* FROM bhilai.bhilai_staff_salary_details AS bssd JOIN bhilai.bhilai_staff AS bs ON bs.temp_emp = bssd.emp_no WHERE bssd.month = :month AND bssd.year = :year AND bssd.status = :status AND bssd.is_target_based = 'TRUE' AND COALESCE(bs.desig_id, :desig_id) = :desig_id ORDER BY  bssd.emp_no", nativeQuery = true)
	Page<BhilaiStaffSalaryDetails> findAllDataForTargetEmp(@Param("month") String month,
														   @Param("year") String year,
														   @Param("status") String status,
														   @Param("desig_id") Long desig_id,
														   Pageable pageable);

	@Query(value = "SELECT COUNT(*) " +
			"FROM bhilai.bhilai_staff_salary_details AS bssd " +
			"JOIN bhilai.bhilai_staff AS bs " +
			"ON bs.temp_emp = bssd.emp_no " +
			"WHERE bssd.month = :month " +
			"AND bssd.year = :year " +
			"AND bssd.status = :status " +
			"AND bssd.is_target_based = 'TRUE' " +
			"AND (:desigId IS NULL OR bs.desig_id = :desigId)",
			nativeQuery = true)
	Long foundDataTarget(@Param("month") String month,
						 @Param("year") String year,
						 @Param("status") String status,
						 @Param("desigId") Long desigId);

	@Modifying
	@Query(value = "DELETE FROM bhilai.bhilai_staff_salary_details WHERE month = :month AND year = :year AND emp_no = :empNo", nativeQuery = true)
	void bulkDeleteByDetails(@Param("month") String month, @Param("year") String year, @Param("empNo") String empNo);

}
