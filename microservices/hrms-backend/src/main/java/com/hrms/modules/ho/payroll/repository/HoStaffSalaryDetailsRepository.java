package com.hrms.modules.ho.payroll.repository;


import com.hrms.modules.ho.payroll.modles.HoStaffSalaryDetails;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface HoStaffSalaryDetailsRepository extends JpaRepository<HoStaffSalaryDetails, Long> {
	@Query(value = "SELECT * FROM ho.ho_staff_salary_details WHERE staff_id = :staff_id AND month=:month AND year=:year", nativeQuery = true)
    HoStaffSalaryDetails findBydetails(@Param("staff_id")Long staff_id, @Param("month")String month, @Param("year") String year);
	
	@Query(value = "SELECT * FROM ho.ho_staff_salary_details WHERE month = :month AND year = :year AND is_target_based='FALSE'", nativeQuery = true)
	Page<HoStaffSalaryDetails> findAllData(@Param("month") String month, @Param("year") String year, Pageable pageable);

	@Query(value = "SELECT * FROM ho.ho_staff_salary_details WHERE month = :month AND year = :year AND is_target_based='FALSE' AND status=:status AND on_hold='FALSE' ORDER BY emp_no", nativeQuery = true)
	Page<HoStaffSalaryDetails> findAllData(@Param("month") String month, @Param("year") String year,@Param("status") String status, Pageable pageable);

	@Query(value = "SELECT * FROM ho.ho_staff_salary_details WHERE month = :month AND year = :year AND is_target_based='TRUE' ORDER BY emp_no", nativeQuery = true)
	Page<HoStaffSalaryDetails> findAllDataForTarget(@Param("month") String month, @Param("year") String year, Pageable pageable);
	 
	@Query(value = "SELECT COUNT(*) FROM ho.ho_staff_salary_details WHERE month = :month AND year = :year AND is_target_based='FALSE' AND status=:status", nativeQuery = true)
	Long foundData(@Param("month") String month, @Param("year") String year,@Param("status") String status);

	@Query(value = "SELECT COUNT(*) FROM ho.ho_staff_salary_details WHERE is_target_based='TRUE' ", nativeQuery = true)
	Long foundDataOfTargetBased();
	
	@Query(value = "SELECT * FROM ho.ho_staff_salary_details WHERE emp_no LIKE %:searchTerm% AND month=:month AND year=:year AND is_target_based=:is_target_based", nativeQuery = true)
	List<HoStaffSalaryDetails> findStaffByTempEmpOrContactNo(@Param("searchTerm") String searchTerm, @Param("month") String month, @Param("year") String year, @Param("is_target_based") String is_target_based);
	
	@Query(value = "SELECT COUNT(*) FROM ho.ho_staff_salary_details WHERE emp_no LIKE %:emp_no% AND is_target_based=:is_target_based", nativeQuery = true)
    Long countStaffByTempEmp(@Param("emp_no") String emp_no,@Param("is_target_based") String is_target_based);
	
	@Query(value = "SELECT * FROM ho.ho_staff_salary_details WHERE emp_no =:emp_no", nativeQuery = true)
	List<HoStaffSalaryDetails> advDetailsOfEmp(@Param("emp_no") String emp_no);
	
	@Query(value = "SELECT * FROM ho.ho_staff_salary_details WHERE month =:month AND year =:year AND status=:status AND on_hold='FALSE'", nativeQuery = true)
	List<HoStaffSalaryDetails> detailsByMonth(@Param("month") String emp_no, @Param("year") String year, @Param("status") String status);

	@Query(value = "SELECT * FROM ho.ho_staff_salary_details WHERE emp_no = :emp_no AND month=:month AND year=:year", nativeQuery = true)
    HoStaffSalaryDetails findStaffBydetails(@Param("emp_no")String emp_no, @Param("month")String month, @Param("year") String year);

	@Query(value = "SELECT * FROM ho.ho_staff_salary_details WHERE emp_no = :emp_no AND year = :year", nativeQuery = true)
	List<HoStaffSalaryDetails> detailsAnnually(@Param("emp_no") String emp_no, @Param("year") String year);

	@Query(value = "SELECT * FROM ho.ho_staff_salary_details WHERE month = :month AND year = :year",nativeQuery = true)
	List<HoStaffSalaryDetails> allDetailsForMonth(@Param("month") String month, @Param("year") String year);

	@Query(value = "SELECT * FROM ho.ho_staff_salary_details WHERE emp_no = :emp_no AND month=:month AND year=:year", nativeQuery = true)
	HoStaffSalaryDetails findBydetails(@Param("emp_no")String emp_no, @Param("month")String month, @Param("year") String year);

	@Query(value = "SELECT * FROM ho.ho_staff_salary_details WHERE month=:month AND year=:year AND advance>0.00", nativeQuery = true)
	Page<HoStaffSalaryDetails> findStaffByAdvance(@Param("month") String month, @Param("year") String year, Pageable pageable);


	@Query(value = "SELECT COUNT(*) FROM ho.ho_staff_salary_details WHERE month=:month AND year=:year AND advance>0.00 ", nativeQuery = true)
	Long foundCountOfAdv(@Param("month") String month, @Param("year") String year);


	@Query(value = "SELECT * FROM ho.ho_staff_salary_details WHERE month=:month AND year=:year AND deduction>0.00", nativeQuery = true)
	Page<HoStaffSalaryDetails> findStaffByDeduction(@Param("month") String month, @Param("year") String year,  Pageable pageable);

	@Query(value = "SELECT * FROM ho.ho_staff_salary_details WHERE emp_no=:emp_no", nativeQuery = true)
	List<HoStaffSalaryDetails> findStaffByEmpNo(@Param("emp_no") String emp_no);


	@Query(value = "SELECT COUNT(*) FROM ho.ho_staff_salary_details WHERE month=:month AND year=:year AND deduction>0.00 ", nativeQuery = true)
	Long foundCountOfDeduction(@Param("month") String month, @Param("year") String year);

	@Modifying
	@Query(value = "DELETE FROM ho.ho_staff_salary_details WHERE month = :month AND year = :year AND emp_no = :empNo", nativeQuery = true)
	void bulkDeleteByDetails(@Param("month") String month, @Param("year") String year, @Param("empNo") String empNo);
}
