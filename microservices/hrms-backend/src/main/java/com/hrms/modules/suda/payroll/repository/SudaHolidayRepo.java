package com.hrms.modules.suda.payroll.repository;

import com.hrms.modules.suda.payroll.modles.SudaHoliday;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.sql.Date;

public interface SudaHolidayRepo extends JpaRepository<SudaHoliday, Long>{
    @Query(value = "SELECT * FROM  suda.suda_holiday WHERE holiday_start=:holiday_start",nativeQuery = true)
    SudaHoliday findByholidayStart(@Param("holiday_start") Date holiday_start);
}
