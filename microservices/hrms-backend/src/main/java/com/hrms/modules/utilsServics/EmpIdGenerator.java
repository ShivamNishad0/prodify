package com.hrms.modules.utilsServics;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hrms.modules.suda.hiring.models.SudaStaff;
import com.hrms.modules.suda.hiring.repository.SudaStaffRepo;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Service
public class EmpIdGenerator {

    @Autowired
    private SudaStaffRepo staffRepo;

    public String generateEmpCode() {
        // Get the current date
        LocalDate currentDate = LocalDate.now();

        // Format the date to get YYMM
        DateTimeFormatter yearFormatter = DateTimeFormatter.ofPattern("yy");
        DateTimeFormatter monthFormatter = DateTimeFormatter.ofPattern("MM");
        String year = currentDate.format(yearFormatter);
        String month = currentDate.format(monthFormatter);

        SudaStaff sc = staffRepo.getLatest();
        Long prevId = (sc==null||sc.getSampleId() == null) ?10001: sc.getSampleId() + 1 ;

        // Concatenate to form the EmpCode
        String empCode = String.format("SPS-ER/%s%s%05d", year, month, prevId+1);

        return empCode;
    }

    public String getEmpId() {
        String empId;
        SudaStaff staff;

        // Loop until a unique EmpCode is found
        do {
            empId = generateEmpCode();
            staff = staffRepo.findByEmpId(empId);
        } while (staff != null);

        return empId;
    }
}
