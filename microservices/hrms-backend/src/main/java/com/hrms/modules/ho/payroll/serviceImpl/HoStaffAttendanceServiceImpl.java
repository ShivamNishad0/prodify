package com.hrms.modules.ho.payroll.serviceImpl;

import com.hrms.modules.dtos.*;
import com.hrms.modules.ho.hiring.models.HoStaff;
import com.hrms.modules.ho.hiring.repository.HoStaffRepo;
import com.hrms.modules.ho.payroll.modles.*;
import com.hrms.modules.ho.payroll.repository.*;
import com.hrms.modules.ho.payroll.service.HoAttendanceDeatilsService;
import com.hrms.modules.ho.payroll.service.HoStaffAttendanceService;
import com.hrms.modules.utilsServics.Attendance;
import com.hrms.modules.utilsServics.Result;
import com.hrms.modules.utilsServics.Status;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.Month;
import java.time.Year;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Optional;

@Service
public class HoStaffAttendanceServiceImpl implements HoStaffAttendanceService {

    private static final Logger logger = LoggerFactory.getLogger(HoStaffAttendanceServiceImpl.class);

    @Autowired
    private HoStaffAttendanceRepository attendanceRepo;
    @Autowired
    private HoAttendanceDeatilsService detailService;
    @Autowired
    private HoAttendanceDeatilsRepository attendanceDetailRepo;
    @Autowired
    private HoStaffRepo staffRepo;
    @Autowired
    private HoStaffLeavesRepository leaveRepo;
    @Autowired
    private HoHolidayRepo holidayRepo;
    @Autowired
    private HoStaffSalaryDetailsRepository salaryDetails;

    @Override
    public String staffNewAddtendance(List<StaffAttendanceDTO> attendanceList) {
        List<String> notFoundEmpNo = new ArrayList<>();

        for (StaffAttendanceDTO staffAt : attendanceList) {
            HoStaffAttendance newAttendance = new HoStaffAttendance();
            HoStaff staff = staffRepo.findStaffByTemp_emp(staffAt.getEmpNo());
            if (staff != null) {
                Long staffAtZone = staffAt.getZoneId();
                System.out.println("Finding Data For Staff id ======> " + staff.getStaffId() + " ===== " + staff.getName());

            }
            if (staff == null) {
                String message = "EmpNo=" + staffAt.getEmpNo();
                notFoundEmpNo.add(message);
            } else {

                HoStaffAttendance found = attendanceRepo.findByDetails(staff.getStaffId(), staffAt.getMonthName(), staffAt.getYear());
                if (found == null) {
                    String message = "EmpNo=" + staff.getTempEmp() + createNewAttendance(newAttendance, staff, staffAt);
                    notFoundEmpNo.add(message);
                } else {
                    String message = "EmpNo=" + staff.getTempEmp() + updateExistingAttendance(found, staffAt);
                    notFoundEmpNo.add(message);
                }
            }
        }

        if (!notFoundEmpNo.isEmpty()) {
            List<String> allMessages = new ArrayList<>();
            allMessages.addAll(notFoundEmpNo);
            return String.join(", ", allMessages);
        }

        return Result.SUCCESS.toString();
    }

