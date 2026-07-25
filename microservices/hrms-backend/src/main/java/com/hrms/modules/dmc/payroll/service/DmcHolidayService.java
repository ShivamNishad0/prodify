package com.hrms.modules.dmc.payroll.service;


import com.hrms.modules.dmc.payroll.modles.DmcHoliday;

import java.util.List;
import java.util.Optional;

public interface DmcHolidayService {
	  String createHoliday(DmcHoliday holiday);
	   String updateHoliday(Long id, DmcHoliday holiday);
	    void deleteHoliday(Long id);
	    List<DmcHoliday> getAllHolidays();
	    Optional<DmcHoliday> getHolidayById(Long id);
}
