package com.hrms.modules.bijli.payroll.serviceImpl;

import com.hrms.modules.bijli.payroll.modles.BijliHoliday;
import com.hrms.modules.bijli.payroll.repository.BijliHolidayRepo;
import com.hrms.modules.bijli.payroll.service.BijliHolidayService;
import com.hrms.modules.utilsServics.Result;
import com.hrms.modules.utilsServics.Status;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BijliHolidayServiceImpl implements BijliHolidayService {

    @Autowired
    private BijliHolidayRepo holiRepo;

    @Override
    public String createHoliday(BijliHoliday holiday) {
    	holiday.setStatus(Status.ACTIVE);
        holiRepo.save(holiday);
        return "Holiday created successfully!";
    }

    @Override
    public String updateHoliday(Long id, BijliHoliday holiday) {
    	BijliHoliday existingHoliday =holiRepo.findById(id).get();
         existingHoliday.setHolidayName(holiday.getHolidayName());
         existingHoliday.setHolidayStart(holiday.getHolidayStart());
         existingHoliday.setHolidayEnd(holiday.getHolidayEnd());
         existingHoliday.setTotalHoliday(holiday.getTotalHoliday());
         existingHoliday.setStatus(holiday.getStatus());
         BijliHoliday saved = holiRepo.save(existingHoliday);
         return saved!=null?Result.SUCCESS.toString():Result.WENT_WRONG.toString();
    }

    @Override
    public void deleteHoliday(Long id) {
        holiRepo.deleteById(id);
    }

    @Override
    public List<BijliHoliday> getAllHolidays() {
        return holiRepo.findAll();
    }

    @Override
    public Optional<BijliHoliday> getHolidayById(Long id) {
        return holiRepo.findById(id);
    }
}
