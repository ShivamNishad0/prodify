package com.hrms.modules.suda.payroll.serviceImpl;

import com.hrms.modules.suda.payroll.modles.SudaStaffLeaves;
import com.hrms.modules.suda.payroll.repository.SudaStaffLeavesRepository;
import com.hrms.modules.suda.payroll.service.SudaStaffLeavesService;
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
public class SudaStaffLeavesServiceImpl implements SudaStaffLeavesService {

	@Autowired
	private SudaStaffLeavesRepository leaveRepo;

	
	@Override
	 public String createLeave(SudaStaffLeaves leave) {
	        long totalDay = calculateDaysBetween(leave.getFromDate(), leave.getToDate());
	        leave.setTotalDay(totalDay);
	        leave.setLeaveStatus(Status.PENDING_APPROVAL);
	        Timestamp currentTimestamp = new Timestamp(System.currentTimeMillis());
	        leave.setStamp(currentTimestamp);
	        SudaStaffLeaves saveLeaves= leaveRepo.save(leave);
	        return saveLeaves!=null?Result.SUCCESS.toString():Result.WENT_WRONG.toString();
	    }
	
	@Override
	 public String actionOnLeave(String action, Long leaveId, Long userId) {
	        Optional<SudaStaffLeaves> optionalLeave = leaveRepo.findById(leaveId);
	        if (!optionalLeave.isPresent()) {
	            return Result.WENT_WRONG.toString();
	        }

	        SudaStaffLeaves leave = optionalLeave.get();
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

	        SudaStaffLeaves savedLeave = leaveRepo.save(leave);
	        return savedLeave != null ? Result.SUCCESS.toString() : Result.WENT_WRONG.toString();
	    }
	
	@Override
	public List<SudaStaffLeaves> staffLeaves(Long StaffId){
		List<SudaStaffLeaves> leaves = leaveRepo.findLeaveByStaffId(StaffId);
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