    private String createNewAttendance(HoStaffAttendance newAttendance, HoStaff staff, StaffAttendanceDTO staffAt) {
        newAttendance.setStaffId(staff.getStaffId());
        newAttendance.setEmpNo(staffAt.getEmpNo());
        newAttendance.setStatus(Status.ACTIVE);
        newAttendance.setEmpName(staff.getName());
        newAttendance.setYear(Year.of(staffAt.getYear()));
        newAttendance.setMonth(getCurrentMonth());
        newAttendance.setMonthName(staffAt.getMonthName());
        newAttendance.setVerified(Status.UNVERIFIED);
        newAttendance.setCreatedBy(staffAt.getCreatedBy());
        newAttendance.setStamp(new Timestamp(System.currentTimeMillis()));

        for (AttendanceDTO attendanceDTO : staffAt.getAttendance()) {
            HoStaff foundStaff = staffRepo.findStaffByTemp_emp(staffAt.getEmpNo());
            setDayAttendance(newAttendance, attendanceDTO, staffAt.getYear(), staffAt.getMonthName(), foundStaff.getStaffId());
        }

        HoStaffAttendance savedAttendance = attendanceRepo.save(newAttendance);
        if (savedAttendance != null) {
            HoStaffSalaryDetails foundData = salaryDetails.findBydetails(savedAttendance.getStaffId(), savedAttendance.getMonthName(), savedAttendance.getYear().toString());
            String status = (foundData==null||foundData.getStatus() == null )? "N/A" : foundData.getStatus().toString();
            if (status.equals("N/A")||status.equals(Status.UNVERIFIED.toString())) {
                detailService.createOrUpdateStaffAttendanceDetails(savedAttendance.getAttendanceId(), savedAttendance.getStaffId(),
                        savedAttendance.getMonthName(), savedAttendance.getYear().toString());
                return Result.SUCCESS.toString();
            }
            return Result.INVALID_ACTION.toString();
        }
        return Result.WENT_WRONG.toString();
    }

    private String updateExistingAttendance(HoStaffAttendance found, StaffAttendanceDTO staffAt) {
        found.setStatus(Status.ACTIVE);
        found.setMonth(getCurrentMonth());
        found.setVerified(Status.UNVERIFIED);
        found.setCreatedBy(staffAt.getCreatedBy());
        found.setStamp(new Timestamp(System.currentTimeMillis()));

        for (AttendanceDTO attendanceDTO : staffAt.getAttendance()) {
            HoStaff staff = staffRepo.findStaffByTemp_emp(staffAt.getEmpNo());
            setDayAttendance(found, attendanceDTO, staffAt.getYear(), staffAt.getMonthName(), staff.getStaffId());
        }

        HoStaffAttendance savedAttendance = attendanceRepo.save(found);
        if (savedAttendance != null) {
            HoStaffSalaryDetails foundData = salaryDetails.findBydetails(savedAttendance.getStaffId(), savedAttendance.getMonthName(), savedAttendance.getYear().toString());
            String status = (foundData==null||foundData.getStatus() == null )? "N/A" : foundData.getStatus().toString();
            if (status.equals( "N/A")||status.equals(Status.UNVERIFIED.toString())) {
                detailService.createOrUpdateStaffAttendanceDetails(savedAttendance.getAttendanceId(), savedAttendance.getStaffId(),
                        savedAttendance.getMonthName(), savedAttendance.getYear().toString());
                return Result.SUCCESS.toString();
            }
            return Result.INVALID_ACTION.toString();
        }
        return Result.WENT_WRONG.toString();
    }

    @Override
    public HoStaffAttendance findByempNo(String empNo, String month, int year) {
        return attendanceRepo.findByEmpNoAndDate(empNo, month, year);
    }

    @Override
    public CountAndStaffDetails findByEmpNo(String empNo, String month, String year, Pageable pageable) {
        // Fetch paginated results
        Page<HoAttendanceDeatils> data = attendanceDetailRepo.findByLikeEmpNoAndDate(empNo, month, year, pageable);
        // Prepare the result object
        CountAndStaffDetails result = new CountAndStaffDetails();
        result.setCount(attendanceDetailRepo.countByEmpNoAndDate(empNo, month, year));
        result.setResults(data.getContent());
        return result;
    }


