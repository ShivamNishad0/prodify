package com.hrms.modules.dmc.payroll.repository;


import com.hrms.modules.dmc.payroll.modles.DmcStaffSalaryDetails;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DmcStaffSalaryDetailsRepository extends JpaRepository<DmcStaffSalaryDetails, Long> {
	@Query(value = "SELECT * FROM dmc.dmc_staff_salary_details WHERE staff_id = :staff_id AND month=:month AND year=:year", nativeQuery = true)
    DmcStaffSalaryDetails findBydetails(@Param("staff_id")Long staff_id, @Param("month")String month, @Param("year") String year);
	
	@Query(value = "SELECT * FROM dmc.dmc_staff_salary_details WHERE month = :month AND year = :year AND is_target_based='FALSE' ORDER BY emp_no", nativeQuery = true)
	Page<DmcStaffSalaryDetails> findAllData(@Param("month") String month, @Param("year") String year, Pageable pageable);

	@Query(value = "SELECT * FROM dmc.dmc_staff_salary_details WHERE month = :month AND year = :year AND is_target_based='TRUE' ORDER BY emp_no", nativeQuery = true)
	Page<DmcStaffSalaryDetails> findAllDataForTarget(@Param("month") String month, @Param("year") String year, Pageable pageable);
	 
	@Query(value = "SELECT COUNT(*) FROM dmc.dmc_staff_salary_details", nativeQuery = true)
	Long foundData();

	@Query(value = "SELECT COUNT(*) FROM dmc.dmc_staff_salary_details WHERE is_target_based='TRUE' ", nativeQuery = true)
	Long foundDataOfTargetBased();
	
	@Query(value = "SELECT * FROM dmc.dmc_staff_salary_details WHERE emp_no LIKE %:searchTerm% AND month=:month AND year=:year AND is_target_based=:is_target_based", nativeQuery = true)
	List<DmcStaffSalaryDetails> findStaffByTempEmpOrContactNo(@Param("searchTerm") String searchTerm, @Param("month") String month, @Param("year") String year, @Param("is_target_based") String is_target_based);
	
	@Query(value = "SELECT COUNT(*) FROM dmc.dmc_staff_salary_details WHERE emp_no LIKE %:emp_no%", nativeQuery = true)
    Long countStaffByTempEmp(@Param("emp_no") String emp_no);
	
	@Query(value = "SELECT * FROM dmc.dmc_staff_salary_details WHERE emp_no =:emp_no", nativeQuery = true)
	List<DmcStaffSalaryDetails> advDetailsOfEmp(@Param("emp_no") String emp_no);
	
	@Query(value = "SELECT * FROM dmc.dmc_staff_salary_details WHERE month =:month AND year =:year ", nativeQuery = true)
	List<DmcStaffSalaryDetails> detailsByMonth(@Param("month") String emp_no, @Param("year") String year);

	@Query(value = "SELECT * FROM dmc.dmc_staff_salary_details WHERE emp_no = :emp_no AND month=:month AND year=:year", nativeQuery = true)
    DmcStaffSalaryDetails findStaffBydetails(@Param("emp_no")String emp_no, @Param("month")String month, @Param("year") String year);

	@Query(value = "SELECT * FROM dmc.dmc_staff_salary_details WHERE emp_no = :emp_no AND year = :year", nativeQuery = true)
	List<DmcStaffSalaryDetails> detailsAnnually(@Param("emp_no") String emp_no, @Param("year") String year);

	@Query(value = "SELECT * FROM dmc.dmc_staff_salary_details WHERE month = :month AND year = :year",nativeQuery = true)
	List<DmcStaffSalaryDetails> allDetailsForMonth(@Param("month") String month, @Param("year") String year);

	@Query(value = "SELECT * FROM dmc.dmc_staff_salary_details WHERE month=:month AND year=:year AND advance>0.00", nativeQuery = true)
	Page<DmcStaffSalaryDetails> findStaffByAdvance(@Param("month") String month, @Param("year") String year, Pageable pageable);

	@Query(value = "SELECT * FROM dmc.dmc_staff_salary_details WHERE emp_no = :emp_no AND month=:month AND year=:year", nativeQuery = true)
	DmcStaffSalaryDetails findBydetails(@Param("emp_no")String emp_no, @Param("month")String month, @Param("year") String year);

	@Query(value = "SELECT COUNT(*) FROM dmc.dmc_staff_salary_details WHERE month=:month AND year=:year AND advance>0.00 ", nativeQuery = true)
	Long foundCountOfAdv(@Param("month") String month, @Param("year") String year);



	@Query(value = "SELECT * FROM dmc.dmc_staff_salary_details WHERE month=:month AND year=:year AND deduction>0.00", nativeQuery = true)
	Page<DmcStaffSalaryDetails> findStaffByDeduction(@Param("month") String month, @Param("year") String year,  Pageable pageable);


	@Query(value = "SELECT COUNT(*) FROM dmc.dmc_staff_salary_details WHERE month=:month AND year=:year AND deduction>0.00 ", nativeQuery = true)
	Long foundCountOfDeduction(@Param("month") String month, @Param("year") String year);

	@Query(value = "SELECT * FROM dmc.dmc_staff_salary_details WHERE emp_no=:emp_no", nativeQuery = true)
	List<DmcStaffSalaryDetails> findStaffByEmpNo(@Param("emp_no") String emp_no);

	@Query(value = "SELECT bssd.* FROM dmc.dmc_staff_salary_details AS bssd JOIN dmc.dmc_staff AS bs ON bs.staff_id = bssd.staff_id WHERE bssd.month = :month AND bssd.year = :year " +
			"AND bs.area_id IN :area_id",
			nativeQuery = true)
	List<DmcStaffSalaryDetails> findAllDataForAllGroup(@Param("month") String month,@Param("year") String year,@Param("area_id") List<Long> areaIds);

	@Query(value = "SELECT bssd.* FROM dmc.dmc_staff_salary_details AS bssd JOIN dmc.dmc_staff AS bs ON bs.staff_id = bssd.staff_id WHERE bssd.month = :month AND bssd.year = :year ",
			nativeQuery = true)
	List<DmcStaffSalaryDetails> findAllDataForAllGroup(@Param("month") String month,@Param("year") String year);

	@Query(value = "SELECT bssd.* FROM dmc.dmc_staff_salary_details AS bssd JOIN dmc.dmc_staff AS bs ON bs.staff_id = bssd.staff_id WHERE bssd.month = :month AND bssd.year = :year " +
			"AND bs.area_id IN :area_id ORDER BY  bssd.emp_no",
			nativeQuery = true)
	Page<DmcStaffSalaryDetails> findAllDataForAllGroup(@Param("month") String month,@Param("year") String year,@Param("area_id") List<Long> areaIds,Pageable pageable);

	@Query(value = "SELECT bssd.* FROM dmc.dmc_staff_salary_details AS bssd JOIN dmc.dmc_staff AS bs ON bs.staff_id = bssd.staff_id WHERE bssd.month = :month AND bssd.year = :year ORDER BY bssd.emp_no",
			nativeQuery = true)
	Page<DmcStaffSalaryDetails> findAllDataForAllGroup(@Param("month") String month,@Param("year") String year,Pageable pageable);

	@Modifying
	@Query(value = "DELETE FROM dmc.dmc_staff_salary_details WHERE month = :month AND year = :year AND emp_no = :empNo", nativeQuery = true)
	void bulkDeleteByDetails(@Param("month") String month, @Param("year") String year, @Param("empNo") String empNo);

}
