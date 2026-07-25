package com.hrms.modules.suda.payroll.serviceImpl;

import com.hrms.modules.suda.payroll.modles.SudaHoliday;
import com.hrms.modules.suda.payroll.repository.SudaHolidayRepo;
import com.hrms.modules.suda.payroll.service.SudaHolidayService;
import com.hrms.modules.utilsServics.Result;
import com.hrms.modules.utilsServics.Status;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SudaHolidayServiceImpl implements SudaHolidayService {

    @Autowired
    private SudaHolidayRepo holiRepo;

    @Override
    public String createHoliday(SudaHoliday holiday) {
    	holiday.setStatus(Status.ACTIVE);
        holiRepo.save(holiday);
        return "Holiday created successfully!";
    }

    @Override
    public String updateHoliday(Long id, SudaHoliday holiday) {
    	SudaHoliday existingHoliday =holiRepo.findById(id).get();
         existingHoliday.setHolidayName(holiday.getHolidayName());
         existingHoliday.setHolidayStart(holiday.getHolidayStart());
         existingHoliday.setHolidayEnd(holiday.getHolidayEnd());
         existingHoliday.setTotalHoliday(holiday.getTotalHoliday());
         existingHoliday.setStatus(holiday.getStatus());
         SudaHoliday saved = holiRepo.save(existingHoliday);
         return saved!=null?Result.SUCCESS.toString():Result.WENT_WRONG.toString();
    }

    @Override
    public void deleteHoliday(Long id) {
        holiRepo.deleteById(id);
    }

    @Override
    public List<SudaHoliday> getAllHolidays() {
        return holiRepo.findAll();
    }

    @Override
    public Optional<SudaHoliday> getHolidayById(Long id) {
        return holiRepo.findById(id);
    }
}
