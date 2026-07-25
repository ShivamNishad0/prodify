package com.hrms.modules.bhilai.payroll.repository;

import com.hrms.modules.bhilai.payroll.modles.BhilaiHoliday;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.sql.Date;

public interface BhilaiHolidayRepo extends JpaRepository<BhilaiHoliday, Long>{
    @Query(value = "SELECT * FROM  bhilai.bhilai_holiday WHERE holiday_start=:holiday_start",nativeQuery = true)
    BhilaiHoliday findByholidayStart(@Param("holiday_start") Date holiday_start);
}
