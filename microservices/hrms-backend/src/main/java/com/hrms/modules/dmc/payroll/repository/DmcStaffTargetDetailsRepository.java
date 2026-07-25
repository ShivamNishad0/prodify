package com.hrms.modules.dmc.payroll.repository;

import com.hrms.modules.dmc.payroll.modles.DmcStaffTargetDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DmcStaffTargetDetailsRepository extends JpaRepository<DmcStaffTargetDetails,Long> {
    @Query(value = "SELECT * FROM dmc.dmc_staff_target_details WHERE  month = :month AND year = :year AND emp_no = :emp_no", nativeQuery = true)
    DmcStaffTargetDetails findByDetails(@Param("month")String month, @Param("year")String year, @Param("emp_no")String emp_no);

    @Query(value = "SELECT * FROM dmc.dmc_staff_target_details WHERE  emp_no = :emp_no", nativeQuery = true)
    List<DmcStaffTargetDetails> findByEmpNo(@Param("emp_no") String emp_no);

    @Modifying
    @Query(value = "DELETE FROM dmc.dmc_staff_target_details WHERE month = :month AND year = :year AND emp_no = :empNo", nativeQuery = true)
    void bulkDeleteByDetails(@Param("month") String month, @Param("year") String year, @Param("empNo") String empNo);
}
