package com.hrms.modules.dmc.payroll.serviceImpl;

import com.hrms.modules.dmc.payroll.modles.DmcStaffLeaves;
import com.hrms.modules.dmc.payroll.repository.DmcStaffLeavesRepository;
import com.hrms.modules.dmc.payroll.service.DmcStaffLeavesService;
import com.hrms.modules.utilsServics.Result;
import com.hrms.modules.utilsServics.Status;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;


@Service
public class DmcStaffLeavesServiceImpl implements DmcStaffLeavesService {

	@Autowired
	private DmcStaffLeavesRepository leaveRepo;

	
	@Override
	 public String createLeave(DmcStaffLeaves leave) {
	        long totalDay = calculateDaysBetween(leave.getFromDate(), leave.getToDate());
	        leave.setTotalDay(totalDay);
	        leave.setLeaveStatus(Status.PENDING_APPROVAL);
	        Timestamp currentTimestamp = new Timestamp(System.currentTimeMillis());
	        leave.setStamp(currentTimestamp);
	        DmcStaffLeaves saveLeaves= leaveRepo.save(leave);
	        return saveLeaves!=null?Result.SUCCESS.toString():Result.WENT_WRONG.toString();
	    }
	
	@Override
	 public String actionOnLeave(String action, Long leaveId, Long userId) {
	        Optional<DmcStaffLeaves> optionalLeave = leaveRepo.findById(leaveId);
	        if (!optionalLeave.isPresent()) {
	            return Result.WENT_WRONG.toString();
	        }

	        DmcStaffLeaves leave = optionalLeave.get();
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

	        DmcStaffLeaves savedLeave = leaveRepo.save(leave);
	        return savedLeave != null ? Result.SUCCESS.toString() : Result.WENT_WRONG.toString();
	    }
	
	@Override
	public List<DmcStaffLeaves> staffLeaves(Long StaffId){
		List<DmcStaffLeaves> leaves = leaveRepo.findLeaveByStaffId(StaffId);
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
}