    @Override
    public String editAttendace(Long attendanceId, AttendanceDTO editedAttendance) {
        Optional<HoStaffAttendance> optionalAttendance = attendanceRepo.findById(attendanceId);
        if (optionalAttendance.isPresent()) {
            HoStaffAttendance attendance = optionalAttendance.get();
            setDayAttendance(attendance, editedAttendance, Integer.parseInt(attendance.getYear().toString()), attendance.getMonthName(), attendance.getStaffId());
            HoStaffAttendance savedAttendance = attendanceRepo.save(attendance);
            if (savedAttendance != null) {
                HoStaffSalaryDetails foundData = salaryDetails.findBydetails(savedAttendance.getStaffId(), savedAttendance.getMonthName(), savedAttendance.getYear().toString());
                String status = (foundData==null||foundData.getStatus() == null )? "N/A" : foundData.getStatus().toString();
                if (status.equals( "N/A")||status.equals(Status.UNVERIFIED.toString())) {
                    detailService.createOrUpdateStaffAttendanceDetails(savedAttendance.getAttendanceId(), savedAttendance.getStaffId(),
                            savedAttendance.getMonthName(), savedAttendance.getYear().toString());
                    return Result.SUCCESS.toString();
                }
                return Result.INVALID_ACTION.toString();
            }
        }
        return Result.WENT_WRONG.toString();
    }

    @Override
    public String deleteStaffAttendance(Long attendanceId) {
        attendanceRepo.deleteById(attendanceId);
        return Result.SUCCESS.toString();
    }

    // Helping Methods
    public Month getCurrentMonth() {
        return LocalDate.now().getMonth();
    }


    //       Utility method to handle leave check and assignment
    Attendance checkAndApplyLeave(Date currentDate, Long staffId, Attendance defaultStatus) {
        HoStaffLeaves leave = isAppliedForLeave(currentDate, staffId);
        HoHoliday foundHoliday = holidayRepo.findByholidayStart(currentDate);
        if (leave != null) {
            List<Date> totalLeave = getDatesBetween(leave.getFromDate(), leave.getToDate());
            for (Date date : totalLeave) {
                if (currentDate.equals(date)) {
                    return Attendance.PL;
                }
            }
        }
        if (foundHoliday != null) {
            List<Date> totalHoliday = getDatesBetween(foundHoliday.getHolidayStart(), foundHoliday.getHolidayEnd());
            for (Date date : totalHoliday) {
                if (currentDate.equals(date)) {
                    return Attendance.HOLIDAY;
                }
            }
        }
        return defaultStatus;
    }

