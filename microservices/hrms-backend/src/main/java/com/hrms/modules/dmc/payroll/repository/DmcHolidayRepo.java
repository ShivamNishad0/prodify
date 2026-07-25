package com.hrms.modules.dmc.payroll.repository;

import com.hrms.modules.dmc.payroll.modles.DmcHoliday;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.sql.Date;

public interface DmcHolidayRepo extends JpaRepository<DmcHoliday, Long>{

    @Query(value = "SELECT * FROM  dmc.dmc_holiday WHERE holiday_start=:holiday_start",nativeQuery = true)
    DmcHoliday findByholidayStart(@Param("holiday_start") Date holiday_start);
}
