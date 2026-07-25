package com.hrms.modules.suda.payroll.repository;

import com.hrms.modules.suda.payroll.modles.SudaSalaryEarned;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SudaSalaryEarnedRepository extends JpaRepository<SudaSalaryEarned, Long> {
	@Query(value = "SELECT * FROM suda.suda_salary_earned WHERE staff_id = :staff_id AND month=:month AND year=:year", nativeQuery = true)
    SudaSalaryEarned findBydetails(@Param("staff_id")Long staff_id, @Param("month")String month, @Param("year") String year);

    @Query(value = "SELECT * FROM suda.suda_salary_earned WHERE emp_no=:emp_no", nativeQuery = true)
    List<SudaSalaryEarned> findByEmpNo(@Param("emp_no") String emp_no);

    @Query(value = "SELECT * FROM suda.suda_salary_earned WHERE emp_no = :emp_no AND month=:month AND year=:year", nativeQuery = true)
    SudaSalaryEarned findBydetails(@Param("emp_no")String emp_no, @Param("month")String month, @Param("year") String year);

    @Modifying
    @Query(value = "DELETE FROM suda.suda_salary_earned WHERE month = :month AND year = :year AND emp_no = :empNo", nativeQuery = true)
    void bulkDeleteByDetails(@Param("month") String month, @Param("year") String year, @Param("empNo") String empNo);

}
