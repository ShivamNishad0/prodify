package com.hrms.modules.ho;

import com.hrms.modules.ho.hiring.models.HoStaff;
import com.hrms.modules.ho.hiring.repository.HoStaffRepo;
import com.hrms.modules.ho.payroll.modles.HoStaffAttendance;
import com.hrms.modules.ho.payroll.repository.HoStaffAttendanceRepository;
import com.hrms.modules.ho.payroll.modles.HoStaffSalaryDetails;
import com.hrms.modules.ho.payroll.repository.HoStaffSalaryDetailsRepository;
import com.hrms.modules.ho.hiring.models.HoStaffAssests;
import com.hrms.modules.ho.hiring.repository.HoStaffAssestsRepo;
import com.hrms.modules.utilsServics.Attendance;
import com.hrms.modules.utilsServics.Status;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.sql.Date;
import java.time.LocalDate;
import java.time.Month;
import java.time.Year;
import java.util.ArrayList;
import java.util.List;

@Component
public class MockDataSeeder implements CommandLineRunner {

    @Autowired
    private HoStaffRepo staffRepo;

    @Autowired
    private HoStaffAttendanceRepository attendanceRepo;

    @Autowired
    private HoStaffSalaryDetailsRepository salaryRepo;

    @Autowired
    private HoStaffAssestsRepo assetRepo;

    @Override
    public void run(String... args) throws Exception {
        if (staffRepo.count() == 0) {
            System.out.println("No staff found in HO. Starting mock data generation...");
            generateMockData();
            System.out.println("Mock data generation complete.");
        } else {
            System.out.println("Staff already exists. Skipping mock data generation.");
        }
    }

    private void generateMockData() {
        String[] names = {"John Doe", "Jane Smith", "Michael Johnson", "Emily Davis", "David Wilson"};
        String[] designations = {"Software Engineer", "HR Manager", "Product Owner", "QA Lead", "DevOps Engineer"};
        
        List<HoStaff> staffList = new ArrayList<>();
        
        for (int i = 0; i < 5; i++) {
            HoStaff staff = new HoStaff();
            staff.setName(names[i]);
            staff.setEmpNo("EMP-HO-" + (1001 + i));
            staff.setTempEmp("EMP-HO-" + (1001 + i));
            staff.setContactNo("987654321" + i);
            staff.setEmail(names[i].toLowerCase().replace(" ", ".") + "@prodify.com");
            staff.setGender(i % 2 == 0 ? "Male" : "Female");
            staff.setAge(25 + i);
            staff.setJobCat(designations[i]);
            staff.setActive(Status.ACTIVE);
            staff.setVerified(Status.VERIFIED);
            staff.setDateOfJoining(LocalDate.now().minusMonths(i + 1).toString());
            staff.setFilledDate(Date.valueOf(LocalDate.now()));
            staff = staffRepo.save(staff);
            staffList.add(staff);
        }

        // Generate Attendance, Salary, and Assets
        for (HoStaff staff : staffList) {
            // Attendance
            HoStaffAttendance attendance = new HoStaffAttendance();
            attendance.setStaffId(staff.getStaffId());
            attendance.setEmpNo(staff.getEmpNo());
            attendance.setEmpName(staff.getName());
            attendance.setYear(Year.now());
            attendance.setMonth(LocalDate.now().getMonth());
            attendance.setMonthName(LocalDate.now().getMonth().name());
            attendance.setD1(Attendance.PRESENTS);
            attendance.setD2(Attendance.PRESENTS);
            attendance.setD3(Attendance.ABSENT);
            attendance.setD4(Attendance.PRESENTS);
            attendance.setD5(Attendance.PRESENTS);
            attendance.setD6(Attendance.PL);
            attendance.setD7(Attendance.WO);
            attendance.setStatus(Status.ACTIVE);
            attendance.setVerified(Status.VERIFIED);
            attendanceRepo.save(attendance);

            // Salary Details
            HoStaffSalaryDetails salary = new HoStaffSalaryDetails();
            salary.setStaffId(staff.getStaffId());
            salary.setEmpNo(staff.getEmpNo());
            salary.setStaffName(staff.getName());
            salary.setBasic(new java.math.BigDecimal("50000.00"));
            salary.setHra(new java.math.BigDecimal("15000.00"));
            salary.setConv_or_Other(new java.math.BigDecimal("5000.00"));
            salary.setGross(new java.math.BigDecimal("70000.00"));
            salary.setNetPaid(new java.math.BigDecimal("65000.00"));
            salary.setTotalNoDay(30);
            salary.setNoOfDayPresent(25);
            salary.setNoOfDayAbsent(2);
            salary.setMonth(LocalDate.now().getMonth().name());
            salary.setYear(String.valueOf(Year.now().getValue()));
            salary.setStatus(Status.ACTIVE);
            salaryRepo.save(salary);

            // Assets
            HoStaffAssests asset = new HoStaffAssests();
            asset.setStaffId(staff.getStaffId());
            asset.setEmpNo(staff.getEmpNo());
            asset.setReciverName(staff.getName());
            asset.setAssetId("ASSET-LAPTOP-" + staff.getStaffId());
            asset.setModelNo("MacBook Pro 16");
            asset.setDeviceSlNo("C02Z5A" + staff.getStaffId());
            asset.setDateOfIssue(Date.valueOf(LocalDate.now()));
            asset.setRam("16GB");
            asset.setHardDisk("512GB SSD");
            assetRepo.save(asset);
        }
    }
}
