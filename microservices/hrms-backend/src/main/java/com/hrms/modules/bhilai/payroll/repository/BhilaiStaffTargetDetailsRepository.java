package com.hrms.modules.bhilai.payroll.repository;

import com.hrms.modules.bhilai.payroll.modles.BhilaiStaffTargetDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BhilaiStaffTargetDetailsRepository extends JpaRepository<BhilaiStaffTargetDetails,Long> {
    @Query(value = "SELECT * FROM bhilai.bhilai_staff_target_details WHERE  month = :month AND year = :year AND emp_no = :emp_no", nativeQuery = true)
    BhilaiStaffTargetDetails findByDetails(@Param("month")String month, @Param("year")String year, @Param("emp_no")String emp_no);

    @Query(value = "SELECT * FROM bhilai.bhilai_staff_target_details WHERE  emp_no = :emp_no", nativeQuery = true)
    List<BhilaiStaffTargetDetails> findByEmpNo(@Param("emp_no")String emp_no);

    @Modifying
    @Query(value = "DELETE FROM bhilai.bhilai_staff_target_details WHERE month = :month AND year = :year AND emp_no = :empNo", nativeQuery = true)
    void bulkDeleteByDetails(@Param("month") String month, @Param("year") String year, @Param("empNo") String empNo);
}
