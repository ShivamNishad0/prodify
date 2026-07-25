package com.hrms.modules.suda.payroll.repository;

import com.hrms.modules.suda.payroll.modles.SudaStaffTargetDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SudaStaffTargetDetailsRepository extends JpaRepository<SudaStaffTargetDetails,Long> {
    @Query(value = "SELECT * FROM suda.suda_staff_target_details WHERE  month = :month AND year = :year AND emp_no = :emp_no", nativeQuery = true)
    SudaStaffTargetDetails findByDetails(@Param("month")String month, @Param("year")String year, @Param("emp_no")String emp_no);

    @Query(value = "SELECT * FROM suda.suda_staff_target_details WHERE  emp_no = :emp_no", nativeQuery = true)
    List<SudaStaffTargetDetails> findByEmpNo(@Param("emp_no") String emp_no);

    @Modifying
    @Query(value = "DELETE FROM suda.suda_staff_target_details WHERE month = :month AND year = :year AND emp_no = :empNo", nativeQuery = true)
    void bulkDeleteByDetails(@Param("month") String month, @Param("year") String year, @Param("empNo") String empNo);


}
