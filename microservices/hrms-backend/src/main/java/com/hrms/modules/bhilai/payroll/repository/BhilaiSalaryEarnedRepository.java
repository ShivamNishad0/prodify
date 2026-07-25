package com.hrms.modules.bhilai.payroll.repository;

import com.hrms.modules.bhilai.payroll.modles.BhilaiSalaryEarned;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BhilaiSalaryEarnedRepository extends JpaRepository<BhilaiSalaryEarned, Long> {
	@Query(value = "SELECT * FROM bhilai.bhilai_salary_earned WHERE staff_id = :staff_id AND month=:month AND year=:year", nativeQuery = true)
    BhilaiSalaryEarned findBydetails(@Param("staff_id")Long staff_id, @Param("month")String month, @Param("year") String year);

    @Query(value = "SELECT * FROM bhilai.bhilai_salary_earned WHERE emp_no=:emp_no",nativeQuery = true)
    List<BhilaiSalaryEarned> findByEmpNo(@Param("emp_no")String emp_no);

    @Modifying
    @Query(value = "DELETE FROM bhilai.bhilai_salary_earned WHERE month = :month AND year = :year AND emp_no = :empNo", nativeQuery = true)
    void bulkDeleteByDetails(@Param("month") String month, @Param("year") String year, @Param("empNo") String empNo);

}
