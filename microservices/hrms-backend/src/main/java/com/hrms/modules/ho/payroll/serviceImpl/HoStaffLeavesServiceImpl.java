package com.hrms.modules.ho.payroll.serviceImpl;

import com.hrms.modules.ho.payroll.modles.HoStaffLeaves;
import com.hrms.modules.ho.payroll.repository.HoStaffLeavesRepository;
import com.hrms.modules.ho.payroll.service.HoStaffLeavesService;
import com.hrms.modules.utilsServics.Result;
import com.hrms.modules.utilsServics.Status;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.Month;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Optional;


@Service
public class HoStaffLeavesServiceImpl implements HoStaffLeavesService {

	@Autowired
	private HoStaffLeavesRepository leaveRepo;

	
	@Override
	 public String createLeave(HoStaffLeaves leave) {
	        long totalDay = calculateDaysBetween(leave.getFromDate(), leave.getToDate());
	        leave.setTotalDay(totalDay);
	        leave.setLeaveStatus(Status.PENDING_APPROVAL);
	        Timestamp currentTimestamp = new Timestamp(System.currentTimeMillis());
	        leave.setStamp(currentTimestamp);
	        HoStaffLeaves saveLeaves= leaveRepo.save(leave);
	        return saveLeaves!=null?Result.SUCCESS.toString():Result.WENT_WRONG.toString();
	    }
	
	@Override
	 public String actionOnLeave(String action, Long leaveId, Long userId) {
	        Optional<HoStaffLeaves> optionalLeave = leaveRepo.findById(leaveId);
	        if (!optionalLeave.isPresent()) {
	            return Result.WENT_WRONG.toString();
	        }

	        HoStaffLeaves leave = optionalLeave.get();
	        switch (action.toLowerCase()) {
	            case "approve":
	                leave.setLeaveStatus(Status.APPROVED);
	                leave.setApprovedBy(userId);
	                break;
	            case "rejected":
	                leave.setLeaveStatus(Status.REJECTED);
	                leave.setRejectedBy(userId);
	                break;
	            case "cancel":
	                leave.setLeaveStatus(Status.CANCELLED);
	                leave.setCancledBy(userId);
	                break;
	            case "scheduled":
	                leave.setLeaveStatus(Status.SHEDULED);
	                break;
	            case "taken":
	                leave.setLeaveStatus(Status.TAKEN);
	                break;
	            default:
	                return Result.WENT_WRONG.toString();
	        }

	        HoStaffLeaves savedLeave = leaveRepo.save(leave);
	        return savedLeave != null ? Result.SUCCESS.toString() : Result.WENT_WRONG.toString();
	    }
	
	@Override
	public List<HoStaffLeaves> staffLeaves(Long StaffId){
		List<HoStaffLeaves> leaves = leaveRepo.findLeaveByStaffId(StaffId);
		return !leaves.isEmpty()?leaves:null;
	}
	
	@Override
	public String deleteLeave(Long leaveId) {
		leaveRepo.deleteById(leaveId);
		return Result.SUCCESS.toString();
	}



//	Helping Methods 

	    public long calculateDaysBetween(Date fromDate, Date toDate) {
	        // Convert java.sql.Date to java.time.LocalDate
	        LocalDate startDate = fromDate.toLocalDate();
	        LocalDate endDate = toDate.toLocalDate();

	        // Calculate the difference in days
	        long daysBetween = ChronoUnit.DAYS.between(startDate, endDate);

	        return daysBetween;
	    }

	public Date getDates(String monthName, int year, String day) throws IllegalArgumentException {
		// Extract day number from "dayX"
		if (day == null || !day.startsWith("day")) {
			throw new IllegalArgumentException("Invalid day format. Expected 'dayX'.");
		}

		int dayNumber = Integer.parseInt(day.substring(3));

		// Convert month name to corresponding Month enum
		Month month = Month.valueOf(monthName.toUpperCase(Locale.ENGLISH));

		// Validate the day number
		if (dayNumber < 1 || dayNumber > month.length(LocalDate.of(year, month.getValue(), 1).isLeapYear())) {
			throw new IllegalArgumentException("Invalid day number for the given month.");
		}

		// Create a LocalDate and convert to java.sql.Date
		LocalDate localDate = LocalDate.of(year, month.getValue(), dayNumber);
		return Date.valueOf(localDate);
	}

	// Method to get dates between two given dates
	public List<Date> getDatesBetween(Date fromDate, Date toDate) {
		// Convert java.sql.Date to java.time.LocalDate
		LocalDate start = fromDate.toLocalDate();
		LocalDate end = toDate.toLocalDate();

		// Validate if fromDate is before or equal to toDate
		if (start.isAfter(end)) {
			throw new IllegalArgumentException("fromDate should be before or equal to toDate");
		}

		// List to store the dates
		List<Date> dateList = new ArrayList<>();

		// Loop through the date range and collect dates
		while (!start.isAfter(end)) {
			dateList.add(Date.valueOf(start));
			start = start.plusDays(1); // Move to the next day
		}

		return dateList;
	}

	public String getDayFormat(Date date) {
		// Convert java.sql.Date to java.time.LocalDate
		LocalDate localDate = date.toLocalDate();

		// Extract the day of the month
		int dayOfMonth = localDate.getDayOfMonth();

		// Return the formatted string like "day1", "day2", etc.
		return "day" + dayOfMonth;
	}

}
