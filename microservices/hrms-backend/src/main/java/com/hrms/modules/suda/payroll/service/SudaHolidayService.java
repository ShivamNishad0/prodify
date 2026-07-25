package com.hrms.modules.suda.payroll.service;


import com.hrms.modules.suda.payroll.modles.SudaHoliday;

import java.util.List;
import java.util.Optional;

public interface SudaHolidayService {
	  String createHoliday(SudaHoliday holiday);
	   String updateHoliday(Long id, SudaHoliday holiday);
	    void deleteHoliday(Long id);
	    List<SudaHoliday> getAllHolidays();
	    Optional<SudaHoliday> getHolidayById(Long id);
}
