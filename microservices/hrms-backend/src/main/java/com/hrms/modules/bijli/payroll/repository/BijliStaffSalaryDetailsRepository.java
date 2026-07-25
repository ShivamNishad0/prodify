package com.hrms.modules.bijli.payroll.repository;


import com.hrms.modules.bijli.hiring.models.BijliSalaryStructure;
import com.hrms.modules.bijli.payroll.modles.BijliStaffSalaryDetails;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BijliStaffSalaryDetailsRepository extends JpaRepository<BijliStaffSalaryDetails, Long> {
    @Query(value = "SELECT * FROM bijli.bijli_staff_salary_details WHERE staff_id = :staff_id AND month=:month AND year=:year", nativeQuery = true)
    BijliStaffSalaryDetails findBydetails(@Param("staff_id") Long staff_id, @Param("month") String month, @Param("year") String year);

    @Query(value = "SELECT * FROM bijli.bijli_staff_salary_details WHERE emp_no = :emp_no AND month=:month AND year=:year", nativeQuery = true)
    BijliStaffSalaryDetails findBydetails(@Param("emp_no") String emp_no, @Param("month") String month, @Param("year") String year);

    @Query(value = "SELECT * FROM bijli.bijli_staff_salary_details WHERE month = :month AND year = :year AND is_target_based='FALSE'", nativeQuery = true)
    Page<BijliStaffSalaryDetails> findAllData(@Param("month") String month, @Param("year") String year, Pageable pageable);

    @Query(value = "SELECT * FROM bijli.bijli_staff_salary_details WHERE month = :month AND year = :year AND is_target_based='TRUE' AND status=:status ORDER BY emp_no", nativeQuery = true)
    Page<BijliStaffSalaryDetails> findAllDataForTarget(@Param("month") String month, @Param("year") String year, @Param("status") String status, Pageable pageable);

   @Query(value = "SELECT bssd.* FROM bijli.bijli_staff_salary_details AS bssd JOIN bijli.bijli_staff AS bs ON bs.temp_emp = bssd.emp_no WHERE bssd.month = :month AND bssd.year = :year AND bssd.status = :status AND bssd.is_target_based = 'FALSE' AND (:desig_id IS NULL OR bs.desig_id = :desig_id) ORDER BY  bssd.emp_no", nativeQuery = true)
    Page<BijliStaffSalaryDetails> findAllSalariedData(@Param("month") String month,
                                                      @Param("year") String year,
                                                      @Param("status") String status,
                                                      @Param("desig_id") Long desig_id, Pageable pageable);

 @Query(value = "SELECT bssd.* FROM bijli.bijli_staff_salary_details AS bssd JOIN bijli.bijli_staff AS bs ON bs.temp_emp = bssd.emp_no WHERE bssd.month = :month AND bssd.year = :year AND bssd.status = :status AND bssd.is_target_based = 'FALSE' ORDER BY  bssd.emp_no", nativeQuery = true)
 Page<BijliStaffSalaryDetails> findAllSalariedData(@Param("month") String month,
                                                   @Param("year") String year,
                                                   @Param("status") String status,Pageable pageable);


    @Query(value = "SELECT bssd.* FROM bijli.bijli_staff_salary_details AS bssd JOIN bijli.bijli_staff AS bs ON bs.temp_emp = bssd.emp_no WHERE bssd.month = :month AND bssd.year = :year AND bssd.status = :status AND bssd.is_target_based = 'FALSE' AND bs.area_id IN :area_id AND (:desig_id IS NULL OR bs.desig_id = :desig_id) ORDER BY  bssd.emp_no", nativeQuery = true)
    Page<BijliStaffSalaryDetails> findAllSalariedData(@Param("month") String month,
                                                      @Param("year") String year,
                                                      @Param("status") String status,
                                                      @Param("desig_id") Long desig_id,
                                                      @Param("area_id") Long[] area_id,
                                                      Pageable pageable);


    @Query(value = "SELECT bssd.* FROM bijli.bijli_staff_salary_details AS bssd JOIN bijli.bijli_staff AS bs ON bs.temp_emp = bssd.emp_no WHERE bssd.month = :month AND bssd.year = :year AND bssd.status = :status AND bssd.is_target_based = 'FALSE' AND bs.area_id IN :area_id ORDER BY  bssd.emp_no", nativeQuery = true)
    Page<BijliStaffSalaryDetails> findAllSalariedData(@Param("month") String month,
                                                      @Param("year") String year,
                                                      @Param("status") String status,
                                                      @Param("area_id") Long[] area_id,
                                                      Pageable pageable);


    @Query(value = "SELECT bssd.* FROM bijli.bijli_staff_salary_details AS bssd JOIN bijli.bijli_staff AS bs ON bs.temp_emp = bssd.emp_no WHERE bssd.month = :month AND bssd.year = :year AND bssd.status = :status AND bssd.is_target_based = 'TRUE' AND COALESCE(bs.desig_id, :desig_id) = :desig_id ORDER BY  bssd.emp_no ORDER BY  bssd.emp_no", nativeQuery = true)
    Page<BijliStaffSalaryDetails> findAllDataForTargetEmp(@Param("month") String month,
                                                          @Param("year") String year,
                                                          @Param("status") String status,
                                                          @Param("desig_id") Long desig_id,
                                                          Pageable pageable);


    @Query(value = "SELECT * FROM bijli.bijli_staff_salary_details WHERE month = :month AND year = :year AND is_target_based='TRUE' AND status=:status", nativeQuery = true)
    List<BijliStaffSalaryDetails> findCompleteDataForTarget(@Param("month") String month, @Param("year") String year, @Param("status") String status);

    @Query(value = "SELECT bssd.* FROM bijli.bijli_staff_salary_details AS bssd " +
            "JOIN bijli.bijli_staff AS bs ON bs.staff_id = bssd.staff_id " +
            "WHERE bssd.month = :month AND bssd.year = :year " +
            "AND bssd.is_target_based = 'TRUE' AND bssd.status = :status " +
            "AND bs.area_id IN :area_id ORDER BY  bssd.emp_no", nativeQuery = true)
    Page<BijliStaffSalaryDetails> findAllDataForTargetWithArea(@Param("month") String month,
                                                               @Param("year") String year,
                                                               @Param("area_id") Long[] area_id,
                                                               @Param("status") String status,
                                                               Pageable pageable);

    @Query(value = """
            SELECT COUNT(*) 
            FROM bijli.bijli_staff_salary_details AS bssd
            JOIN bijli.bijli_staff AS bs ON bs.temp_emp = bssd.emp_no
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

    @Query(value = """
            SELECT COUNT(*) 
            FROM bijli.bijli_staff_salary_details AS bssd
            JOIN bijli.bijli_staff AS bs ON bs.temp_emp = bssd.emp_no
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


    @Query(value = """
            SELECT COUNT(*) 
            FROM bijli.bijli_staff_salary_details AS bssd
            JOIN bijli.bijli_staff AS bs ON bs.temp_emp = bssd.emp_no
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


    @Query(value = "SELECT bssd.* FROM bijli.bijli_staff_salary_details AS bssd JOIN bijli.bijli_staff AS bs ON bs.staff_id = bssd.staff_id " +
            "WHERE bssd.month = :month AND bssd.year = :year AND bssd.is_target_based = 'TRUE' AND bssd.status = :status AND bs.area_id IN (:area_id)", nativeQuery = true)
    List<BijliStaffSalaryDetails> findCompleteDataForTargetWithArea(@Param("month") String month, @Param("year") String year, @Param("area_id") Long[] area_id, @Param("status") String status);


    @Query(value = "SELECT COUNT(*) FROM bijli.bijli_staff_salary_details WHERE month = :month AND year = :year AND status=:status AND is_target_based = 'TRUE'", nativeQuery = true)
    Long foundDataTarget(@Param("month") String month, @Param("year") String year, @Param("status") String status);

    @Query(value = "SELECT COUNT(*) " +
            "FROM bijli.bijli_staff_salary_details AS bssd " +
            "JOIN bijli.bijli_staff AS bs " +
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


    @Query(value = "SELECT COUNT(*) " +
            "FROM bijli.bijli_staff_salary_details AS bssd " +
            "JOIN bijli.bijli_staff AS bs " +
            "ON bs.temp_emp = bssd.emp_no " +
            "WHERE bssd.month = :month " +
            "AND bssd.year = :year " +
            "AND bssd.status = :status " +
            "AND bssd.is_target_based = 'FALSE' " +
            "AND (:desigId IS NULL OR bs.desig_id = :desigId)",
            nativeQuery = true)
    Long foundDataSalaried(@Param("month") String month,
                           @Param("year") String year,
                           @Param("status") String status,
                           @Param("desigId") Long desigId);

 @Query(value = "SELECT COUNT(*) " +
         "FROM bijli.bijli_staff_salary_details AS bssd " +
         "JOIN bijli.bijli_staff AS bs " +
         "ON bs.temp_emp = bssd.emp_no " +
         "WHERE bssd.month = :month " +
         "AND bssd.year = :year " +
         "AND bssd.status = :status " +
         "AND bssd.is_target_based = 'FALSE' ",
         nativeQuery = true)
 Long foundDataSalaried(@Param("month") String month,
                        @Param("year") String year,
                        @Param("status") String status);


    @Query(value = "SELECT COUNT(*) FROM bijli.bijli_staff_salary_details WHERE is_target_based='TRUE' AND month = :month AND year = :year AND status=:status", nativeQuery = true)
    Long foundDataOfTargetBased(@Param("month") String month, @Param("year") String year, @Param("status") String status);

    @Query(value = "SELECT COUNT(*) " +
            "FROM bijli.bijli_staff_salary_details AS bssd " +
            "JOIN bijli.bijli_staff AS bs ON bssd.emp_no = bs.temp_emp " +
            "WHERE bssd.is_target_based = 'TRUE' " +
            "AND bssd.month = :month " +
            "AND bssd.year = :year " +
            "AND bssd.status = :status " +
            "AND bs.area_id IN (:area_id)",
            nativeQuery = true)
    Long countByAreaId(@Param("month") String month,
                       @Param("year") String year,
                       @Param("status") String status,
                       @Param("area_id") Long[] area_id);


    @Query(value = "SELECT * FROM bijli.bijli_staff_salary_details WHERE emp_no LIKE %:searchTerm% AND month=:month AND year=:year AND is_target_based=:is_target_based", nativeQuery = true)
    List<BijliStaffSalaryDetails> findStaffByTempEmpOrContactNo(@Param("searchTerm") String searchTerm, @Param("month") String month, @Param("year") String year, @Param("is_target_based") String is_target_based);

    @Query(value = "SELECT COUNT(*) FROM bijli.bijli_staff_salary_details WHERE emp_no LIKE %:emp_no%", nativeQuery = true)
    Long countStaffByTempEmp(@Param("emp_no") String emp_no);

    @Query(value = "SELECT * FROM bijli.bijli_staff_salary_details WHERE emp_no =:emp_no", nativeQuery = true)
    List<BijliStaffSalaryDetails> advDetailsOfEmp(@Param("emp_no") String emp_no);

    @Query(value = "SELECT * FROM bijli.bijli_staff_salary_details WHERE month =:month AND year =:year AND status=:status", nativeQuery = true)
    List<BijliStaffSalaryDetails> detailsByMonth(@Param("month") String emp_no, @Param("year") String year, @Param("status") String status);

    @Query(value = "SELECT * FROM bijli.bijli_staff_salary_details WHERE month =:month AND year =:year AND status=:status AND is_target_based='FALSE' ", nativeQuery = true)
    List<BijliStaffSalaryDetails> salariedEmp(@Param("month") String emp_no, @Param("year") String year, @Param("status") String status);


    @Query(value = """
            SELECT bssd.* 
            FROM bijli.bijli_staff_salary_details AS bssd
            JOIN bijli.bijli_staff AS bs ON bssd.emp_no = bs.temp_emp
            WHERE bssd.month = :month 
              AND bssd.year = :year 
              AND bssd.status = :status 
              AND bssd.is_target_based = 'FALSE'
              AND bs.area_id IN :area_id
            """, nativeQuery = true)
    List<BijliStaffSalaryDetails> salariedEmpAreaWise(
            @Param("month") String month,
            @Param("year") String year,
            @Param("status") String status,
            @Param("area_id") Long[] areaId
    );

    @Query(value = """
            SELECT bssd.* 
            FROM bijli.bijli_staff_salary_details AS bssd
            JOIN bijli.bijli_staff AS bs ON bssd.emp_no = bs.temp_emp
            WHERE bssd.month = :month 
              AND bssd.year = :year 
              AND bssd.status = :status 
              AND bssd.is_target_based = 'FALSE'
              AND bs.area_id IN :area_id
              AND bs.desig_id =:desig_id
            """, nativeQuery = true)
    List<BijliStaffSalaryDetails> salariedEmpAreaWiseAndDesigWise(
            @Param("month") String month,
            @Param("year") String year,
            @Param("status") String status,
            @Param("area_id") Long[] areaId,
            @Param("desig_id") Long desig_id
    );


    @Query(value = "SELECT * FROM bijli.bijli_staff_salary_details WHERE emp_no = :emp_no AND month=:month AND year=:year", nativeQuery = true)
    BijliStaffSalaryDetails findStaffBydetails(@Param("emp_no") String emp_no, @Param("month") String month, @Param("year") String year);

    @Query(value = "SELECT * FROM bijli.bijli_staff_salary_details WHERE emp_no = :emp_no AND year = :year", nativeQuery = true)
    List<BijliStaffSalaryDetails> detailsAnnually(@Param("emp_no") String emp_no, @Param("year") String year);

    @Query(value = "SELECT * FROM bijli.bijli_staff_salary_details WHERE month = :month AND year = :year", nativeQuery = true)
    List<BijliStaffSalaryDetails> allDetailsForMonth(@Param("month") String month, @Param("year") String year);

    @Query(value = "SELECT * FROM bijli.bijli_staff_salary_details WHERE emp_no LIKE %:searchTerm% AND month=:month AND year=:year", nativeQuery = true)
    List<BijliStaffSalaryDetails> methodForSearchIndivisual(@Param("searchTerm") String searchTerm, @Param("month") String month, @Param("year") String year);

   @Query(value = "SELECT * FROM bijli.bijli_staff_salary_details WHERE month=:month AND year=:year AND advance>0.00", nativeQuery = true)
   Page<BijliStaffSalaryDetails> findStaffByAdvance(@Param("month") String month, @Param("year") String year, Pageable pageable);



   @Query(value = "SELECT COUNT(*) FROM bijli.bijli_staff_salary_details WHERE month=:month AND year=:year AND advance>0.00 ", nativeQuery = true)
   Long foundCountOfAdv(@Param("month") String month, @Param("year") String year);


   @Query(value = "SELECT * FROM bijli.bijli_staff_salary_details WHERE month=:month AND year=:year AND deduction>0.00", nativeQuery = true)
   Page<BijliStaffSalaryDetails> findStaffByDeduction(@Param("month") String month, @Param("year") String year,  Pageable pageable);


   @Query(value = "SELECT COUNT(*) FROM bijli.bijli_staff_salary_details WHERE month=:month AND year=:year AND deduction>0.00 ", nativeQuery = true)
   Long foundCountOfDeduction(@Param("month") String month, @Param("year") String year);

    @Query(value = "SELECT * FROM bijli.bijli_staff_salary_details WHERE emp_no=:emp_no", nativeQuery = true)
    List<BijliStaffSalaryDetails> findStaffByEmpNo(@Param("emp_no") String emp_no);

    @Modifying
    @Query(value = "DELETE FROM bijli.bijli_staff_salary_details WHERE month = :month AND year = :year AND emp_no = :empNo", nativeQuery = true)
    void bulkDeleteByDetails(@Param("month") String month, @Param("year") String year, @Param("empNo") String empNo);
}
