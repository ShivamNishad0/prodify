package com.hrms.modules.ho.payroll.repository;

import com.hrms.modules.ho.payroll.modles.HoSalaryEarned;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface HoSalaryEarnedRepository extends JpaRepository<HoSalaryEarned, Long> {
	@Query(value = "SELECT * FROM ho.ho_salary_earned WHERE staff_id = :staff_id AND month=:month AND year=:year", nativeQuery = true)
    HoSalaryEarned findBydetails(@Param("staff_id")Long staff_id, @Param("month")String month, @Param("year") String year);

    @Query(value = "SELECT * FROM ho.ho_salary_earned WHERE emp_no=:emp_no",nativeQuery = true)
    List<HoSalaryEarned> findByEmpNo(@Param("emp_no")String emp_no);

    @Modifying
    @Query(value = "DELETE FROM ho.ho_salary_earned WHERE month = :month AND year = :year AND emp_no = :empNo", nativeQuery = true)
    void bulkDeleteByDetails(@Param("month") String month, @Param("year") String year, @Param("empNo") String empNo);
}
