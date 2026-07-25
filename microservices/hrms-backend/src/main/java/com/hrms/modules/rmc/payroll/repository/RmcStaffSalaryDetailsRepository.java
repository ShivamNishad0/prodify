package com.hrms.modules.rmc.payroll.repository;


import com.hrms.modules.bijli.payroll.modles.BijliStaffSalaryDetails;
import com.hrms.modules.rmc.payroll.modles.RmcStaffSalaryDetails;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RmcStaffSalaryDetailsRepository extends JpaRepository<RmcStaffSalaryDetails, Long> {
    @Query(value = "SELECT * FROM rmc.rmc_staff_salary_details WHERE staff_id = :staff_id AND month=:month AND year=:year", nativeQuery = true)
    RmcStaffSalaryDetails findBydetails(@Param("staff_id") Long staff_id, @Param("month") String month, @Param("year") String year);

    @Query(value = "SELECT * FROM rmc.rmc_staff_salary_details WHERE month = :month AND year = :year AND is_target_based='FALSE'", nativeQuery = true)
    Page<RmcStaffSalaryDetails> findAllData(@Param("month") String month, @Param("year") String year, Pageable pageable);

    @Query(value = "SELECT * FROM rmc.rmc_staff_salary_details WHERE month = :month AND year = :year AND is_target_based='FALSE' AND status=:status ORDER BY emp_no", nativeQuery = true)
    Page<RmcStaffSalaryDetails> findAllData(@Param("month") String month, @Param("year") String year,@Param("status") String status, Pageable pageable);

    @Query(value = "SELECT * FROM rmc.rmc_staff_salary_details WHERE month = :month AND year = :year AND is_target_based='TRUE' AND status=:status ORDER BY emp_no", nativeQuery = true)
    Page<RmcStaffSalaryDetails> findAllDataForTarget(@Param("month") String month, @Param("year") String year,@Param("status") String status, Pageable pageable);

    @Query(value = "SELECT COUNT(*) FROM rmc.rmc_staff_salary_details WHERE month = :month AND year = :year AND status=:status", nativeQuery = true)
    Long foundData(@Param("month") String month, @Param("year") String year,@Param("status") String status);

    @Query(value = "SELECT COUNT(*) FROM rmc.rmc_staff_salary_details WHERE is_target_based='TRUE' AND  month = :month AND year = :year AND status=:status", nativeQuery = true)
    Long foundDataOfTargetBased(@Param("month") String month, @Param("year") String year,@Param("status") String status);

    @Query(value = "SELECT * FROM rmc.rmc_staff_salary_details WHERE emp_no LIKE %:searchTerm% AND month=:month AND year=:year AND is_target_based=:is_target_based", nativeQuery = true)
    List<RmcStaffSalaryDetails> findStaffByTempEmpOrContactNo(@Param("searchTerm") String searchTerm, @Param("month") String month, @Param("year") String year, @Param("is_target_based") String is_target_based);

    @Query(value = "SELECT COUNT(*) FROM rmc.rmc_staff_salary_details WHERE emp_no LIKE %:emp_no%", nativeQuery = true)
    Long countStaffByTempEmp(@Param("emp_no") String emp_no);

    @Query(value = "SELECT * FROM rmc.rmc_staff_salary_details WHERE emp_no =:emp_no", nativeQuery = true)
    List<RmcStaffSalaryDetails> advDetailsOfEmp(@Param("emp_no") String emp_no);

    @Query(value = "SELECT * FROM rmc.rmc_staff_salary_details WHERE emp_no =:emp_no AND year=:year", nativeQuery = true)
    List<RmcStaffSalaryDetails> advDetailsOfEmpByYear(@Param("emp_no") String emp_no, @Param("year") String year);

    @Query(value = "SELECT * FROM rmc.rmc_staff_salary_details WHERE month =:month AND year =:year AND status=:status", nativeQuery = true)
    List<RmcStaffSalaryDetails> detailsByMonth(@Param("month") String emp_no, @Param("year") String year, @Param("status") String status);

    @Query(value = "SELECT * FROM rmc.rmc_staff_salary_details WHERE emp_no = :emp_no AND month=:month AND year=:year", nativeQuery = true)
    RmcStaffSalaryDetails findStaffBydetails(@Param("emp_no") String emp_no, @Param("month") String month, @Param("year") String year);

    @Query(value = "SELECT * FROM rmc.rmc_staff_salary_details WHERE emp_no = :emp_no AND year = :year", nativeQuery = true)
    List<RmcStaffSalaryDetails> detailsAnnually(@Param("emp_no") String emp_no, @Param("year") String year);

    @Query(value = "SELECT * FROM rmc.rmc_staff_salary_details WHERE month=:month AND year=:year AND advance>0.00", nativeQuery = true)
    Page<RmcStaffSalaryDetails> findStaffByAdvance(@Param("month") String month, @Param("year") String year, Pageable pageable);

    @Query(value = "SELECT * FROM rmc.rmc_staff_salary_details WHERE month=:month AND year=:year AND deduction>0.00", nativeQuery = true)
    Page<RmcStaffSalaryDetails> findStaffByDeduction(@Param("month") String month, @Param("year") String year,  Pageable pageable);

    @Query(value = "SELECT COUNT(*) FROM rmc.rmc_staff_salary_details WHERE month=:month AND year=:year AND deduction>0.00 ", nativeQuery = true)
    Long foundCountOfDeduction(@Param("month") String month, @Param("year") String year);

    @Query(value = "SELECT COUNT(*) FROM rmc.rmc_staff_salary_details WHERE month=:month AND year=:year AND advance>0.00 ", nativeQuery = true)
    Long foundCountOfAdv(@Param("month") String month, @Param("year") String year);

    @Query(value = "SELECT * FROM rmc.rmc_staff_salary_details WHERE month = :month AND year = :year",nativeQuery = true)
    List<RmcStaffSalaryDetails> allDetailsForMonth(@Param("month") String month, @Param("year") String year);

    @Query(value = "SELECT * FROM rmc.rmc_staff_salary_details WHERE emp_no LIKE %:searchTerm% AND month=:month AND year=:year", nativeQuery = true)
    List<RmcStaffSalaryDetails> methodForSearchIndivisual(@Param("searchTerm")String searchTerm, @Param("month")String month, @Param("year")String year);

    @Query(value = "SELECT bssd.* FROM rmc.rmc_staff_salary_details AS bssd JOIN rmc.rmc_staff AS bs ON bs.temp_emp = bssd.emp_no WHERE bssd.month = :month AND bssd.year = :year AND bssd.is_target_based = 'FIXED' AND bs.area_id IN :area_id", nativeQuery = true)
    List<RmcStaffSalaryDetails> findAllFixedData(@Param("month") String month,
                                                 @Param("year") String year,
                                                 @Param("area_id") Long[] area_id);

    @Query(value = "SELECT bssd.* FROM rmc.rmc_staff_salary_details AS bssd JOIN rmc.rmc_staff AS bs ON bs.temp_emp = bssd.emp_no WHERE bssd.month = :month AND bssd.year = :year AND bssd.is_target_based = 'FIXED'", nativeQuery = true)
    List<RmcStaffSalaryDetails> findAllFixedData(@Param("month") String month,
                                                 @Param("year") String year);

    @Query(value = "SELECT bssd.* FROM rmc.rmc_staff_salary_details AS bssd JOIN rmc.rmc_staff AS bs ON bs.staff_id = bssd.staff_id WHERE bssd.month = :month AND bssd.year = :year " +
            "AND bssd.is_target_based = 'FIXED' AND bs.area_id IN :area_id ORDER BY bs.emp_no",
            nativeQuery = true)
    Page<RmcStaffSalaryDetails> findAllDataForFixed(@Param("month") String month,@Param("year") String year,@Param("area_id") List<Long> areaIds,Pageable pageable);

    @Query(value = "SELECT * FROM rmc.rmc_staff_salary_details WHERE month = :month AND year = :year AND is_target_based='FIXED' ORDER BY emp_no", nativeQuery = true)
    Page<RmcStaffSalaryDetails> findAllDataForFixed(@Param("month") String month, @Param("year") String year,  Pageable pageable);

    @Query(value = "SELECT bssd.* FROM rmc.rmc_staff_salary_details AS bssd " +
            "JOIN rmc.rmc_staff AS bs ON bs.staff_id = bssd.staff_id " +
            "WHERE bssd.month = :month AND bssd.year = :year " +
            "AND bssd.is_target_based = 'FIXED' AND bs.area_id IN :area_id " +
            "AND bssd.status = :status ORDER BY  bssd.emp_no", // Assuming you want to filter by 'status'
            nativeQuery = true)
    Page<RmcStaffSalaryDetails> findAllDataForTarget(@Param("month") String month,
                                                     @Param("year") String year,
                                                     @Param("status") String status,
                                                     @Param("area_id") Long[] area_id, // Changed to Long[] instead of String[]
                                                     Pageable pageable);


    @Query(value = "SELECT * FROM rmc.rmc_staff_salary_details WHERE emp_no=:emp_no", nativeQuery = true)
    List<RmcStaffSalaryDetails> findStaffByEmpNo(@Param("emp_no") String emp_no);

    @Modifying
    @Query(value = "DELETE FROM rmc.rmc_staff_salary_details WHERE month = :month AND year = :year AND emp_no = :empNo", nativeQuery = true)
    void bulkDeleteByDetails(@Param("month") String month, @Param("year") String year, @Param("empNo") String empNo);

    @Query(value = "SELECT * FROM rmc.rmc_staff_salary_details WHERE emp_no = :emp_no AND month=:month AND year=:year", nativeQuery = true)
    RmcStaffSalaryDetails findBydetails(@Param("emp_no")String emp_no, @Param("month")String month, @Param("year") String year);
}
