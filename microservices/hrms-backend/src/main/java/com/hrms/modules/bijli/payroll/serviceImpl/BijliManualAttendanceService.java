package com.hrms.modules.bijli.payroll.serviceImpl;

import com.hrms.modules.bijli.hiring.models.BijliSalaryStructure;
import com.hrms.modules.bijli.hiring.models.BijliStaff;
import com.hrms.modules.bijli.hiring.repository.BijliSalaryStructureRepo;
import com.hrms.modules.bijli.hiring.repository.BijliStaffRepo;
import com.hrms.modules.bijli.payroll.modles.*;
import com.hrms.modules.bijli.payroll.repository.*;
import com.hrms.modules.bijli.payroll.service.BijliAttendanceDeatilsService;
import com.hrms.modules.dtos.AttendanceDTO;
import com.hrms.modules.dtos.CountAndDetails;
import com.hrms.modules.dtos.ManualAttendaceDTO;
import com.hrms.modules.dtos.StaffAttendanceDTO;
import com.hrms.modules.utilsServics.Attendance;
import com.hrms.modules.utilsServics.Result;
import com.hrms.modules.utilsServics.Status;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.*;
import java.time.Month;
import java.time.format.TextStyle;

@Slf4j
@Service
public class BijliManualAttendanceService {

    @Autowired
    private BijliHolidayRepo holidayRepo;
    @Autowired
    private BijliStaffLeavesRepository leaveRepo;
    @Autowired
    private BijliStaffRepo staffRepo;
    @Autowired
    private BijliStaffAttendanceRepository attendanceRepo;
    @Autowired
    private BijliStaffSalaryDetailsRepository salaryDetails;
    @Autowired
    private BijliAttendanceDeatilsService detailService;
    @Autowired
    private BijliSalaryStructureRepo salaryStructureRepo;
    @Autowired
    private BijliAttendanceDeatilsRepository attendanceDeatilsRepo;


