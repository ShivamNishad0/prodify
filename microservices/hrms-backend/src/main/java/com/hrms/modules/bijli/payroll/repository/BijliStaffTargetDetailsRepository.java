package com.hrms.modules.bijli.payroll.repository;

import com.hrms.modules.bijli.payroll.modles.BijliStaffTargetDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BijliStaffTargetDetailsRepository extends JpaRepository<BijliStaffTargetDetails,Long> {
//    @Query(value = "SELECT * FROM bijli.bijli_staff_target_details WHERE  month = :month AND year = :year AND emp_no = :emp_no", nativeQuery = true)
//    BijliStaffTargetDetails findByDetails(@Param("month")String month, @Param("year")String year, @Param("emp_no")String emp_no);

    @Query(value = "SELECT * FROM bijli.bijli_staff_target_details WHERE  emp_no = :emp_no", nativeQuery = true)
    List<BijliStaffTargetDetails> findByEmpNo(@Param("emp_no")String emp_no);

    @Query(value = "SELECT * FROM bijli.bijli_staff_target_details WHERE month = :month AND year = :year AND emp_no = :emp_no", nativeQuery = true)
    BijliStaffTargetDetails findByDetails(@Param("month") String month, @Param("year") String year, @Param("emp_no") String empNo);

    @Modifying
    @Query(value = "DELETE FROM bijli.bijli_staff_target_details WHERE month = :month AND year = :year AND emp_no = :empNo", nativeQuery = true)
    void bulkDeleteByDetails(@Param("month") String month, @Param("year") String year, @Param("empNo") String empNo);

}
