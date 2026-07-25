package com.hrms.modules.ho.payroll.repository;

import com.hrms.modules.ho.payroll.modles.HoStaffTargetDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface HoStaffTargetDetailsRepository extends JpaRepository<HoStaffTargetDetails,Long> {
    @Query(value = "SELECT * FROM ho.ho_staff_target_details WHERE  month = :month AND year = :year AND emp_no = :emp_no", nativeQuery = true)
    HoStaffTargetDetails findByDetails(@Param("month")String month, @Param("year")String year, @Param("emp_no")String emp_no);

    @Query(value = "SELECT * FROM ho.ho_staff_target_details WHERE  emp_no = :emp_no", nativeQuery = true)
    List<HoStaffTargetDetails> findByEmpNo(@Param("emp_no")String emp_no);

    @Modifying
    @Query(value = "DELETE FROM ho.ho_staff_target_details WHERE month = :month AND year = :year AND emp_no = :empNo", nativeQuery = true)
    void bulkDeleteByDetails(@Param("month") String month, @Param("year") String year, @Param("empNo") String empNo);
}