    public String markAttendance(List<ManualAttendaceDTO> dto) {
        try {
            for (ManualAttendaceDTO data : dto) {
                // Generate present data for the given month
                List<Map<String, String>> presentData = markDayPresent(data.getPresent(), data.getMonthName());

                // Create attendance DTO for the staff
                List<AttendanceDTO> attendanceList = new ArrayList<>();
                for (Map<String, String> details : presentData) {
                    details.forEach((day, status) -> {
                        AttendanceDTO attendanceDTO = new AttendanceDTO();
                        attendanceDTO.setDay(day);
                        attendanceDTO.setStatus(status);
                        attendanceList.add(attendanceDTO);
                    });
                }

                // Prepare attendance details
                StaffAttendanceDTO staffAttendanceDTO = new StaffAttendanceDTO();
                staffAttendanceDTO.setEmpNo(data.getEmpNo());
                staffAttendanceDTO.setCreatedBy(data.getCreatedBy());
                staffAttendanceDTO.setYear(data.getYear());
                staffAttendanceDTO.setMonthName(data.getMonthName());
                staffAttendanceDTO.setAttendance(attendanceList);

                // Fetch the staff information
                BijliStaff staff = staffRepo.findStaffByTemp_emp(data.getEmpNo());
                if (staff == null) {
                    return "Staff not found for EmpNo=" + data.getEmpNo();
                }

                // Check if attendance exists for the given month and year
                BijliStaffAttendance existingAttendance = attendanceRepo.findByDetails(staff.getStaffId(), data.getMonthName(), data.getYear());
                if (existingAttendance == null) {
                    createNewAttendance(new BijliStaffAttendance(), staff, staffAttendanceDTO);
                } else {
                    updateExistingAttendance(existingAttendance, staffAttendanceDTO);
                }
            }
            return Result.SUCCESS.toString();
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }


    private List<Map<String, String>> markDayPresent(String noOfDayPresent, String monthName) {
        List<Map<String, String>> dayPresent = new ArrayList<>();

            int daysInMonth = Integer.parseInt(noOfDayPresent);
            Month month = Month.valueOf(monthName.toUpperCase());
            int year = LocalDate.now().getYear();

            for (int i = 1; i <= daysInMonth; i++) {
                LocalDate date = LocalDate.of(year, month.getValue(), i);
                String dayName = date.getDayOfWeek().getDisplayName(TextStyle.FULL, Locale.ENGLISH).toUpperCase();
                Map<String, String> dayStatus = new HashMap<>();
                String dayKey = "d" + i;

                if (dayName.equals("SUNDAY")) {
                    dayStatus.put(dayKey, Attendance.WO.toString());
                } else {
                    dayStatus.put(dayKey, Attendance.PRESENTS.toString());
                }

                dayPresent.add(dayStatus);
            }
            return dayPresent;
    }

    private String createNewAttendance(BijliStaffAttendance newAttendance, BijliStaff staff, StaffAttendanceDTO staffAt) {
        // Create a fresh instance for the current attendance record
        BijliStaffAttendance attendanceRecord = new BijliStaffAttendance();
        attendanceRecord.setStaffId(staff.getStaffId());
        attendanceRecord.setEmpNo(staffAt.getEmpNo());
        attendanceRecord.setStatus(Status.ACTIVE);
        attendanceRecord.setEmpName(staff.getName());
        attendanceRecord.setYear(staffAt.getYear());
        attendanceRecord.setMonth(getCurrentMonth());
        attendanceRecord.setMonthName(staffAt.getMonthName());
        attendanceRecord.setVerified(Status.UNVERIFIED);
        attendanceRecord.setCreatedBy(staffAt.getCreatedBy());
        attendanceRecord.setStamp(new Timestamp(System.currentTimeMillis()));

        // Process attendance details
        for (AttendanceDTO attendanceDTO : staffAt.getAttendance()) {
            setDayAttendance(attendanceRecord, attendanceDTO, staffAt.getYear(), staffAt.getMonthName(), staff.getStaffId());
        }

        // Save the attendance record
        BijliStaffAttendance savedAttendance = attendanceRepo.save(attendanceRecord);

        if (savedAttendance != null) {
            BijliStaffSalaryDetails foundData = salaryDetails.findBydetails(
                    savedAttendance.getStaffId(),
                    savedAttendance.getMonthName(),
                    savedAttendance.getYear().toString()
            );
            String status = (foundData == null || foundData.getStatus() == null) ? "N/A" : foundData.getStatus().toString();
            if (status.equals("N/A") || status.equals(Status.UNVERIFIED.toString())) {
                detailService.createOrUpdateStaffAttendanceDetails(
                        savedAttendance.getAttendanceId(),
                        savedAttendance.getStaffId(),
                        savedAttendance.getMonthName(),
                        savedAttendance.getYear().toString()
                );
                return Result.SUCCESS.toString();
            }
            return Result.INVALID_ACTION.toString();
        }
        return Result.WENT_WRONG.toString();
    }



    private String updateExistingAttendance(BijliStaffAttendance found, StaffAttendanceDTO staffAt) {
        found.setStatus(Status.ACTIVE);
        found.setMonth(getCurrentMonth());
        found.setVerified(Status.UNVERIFIED);
        found.setCreatedBy(staffAt.getCreatedBy());
        found.setStamp(new Timestamp(System.currentTimeMillis()));

        for (AttendanceDTO attendanceDTO : staffAt.getAttendance()) {
            BijliStaff staff = staffRepo.findStaffByTemp_emp(staffAt.getEmpNo());
            setDayAttendance(found, attendanceDTO, staffAt.getYear(), staffAt.getMonthName(), staff.getStaffId());
        }

        BijliStaffAttendance savedAttendance = attendanceRepo.save(found);
        if (savedAttendance != null) {
            BijliStaffSalaryDetails foundData = salaryDetails.findBydetails(savedAttendance.getStaffId(), savedAttendance.getMonthName(), savedAttendance.getYear().toString());
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


    public CountAndDetails getDataToMarkAttendance(String month, String year, String empNo, String[] areaId, Pageable pageable) {
        CountAndDetails result = new CountAndDetails();
        List<ManualAttendaceDTO> dtos = new ArrayList<>();

        // Parse area IDs
        Long[] area = (areaId != null && areaId.length > 0)
                ? Arrays.stream(areaId).map(Long::parseLong).toArray(Long[]::new)
                : new Long[0];

        // Determine repository method based on input
        Page<BijliSalaryStructure> resultPage = fetchSalaryStructures(area, empNo, pageable);
        long count = resultPage.getTotalElements();

        // Process salary structures
        for (BijliSalaryStructure bss : resultPage) {
            BijliStaff found = staffRepo.findStaffByTemp_emp(bss.getEmpNo());
            if (found != null) {
                dtos.add(createAttendanceDTO(bss, found, month, year));
            }
        }

        result.setResults(dtos);
        result.setCount((int) count);
        return result;
    }

    private Page<BijliSalaryStructure> fetchSalaryStructures(Long[] area, String empNo, Pageable pageable) {
        if (area.length > 0 && !empNo.isEmpty()) {
            return salaryStructureRepo.staffNotOnTargetWithEmpNo(area, empNo, pageable);
        } else if (area.length > 0 && (empNo.isEmpty()||empNo==null)) {
            return salaryStructureRepo.staffNotOnTarget(area, pageable);
        } else if (!empNo.isEmpty()) {
            return salaryStructureRepo.staffNotOnTargetByEmpNo(empNo, pageable);
        } else {
            return salaryStructureRepo.staffNotOnTarget(pageable);
        }
    }

    private ManualAttendaceDTO createAttendanceDTO(BijliSalaryStructure bss, BijliStaff found, String month, String year) {
        ManualAttendaceDTO dto = new ManualAttendaceDTO();
        dto.setSalaryId(bss.getSsId().toString());
        dto.setEmpNo(bss.getEmpNo());
        dto.setStaffId(found.getStaffId().toString());
        dto.setEmpName(found.getName());

        // Calculate attendance details
        String empNo = bss.getEmpNo();
        BijliAttendanceDeatils details = attendanceDeatilsRepo.findAttendanceDetails(empNo, month, year);
        dto.setPresent(calculateDaysPresent(details));

        return dto;
    }

    private String calculateDaysPresent(BijliAttendanceDeatils details) {
        if (details == null) {
            return "00";
        }

        String noOfDaysPresent = details.getNoOfDayPresent();
        String noOfWO = details.getNoOfWO();

        if (noOfDaysPresent == null) {
            return "00";
        }

        int totalDaysPresent = Integer.parseInt(noOfDaysPresent);
        if (noOfWO != null) {
            totalDaysPresent += Integer.parseInt(noOfWO);
        }

        return String.valueOf(totalDaysPresent);
    }




//    ---------------😊😊😊😊HELPING METHODS😊😊😊😊-----------

    private void setDayAttendance(BijliStaffAttendance newAttendance, AttendanceDTO attendanceDTO, int year, String monthName, Long staffId) {
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

    private Date getDates(String monthName, int year, String day) throws IllegalArgumentException {
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

    private Attendance checkAndApplyLeave(Date currentDate, Long staffId, Attendance defaultStatus) {
        BijliStaffLeaves leave = isAppliedForLeave(currentDate, staffId);
        BijliHoliday foundHoliday = holidayRepo.findByholidayStart(currentDate);
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

    private  BijliStaffLeaves isAppliedForLeave(Date fromDate, Long staffId) {
        BijliStaffLeaves leaves = leaveRepo.findByFromDate(fromDate, staffId);
        return leaves;
    }

    private List<Date> getDatesBetween(Date fromDate, Date toDate) {
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

    private  Month getCurrentMonth() {
        return LocalDate.now().getMonth();
    }
}
