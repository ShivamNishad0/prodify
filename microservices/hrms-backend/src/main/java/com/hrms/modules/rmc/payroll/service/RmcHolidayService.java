package com.hrms.modules.rmc.payroll.service;


import com.hrms.modules.rmc.payroll.modles.RmcHoliday;

import java.util.List;
import java.util.Optional;

public interface RmcHolidayService {
	  String createHoliday(RmcHoliday holiday);
	   String updateHoliday(Long id, RmcHoliday holiday);
	    void deleteHoliday(Long id);
	    List<RmcHoliday> getAllHolidays();
	    Optional<RmcHoliday> getHolidayById(Long id);
}
