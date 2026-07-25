package com.hrms.modules.dmc.payroll.repository;

import com.hrms.modules.dmc.payroll.modles.DmcSalaryEarned;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DmcSalaryEarnedRepository extends JpaRepository<DmcSalaryEarned, Long> {
	@Query(value = "SELECT * FROM dmc.dmc_salary_earned WHERE staff_id = :staff_id AND month=:month AND year=:year", nativeQuery = true)
    DmcSalaryEarned findBydetails(@Param("staff_id")Long staff_id, @Param("month")String month, @Param("year") String year);

    @Query(value = "SELECT * FROM dmc.dmc_salary_earned WHERE emp_no=:emp_no", nativeQuery = true)
    List<DmcSalaryEarned> findByEmpNo(@Param("emp_no") String emp_no);

    @Modifying
    @Query(value = "DELETE FROM dmc.dmc_salary_earned WHERE month = :month AND year = :year AND emp_no = :empNo", nativeQuery = true)
    void bulkDeleteByDetails(@Param("month") String month, @Param("year") String year, @Param("empNo") String empNo);
}
