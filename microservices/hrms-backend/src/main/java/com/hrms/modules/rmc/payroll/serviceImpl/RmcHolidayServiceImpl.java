package com.hrms.modules.rmc.payroll.serviceImpl;

import com.hrms.modules.rmc.payroll.modles.RmcHoliday;
import com.hrms.modules.rmc.payroll.repository.RmcHolidayRepo;
import com.hrms.modules.rmc.payroll.service.RmcHolidayService;
import com.hrms.modules.utilsServics.Result;
import com.hrms.modules.utilsServics.Status;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RmcHolidayServiceImpl implements RmcHolidayService {

    @Autowired
    private RmcHolidayRepo holiRepo;

    @Override
    public String createHoliday(RmcHoliday holiday) {
    	holiday.setStatus(Status.ACTIVE);
        holiRepo.save(holiday);
        return "Holiday created successfully!";
    }

    @Override
    public String updateHoliday(Long id, RmcHoliday holiday) {
    	RmcHoliday existingHoliday =holiRepo.findById(id).get();
         existingHoliday.setHolidayName(holiday.getHolidayName());
         existingHoliday.setHolidayStart(holiday.getHolidayStart());
         existingHoliday.setHolidayEnd(holiday.getHolidayEnd());
         existingHoliday.setTotalHoliday(holiday.getTotalHoliday());
         existingHoliday.setStatus(holiday.getStatus());
         RmcHoliday saved = holiRepo.save(existingHoliday);
         return saved!=null?Result.SUCCESS.toString():Result.WENT_WRONG.toString();
    }

    @Override
    public void deleteHoliday(Long id) {
        holiRepo.deleteById(id);
    }

    @Override
    public List<RmcHoliday> getAllHolidays() {
        return holiRepo.findAll();
    }

    @Override
    public Optional<RmcHoliday> getHolidayById(Long id) {
        return holiRepo.findById(id);
    }
}