    private void setDayAttendance(HoStaffAttendance newAttendance, AttendanceDTO attendanceDTO, int year, String monthName, Long staffId) {
        String day = attendanceDTO.getDay();
        Attendance status = Attendance.valueOf(attendanceDTO.getStatus());

        switch (day) {
            case "d1":
                Date date1 = getDates(monthName, year, "d1");
                newAttendance.setD1(checkAndApplyLeave(date1, staffId, status));
                newAttendance.setD1In(attendanceDTO.getInTime());
                newAttendance.setD1Out(attendanceDTO.getOutTime());
                break;
            case "d2":
                Date date2 = getDates(monthName, year, "d2");
                newAttendance.setD2(checkAndApplyLeave(date2, staffId, status));
                newAttendance.setD2In(attendanceDTO.getInTime());
                newAttendance.setD2Out(attendanceDTO.getOutTime());
                break;
            case "d3":
                Date date3 = getDates(monthName, year, "d3");
                newAttendance.setD3(checkAndApplyLeave(date3, staffId, status));
                newAttendance.setD3In(attendanceDTO.getInTime());
                newAttendance.setD3Out(attendanceDTO.getOutTime());
                break;
            case "d4":
                Date date4 = getDates(monthName, year, "d4");
                newAttendance.setD4(checkAndApplyLeave(date4, staffId, status));
                newAttendance.setD4In(attendanceDTO.getInTime());
                newAttendance.setD4Out(attendanceDTO.getOutTime());
                break;
            case "d5":
                Date date5 = getDates(monthName, year, "d5");
                newAttendance.setD5(checkAndApplyLeave(date5, staffId, status));
                newAttendance.setD5In(attendanceDTO.getInTime());
                newAttendance.setD5Out(attendanceDTO.getOutTime());
                break;
            case "d6":
                Date date6 = getDates(monthName, year, "d6");
                newAttendance.setD6(checkAndApplyLeave(date6, staffId, status));
                newAttendance.setD6In(attendanceDTO.getInTime());
                newAttendance.setD6Out(attendanceDTO.getOutTime());
                break;
            case "d7":
                Date date7 = getDates(monthName, year, "d7");
                newAttendance.setD7(checkAndApplyLeave(date7, staffId, status));
                newAttendance.setD7In(attendanceDTO.getInTime());
                newAttendance.setD7Out(attendanceDTO.getOutTime());
                break;
            case "d8":
                Date date8 = getDates(monthName, year, "d8");
                newAttendance.setD8(checkAndApplyLeave(date8, staffId, status));
                newAttendance.setD8In(attendanceDTO.getInTime());
                newAttendance.setD8Out(attendanceDTO.getOutTime());
                break;
            case "d9":
                Date date9 = getDates(monthName, year, "d9");
                newAttendance.setD9(checkAndApplyLeave(date9, staffId, status));
                newAttendance.setD9In(attendanceDTO.getInTime());
                newAttendance.setD9Out(attendanceDTO.getOutTime());
                break;
            case "d10":
                Date date10 = getDates(monthName, year, "d10");
                newAttendance.setD10(checkAndApplyLeave(date10, staffId, status));
                newAttendance.setD10In(attendanceDTO.getInTime());
                newAttendance.setD10Out(attendanceDTO.getOutTime());
                break;
            case "d11":
                Date date11 = getDates(monthName, year, "d11");
                newAttendance.setD11(checkAndApplyLeave(date11, staffId, status));
                newAttendance.setD11In(attendanceDTO.getInTime());
                newAttendance.setD11Out(attendanceDTO.getOutTime());
                break;
            case "d12":
                Date date12 = getDates(monthName, year, "d12");
                newAttendance.setD12(checkAndApplyLeave(date12, staffId, status));
                newAttendance.setD12In(attendanceDTO.getInTime());
                newAttendance.setD12Out(attendanceDTO.getOutTime());
                break;
            case "d13":
                Date date13 = getDates(monthName, year, "d13");
                newAttendance.setD13(checkAndApplyLeave(date13, staffId, status));
                newAttendance.setD13In(attendanceDTO.getInTime());
                newAttendance.setD13Out(attendanceDTO.getOutTime());
                break;
            case "d14":
                Date date14 = getDates(monthName, year, "d14");
                newAttendance.setD14(checkAndApplyLeave(date14, staffId, status));
                newAttendance.setD14In(attendanceDTO.getInTime());
                newAttendance.setD14Out(attendanceDTO.getOutTime());
                break;
            case "d15":
                Date date15 = getDates(monthName, year, "d15");
                newAttendance.setD15(checkAndApplyLeave(date15, staffId, status));
                newAttendance.setD15In(attendanceDTO.getInTime());
                newAttendance.setD15Out(attendanceDTO.getOutTime());
                break;
            case "d16":
                Date date16 = getDates(monthName, year, "d16");
                newAttendance.setD16(checkAndApplyLeave(date16, staffId, status));
                newAttendance.setD16In(attendanceDTO.getInTime());
                newAttendance.setD16Out(attendanceDTO.getOutTime());
                break;
            case "d17":
                Date date17 = getDates(monthName, year, "d17");
                newAttendance.setD17(checkAndApplyLeave(date17, staffId, status));
                newAttendance.setD17In(attendanceDTO.getInTime());
                newAttendance.setD17Out(attendanceDTO.getOutTime());
                break;
            case "d18":
                Date date18 = getDates(monthName, year, "d18");
                newAttendance.setD18(checkAndApplyLeave(date18, staffId, status));
                newAttendance.setD18In(attendanceDTO.getInTime());
                newAttendance.setD18Out(attendanceDTO.getOutTime());
                break;
            case "d19":
                Date date19 = getDates(monthName, year, "d19");
                newAttendance.setD19(checkAndApplyLeave(date19, staffId, status));
                newAttendance.setD19In(attendanceDTO.getInTime());
                newAttendance.setD19Out(attendanceDTO.getOutTime());
                break;
            case "d20":
                Date date20 = getDates(monthName, year, "d20");
                newAttendance.setD20(checkAndApplyLeave(date20, staffId, status));
                newAttendance.setD20In(attendanceDTO.getInTime());
                newAttendance.setD20Out(attendanceDTO.getOutTime());
                break;
            case "d21":
                Date date21 = getDates(monthName, year, "d21");
                newAttendance.setD21(checkAndApplyLeave(date21, staffId, status));
                newAttendance.setD21In(attendanceDTO.getInTime());
                newAttendance.setD21Out(attendanceDTO.getOutTime());
                break;
            case "d22":
                Date date22 = getDates(monthName, year, "d22");
                newAttendance.setD22(checkAndApplyLeave(date22, staffId, status));
                newAttendance.setD22In(attendanceDTO.getInTime());
                newAttendance.setD22Out(attendanceDTO.getOutTime());
                break;
            case "d23":
                Date date23 = getDates(monthName, year, "d23");
                newAttendance.setD23(checkAndApplyLeave(date23, staffId, status));
                newAttendance.setD23In(attendanceDTO.getInTime());
                newAttendance.setD23Out(attendanceDTO.getOutTime());
                break;
            case "d24":
                Date date24 = getDates(monthName, year, "d24");
                newAttendance.setD24(checkAndApplyLeave(date24, staffId, status));
                newAttendance.setD24In(attendanceDTO.getInTime());
                newAttendance.setD24Out(attendanceDTO.getOutTime());
                break;
            case "d25":
                Date date25 = getDates(monthName, year, "d25");
                newAttendance.setD25(checkAndApplyLeave(date25, staffId, status));
                newAttendance.setD25In(attendanceDTO.getInTime());
                newAttendance.setD25Out(attendanceDTO.getOutTime());
                break;
            case "d26":
                Date date26 = getDates(monthName, year, "d26");
                newAttendance.setD26(checkAndApplyLeave(date26, staffId, status));
                newAttendance.setD26In(attendanceDTO.getInTime());
                newAttendance.setD26Out(attendanceDTO.getOutTime());
                break;
            case "d27":
                Date date27 = getDates(monthName, year, "d27");
                newAttendance.setD27(checkAndApplyLeave(date27, staffId, status));
                newAttendance.setD27In(attendanceDTO.getInTime());
                newAttendance.setD27Out(attendanceDTO.getOutTime());
                break;
            case "d28":
                Date date28 = getDates(monthName, year, "d28");
                newAttendance.setD28(checkAndApplyLeave(date28, staffId, status));
                newAttendance.setD28In(attendanceDTO.getInTime());
                newAttendance.setD28Out(attendanceDTO.getOutTime());
                break;
            case "d29":
                Date date29 = getDates(monthName, year, "d29");
                newAttendance.setD29(checkAndApplyLeave(date29, staffId, status));
                newAttendance.setD29In(attendanceDTO.getInTime());
                newAttendance.setD29Out(attendanceDTO.getOutTime());
                break;
            case "d30":
                Date date30 = getDates(monthName, year, "d30");
                newAttendance.setD30(checkAndApplyLeave(date30, staffId, status));
                newAttendance.setD30In(attendanceDTO.getInTime());
                newAttendance.setD30Out(attendanceDTO.getOutTime());
                break;
            case "d31":
                Date date31 = getDates(monthName, year, "d31");
                newAttendance.setD31(checkAndApplyLeave(date31, staffId, status));
                newAttendance.setD31In(attendanceDTO.getInTime());
                newAttendance.setD31Out(attendanceDTO.getOutTime());
                break;
        }
    }

    public Date getDates(String monthName, int year, String day) throws IllegalArgumentException {
        // Extract day number from "dayX"
        if (day == null || !day.startsWith("d")) {
            throw new IllegalArgumentException("Invalid day format. Expected 'dayX'.");
        }

        int dayNumber = Integer.parseInt(day.substring(1));

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
            start = start.plusDays(1);
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

    public HoStaffLeaves isAppliedForLeave(Date fromDate, Long staffId) {
        HoStaffLeaves leaves = leaveRepo.findByFromDate(fromDate, staffId);
        return leaves;
    }

}
