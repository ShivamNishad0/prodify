package com.hrms.modules.suda.payroll.repository;


import com.hrms.modules.suda.payroll.modles.SudaStaffSalaryDetails;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SudaStaffSalaryDetailsRepository extends JpaRepository<SudaStaffSalaryDetails, Long> {
	@Query(value = "SELECT * FROM suda.suda_staff_salary_details WHERE staff_id = :staff_id AND month=:month AND year=:year", nativeQuery = true)
    SudaStaffSalaryDetails findBydetails(@Param("staff_id")Long staff_id, @Param("month")String month, @Param("year") String year);

	@Query(value = "SELECT * FROM suda.suda_staff_salary_details WHERE emp_no = :emp_no AND month=:month AND year=:year", nativeQuery = true)
	SudaStaffSalaryDetails findBydetails(@Param("emp_no")String emp_no, @Param("month")String month, @Param("year") String year);

	@Query(value = "SELECT * FROM suda.suda_staff_salary_details WHERE month = :month AND year = :year AND is_target_based='FALSE'", nativeQuery = true)
	Page<SudaStaffSalaryDetails> findAllData(@Param("month") String month, @Param("year") String year, Pageable pageable);

	@Query(value = "SELECT * FROM suda.suda_staff_salary_details WHERE month = :month AND year = :year AND is_target_based='TRUE' ORDER BY emp_no", nativeQuery = true)
	Page<SudaStaffSalaryDetails> findAllDataForTarget(@Param("month") String month, @Param("year") String year,  Pageable pageable);

	@Query(value = "SELECT bssd.* FROM suda.suda_staff_salary_details AS bssd JOIN suda.suda_staff AS bs ON bs.staff_id = bssd.staff_id WHERE bssd.month = :month AND bssd.year = :year " +
			"AND bssd.is_target_based = 'TRUE' AND bs.area_id IN :area_id ORDER BY  bssd.emp_no",
			nativeQuery = true)
	Page<SudaStaffSalaryDetails> findAllDataForTarget(@Param("month") String month,@Param("year") String year,@Param("area_id") List<Long> areaIds,Pageable pageable);


	@Query(value = "SELECT COUNT(*) FROM suda.suda_staff_salary_details", nativeQuery = true)
	Long foundData();

	@Query(value = "SELECT COUNT(*) FROM suda.suda_staff_salary_details WHERE is_target_based='TRUE' ", nativeQuery = true)
	Long foundDataOfTargetBased();
	
	@Query(value = "SELECT * FROM suda.suda_staff_salary_details WHERE emp_no LIKE %:searchTerm% AND month=:month AND year=:year AND is_target_based=:is_target_based", nativeQuery = true)
	List<SudaStaffSalaryDetails> findStaffByTempEmpOrContactNo(@Param("searchTerm") String searchTerm, @Param("month") String month, @Param("year") String year, @Param("is_target_based") String is_target_based);
	
	@Query(value = "SELECT COUNT(*) FROM suda.suda_staff_salary_details WHERE emp_no LIKE %:emp_no%", nativeQuery = true)
    Long countStaffByTempEmp(@Param("emp_no") String emp_no);
	
	@Query(value = "SELECT * FROM suda.suda_staff_salary_details WHERE emp_no =:emp_no", nativeQuery = true)
	List<SudaStaffSalaryDetails> advDetailsOfEmp(@Param("emp_no") String emp_no);
	
	@Query(value = "SELECT * FROM suda.suda_staff_salary_details WHERE month =:month AND year =:year ", nativeQuery = true)
	List<SudaStaffSalaryDetails> detailsByMonth(@Param("month") String emp_no, @Param("year") String year);

	@Query(value = "SELECT * FROM suda.suda_staff_salary_details WHERE emp_no = :emp_no AND month=:month AND year=:year", nativeQuery = true)
    SudaStaffSalaryDetails findStaffBydetails(@Param("emp_no")String emp_no, @Param("month")String month, @Param("year") String year);

	@Query(value = "SELECT * FROM suda.suda_staff_salary_details WHERE emp_no = :emp_no AND year = :year", nativeQuery = true)
	List<SudaStaffSalaryDetails> detailsAnnually(@Param("emp_no") String emp_no, @Param("year") String year);

	@Query(value = "SELECT * FROM suda.suda_staff_salary_details WHERE month = :month AND year = :year",nativeQuery = true)
	List<SudaStaffSalaryDetails> allDetailsForMonth(@Param("month") String month, @Param("year") String year);


	@Query(value = """
        SELECT sssd.*
        FROM suda.suda_staff_salary_details AS sssd
        JOIN suda.suda_staff AS ss ON sssd.emp_no = ss.temp_emp
        WHERE sssd.month = :month
          AND sssd.year = :year
          AND ss.area_id IN (:area_id)
    """, nativeQuery = true)
	List<SudaStaffSalaryDetails> findStaffSalaryDetailsByMonthYearAndAreaId(
			@Param("month") String month,
			@Param("year") String year,
			@Param("area_id")  Long[] area_id
	);


	@Query(value = "SELECT * FROM suda.suda_staff_salary_details WHERE month=:month AND year=:year AND advance>0.00", nativeQuery = true)
	Page<SudaStaffSalaryDetails> findStaffByAdvance(@Param("month") String month, @Param("year") String year, Pageable pageable);



	@Query(value = "SELECT COUNT(*) FROM suda.suda_staff_salary_details WHERE month=:month AND year=:year AND advance>0.00 ", nativeQuery = true)
	Long foundCountOfAdv(@Param("month") String month, @Param("year") String year);


	@Query(value = "SELECT * FROM suda.suda_staff_salary_details WHERE month=:month AND year=:year AND deduction>0.00", nativeQuery = true)
	Page<SudaStaffSalaryDetails> findStaffByDeduction(@Param("month") String month, @Param("year") String year,  Pageable pageable);


	@Query(value = "SELECT COUNT(*) FROM suda.suda_staff_salary_details WHERE month=:month AND year=:year AND deduction>0.00 ", nativeQuery = true)
	Long foundCountOfDeduction(@Param("month") String month, @Param("year") String year);


	@Query(value = "SELECT bssd.* FROM suda.suda_staff_salary_details AS bssd JOIN suda.suda_staff AS bs ON bs.temp_emp = bssd.emp_no WHERE bssd.month = :month AND bssd.year = :year AND bssd.is_target_based = 'FALSE' AND bs.area_id IN :area_id ORDER BY  bssd.emp_no", nativeQuery = true)
	Page<SudaStaffSalaryDetails> findAllSalariedData(@Param("month") String month,
													 @Param("year") String year,
													 @Param("area_id") Long[] area_id,
													 Pageable pageable);

	@Query(value = "SELECT bssd.* FROM suda.suda_staff_salary_details AS bssd JOIN suda.suda_staff AS bs ON bs.temp_emp = bssd.emp_no WHERE bssd.month = :month AND bssd.year = :year AND bssd.is_target_based = 'FALSE' AND bs.area_id IN :area_id", nativeQuery = true)
	List<SudaStaffSalaryDetails> findAllSalariedData(@Param("month") String month,
													 @Param("year") String year,
													 @Param("area_id") Long[] area_id);

	@Query(value = "SELECT bssd.* FROM suda.suda_staff_salary_details AS bssd JOIN suda.suda_staff AS bs ON bs.temp_emp = bssd.emp_no WHERE bssd.month = :month AND bssd.year = :year AND bssd.is_target_based = 'TRUE' AND bs.area_id IN :area_id", nativeQuery = true)
	List<SudaStaffSalaryDetails> findAllTargetData(@Param("month") String month,
													 @Param("year") String year,
													 @Param("area_id") Long[] area_id);

	@Query(value = "SELECT bssd.* FROM suda.suda_staff_salary_details AS bssd JOIN suda.suda_staff AS bs ON bs.temp_emp = bssd.emp_no WHERE bssd.month = :month AND bssd.year = :year AND bssd.is_target_based = 'FALSE' ORDER BY  bssd.emp_no", nativeQuery = true)
	Page<SudaStaffSalaryDetails> findAllSalariedData(@Param("month") String month,
													 @Param("year") String year,
													 Pageable pageable);

	@Query(value = "SELECT bssd.* FROM suda.suda_staff_salary_details AS bssd JOIN suda.suda_staff AS bs ON bs.temp_emp = bssd.emp_no WHERE bssd.month = :month AND bssd.year = :year AND bssd.is_target_based = 'FALSE'", nativeQuery = true)
	List<SudaStaffSalaryDetails> findAllSalariedData(@Param("month") String month,
													 @Param("year") String year);

	@Query(value = "SELECT bssd.* FROM suda.suda_staff_salary_details AS bssd JOIN suda.suda_staff AS bs ON bs.temp_emp = bssd.emp_no WHERE bssd.month = :month AND bssd.year = :year AND bssd.is_target_based = 'TRUE'", nativeQuery = true)
	List<SudaStaffSalaryDetails> findAllTargetData(@Param("month") String month,
													 @Param("year") String year);

	@Query(value = "SELECT bssd.* FROM suda.suda_staff_salary_details AS bssd JOIN suda.suda_staff AS bs ON bs.temp_emp = bssd.emp_no WHERE bssd.month = :month AND bssd.year = :year AND bssd.is_target_based = 'TRUE' ORDER BY  bssd.emp_no", nativeQuery = true)
	Page<SudaStaffSalaryDetails> findAllTargetData(@Param("month") String month,
													 @Param("year") String year,
													 Pageable pageable);

//	@Query(value = "SELECT bssd.* FROM suda.suda_staff_salary_details AS bssd JOIN suda.suda_staff AS bs ON bs.temp_emp = bssd.emp_no WHERE bssd.month = :month AND bssd.year = :year AND bssd.is_target_based = 'TRUE'", nativeQuery = true)
//	Page<SudaStaffSalaryDetails> findAllTargetData(@Param("month") String month,
//												   @Param("year") String year,
//												   Pageable pageable);

	@Query(value = "SELECT bssd.* FROM suda.suda_staff_salary_details AS bssd JOIN suda.suda_staff AS bs ON bs.temp_emp = bssd.emp_no WHERE bssd.month = :month AND bssd.year = :year AND bssd.is_target_based = 'FIXED' AND bs.area_id IN :area_id", nativeQuery = true)
	List<SudaStaffSalaryDetails> findAllFixedData(@Param("month") String month,
													 @Param("year") String year,
													 @Param("area_id") Long[] area_id);

	@Query(value = "SELECT bssd.* FROM suda.suda_staff_salary_details AS bssd JOIN suda.suda_staff AS bs ON bs.temp_emp = bssd.emp_no WHERE bssd.month = :month AND bssd.year = :year AND bssd.is_target_based = 'FIXED'", nativeQuery = true)
	List<SudaStaffSalaryDetails> findAllFixedData(@Param("month") String month,
													 @Param("year") String year);

	@Query(value = "SELECT bssd.* FROM suda.suda_staff_salary_details AS bssd JOIN suda.suda_staff AS bs ON bs.staff_id = bssd.staff_id WHERE bssd.month = :month AND bssd.year = :year " +
			"AND bssd.is_target_based = 'FIXED' AND bs.area_id IN :area_id ORDER BY  bssd.emp_no",
			nativeQuery = true)
	Page<SudaStaffSalaryDetails> findAllDataForFixed(@Param("month") String month,@Param("year") String year,@Param("area_id") List<Long> areaIds,Pageable pageable);

	@Query(value = "SELECT * FROM suda.suda_staff_salary_details WHERE month = :month AND year = :year AND is_target_based='FIXED' ORDER BY emp_no", nativeQuery = true)
	Page<SudaStaffSalaryDetails> findAllDataForFixed(@Param("month") String month, @Param("year") String year,  Pageable pageable);

	@Query(value = "SELECT bssd.* FROM suda.suda_staff_salary_details AS bssd JOIN suda.suda_staff AS bs ON bs.staff_id = bssd.staff_id WHERE bssd.month = :month AND bssd.year = :year " +
			"AND bs.area_id IN :area_id ORDER BY  bssd.emp_no",
			nativeQuery = true)
	Page<SudaStaffSalaryDetails> findAllDataForAllGroup(@Param("month") String month,@Param("year") String year,@Param("area_id") List<Long> areaIds,Pageable pageable);


	@Query(value = "SELECT bssd.* FROM suda.suda_staff_salary_details AS bssd JOIN suda.suda_staff AS bs ON bs.staff_id = bssd.staff_id WHERE bssd.month = :month AND bssd.year = :year ORDER BY bssd.emp_no",
			nativeQuery = true)
	Page<SudaStaffSalaryDetails> findAllDataForAllGroup(@Param("month") String month,@Param("year") String year,Pageable pageable);


	@Query(value = "SELECT bssd.* FROM suda.suda_staff_salary_details AS bssd JOIN suda.suda_staff AS bs ON bs.staff_id = bssd.staff_id WHERE bssd.month = :month AND bssd.year = :year " +
			"AND bs.area_id IN :area_id",
			nativeQuery = true)
	List<SudaStaffSalaryDetails> findAllDataForAllGroup(@Param("month") String month,@Param("year") String year,@Param("area_id") List<Long> areaIds);


	@Query(value = "SELECT bssd.* FROM suda.suda_staff_salary_details AS bssd JOIN suda.suda_staff AS bs ON bs.staff_id = bssd.staff_id WHERE bssd.month = :month AND bssd.year = :year ",
			nativeQuery = true)
	List<SudaStaffSalaryDetails> findAllDataForAllGroup(@Param("month") String month,@Param("year") String year);

	@Query(value = "SELECT * FROM suda.suda_staff_salary_details WHERE emp_no=:emp_no", nativeQuery = true)
	List<SudaStaffSalaryDetails> findStaffByEmpNo(@Param("emp_no") String emp_no);

	@Modifying
	@Query(value = "DELETE FROM suda.suda_staff_salary_details WHERE month = :month AND year = :year AND emp_no = :empNo", nativeQuery = true)
	void bulkDeleteByDetails(@Param("month") String month, @Param("year") String year, @Param("empNo") String empNo);
}
