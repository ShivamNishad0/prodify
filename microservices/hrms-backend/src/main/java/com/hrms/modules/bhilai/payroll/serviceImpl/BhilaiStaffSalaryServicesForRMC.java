package com.hrms.modules.bhilai.payroll.serviceImpl;

import com.hrms.modules.bhilai.hiring.models.BhilaiSalaryStructure;
import com.hrms.modules.bhilai.hiring.models.BhilaiStaff;
import com.hrms.modules.bhilai.hiring.repository.BhilaiSalaryStructureRepo;
import com.hrms.modules.bhilai.hiring.repository.BhilaiStaffRepo;
import com.hrms.modules.bhilai.payroll.modles.BhilaiStaffSalaryDetails;
import com.hrms.modules.bhilai.payroll.repository.BhilaiAttendanceDeatilsRepository;
import com.hrms.modules.bhilai.payroll.repository.BhilaiStaffSalaryDetailsRepository;
import com.hrms.modules.bhilai.payroll.service.BhilaiSalaryEarnedService;
import com.hrms.modules.utilsServics.Result;
import com.hrms.modules.utilsServics.Status;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.sql.Timestamp;
import java.time.Month;
import java.time.YearMonth;
import java.util.Locale;

@Service
public class BhilaiStaffSalaryServicesForRMC {

    @Autowired
    private BhilaiStaffSalaryDetailsRepository salaryRepo;
    @Autowired
    private BhilaiAttendanceDeatilsRepository detailsRepo;
    @Autowired
    private BhilaiSalaryStructureRepo bhilaiSalaryStructureRepo;
    @Autowired
    BhilaiSalaryEarnedService salaryEarned;
    @Autowired
    BhilaiStaffRepo bhilaiStaffRepo;

    public String generateSalaryForTargetBased(Long StaffId, int year, String month,BigDecimal target,Long salaryStructureId) {
        System.out.println("MAKING SALARY DETAILS PLEASE WAIT");
        Integer yearof = year;
//        AttendanceDeatils details = detailsRepo.findByDetails(StaffId, month, yearof.toString());
        BhilaiSalaryStructure structure = bhilaiSalaryStructureRepo.findById(salaryStructureId).get();
        BhilaiStaff foundBhilaiStaff = bhilaiStaffRepo.findById(StaffId).get();

        if (structure == null) {
            return Result.NOT_FOUND.toString() + " Salary Structure Not Found Of Staff " + foundBhilaiStaff.getTempEmp();
        }

        // Getting number of days in the month
        int numberOfDayInThatMonth = getDaysInMonth(month, year);

        BigDecimal achivedGross = structure.getGross()
                .multiply(target)
                .setScale(2, RoundingMode.HALF_UP)
                .divide(new BigDecimal(100), 2, RoundingMode.HALF_UP);

        System.out.println("ACHIVED GROSS OF EMP ====> "+structure.getEmpNo()+" Structure Gross = "+structure.getGross()+" Target Of Month = "+ target+" Achived ==>"+achivedGross);
        // Calculating one day salary
        BigDecimal oneDay = calculateDailyAmount(achivedGross, numberOfDayInThatMonth);

        // Calculating gross salary by no of days present and adding half day salary
        // Calculate tempGross
//        BigDecimal tempGross = oneDay.multiply(new BigDecimal(details.getNoOfDayPresent()));
        BigDecimal tempGross = achivedGross;

        // Calculate the final sum and apply scale
        BigDecimal grossSalary = tempGross.setScale(2, RoundingMode.DOWN);
        grossSalary=grossSalary.setScale(0, RoundingMode.DOWN);
        // Calculating basic salary by taking 40% of gross
        BigDecimal scale = structure.getScale()!=null?structure.getScale():new BigDecimal(0.42);
//    System.out.println("SCALE === EMP => "+scale+" of "+structure.getEmpNo());
        BigDecimal basic = grossSalary.multiply(scale).setScale(2, RoundingMode.HALF_UP);


        // Calculating HRA salary by taking 40% of basic
//    BigDecimal sumOfDaAndBasic = basic.add(da);
        BigDecimal hra = basic.multiply(new BigDecimal(0.40)).setScale(2, RoundingMode.HALF_UP);

        // Calculating sum of basic and HRA
        BigDecimal sumOfBasicAndHra = basic.add(hra);

        // Calculating conv and other part of salary
        BigDecimal convAndOther = grossSalary.subtract(sumOfBasicAndHra).setScale(2, RoundingMode.HALF_UP);

        // Calculating PF part of salary
        BigDecimal pf = BigDecimal.ZERO;
        if (structure.getPfStatus().equals(Status.TRUE)) {
            if (structure.getBasic().compareTo(new BigDecimal("15000")) <= 0) {
                pf = basic.multiply(structure.getPfPercent()).setScale(2, RoundingMode.HALF_UP);
            }
        }

        // Calculating ESI part of salary
        BigDecimal esi = BigDecimal.ZERO;
        if (structure.getEsiStatus().equals(Status.TRUE)) {
            if (structure.getGross().compareTo(new BigDecimal("21000")) <= 0) {
                esi = grossSalary.multiply(structure.getEsiPercent().divide(new BigDecimal(100)))
                        .setScale(2, RoundingMode.HALF_UP);
            }
        }
        System.out.println("EMP NO ===> "+structure.getEmpNo()+" SCALE ==> "+scale+" GROSS ==> "+grossSalary+" BASIC ==> "+basic+" HRA==> "+hra+" PF==> "+pf+" ESI ==> "+esi);
        // Calculating deduction part of salary
        BigDecimal deduction = pf.add(esi).setScale(2, RoundingMode.HALF_UP);

        // Calculating net pay
        BigDecimal netpay = grossSalary.subtract(deduction).setScale(2, RoundingMode.HALF_UP);

        String yearName = Integer.toString(year);
        BhilaiStaffSalaryDetails foundSalary = salaryRepo.findBydetails(StaffId, month, yearName);
        if (foundSalary == null) {
            // Saving the calculated salary
            BhilaiStaffSalaryDetails salary = new BhilaiStaffSalaryDetails();
            salary.setStaffId(StaffId);
            salary.setEmpNo(structure.getEmpNo());
            salary.setYear(yearName);
            salary.setStaffName(foundBhilaiStaff.getName());
            salary.setMonth(month);
            salary.setBasic(basic);
//        salary.setDa(da);
            salary.setHra(hra);
            salary.setConv_or_Other(convAndOther);
            salary.setGross(grossSalary);
            salary.setEmpPF(pf);
            salary.setEmpESI(esi);
            salary.setNetPaid(netpay);
            salary.setTotalNoDay(numberOfDayInThatMonth);
//            salary.setNoOfDayPresent(Integer.parseInt(details.getNoOfDayPresent()));
//            salary.setNoOfDayAbsent(Integer.parseInt(details.getNoOfDayAbsent()));
//            salary.setNoOfHalfDay(Integer.parseInt(details.getNoOfDayHalfPresent()));
            salary.setDedOfEmpShare(deduction);
            salary.setStatus(Status.UNVERIFIED);
            salary.setIsTargetBased(Status.TRUE);
            salary.setIsTargetBased(salary.getIsTargetBased());
            Timestamp currentTimestamp = new Timestamp(System.currentTimeMillis());
            salary.setStamp(currentTimestamp);
            salary.setOnHold(Status.FALSE);
            BhilaiStaffSalaryDetails saved = salaryRepo.save(salary);
            return saved != null ? Result.SUCCESS.toString() : Result.WENT_WRONG.toString();
        } else {
            // Updating the calculated salary
            foundSalary.setBasic(basic);
            foundSalary.setHra(hra);
            foundSalary.setConv_or_Other(convAndOther);
            foundSalary.setGross(grossSalary);
            foundSalary.setEmpPF(pf);
//        foundSalary.setDa(da);
            foundSalary.setEmpESI(esi);
            foundSalary.setNetPaid(netpay);
            foundSalary.setDedOfEmpShare(deduction);
//            foundSalary.setNoOfDayPresent(Integer.parseInt(details.getNoOfDayPresent()));
//            foundSalary.setNoOfDayAbsent(Integer.parseInt(details.getNoOfDayAbsent()));
//            foundSalary.setNoOfHalfDay(Integer.parseInt(details.getNoOfDayHalfPresent()));
            BhilaiStaffSalaryDetails saved = salaryRepo.save(foundSalary);
            return saved != null ? Result.SUCCESS.toString() : Result.WENT_WRONG.toString();
        }
    }

    //	HELPING METHODS ------------------------------------------------------------------------------------

    public int getDaysInMonth(String monthName, int year) {
        // Convert the month name to a Month enum
        Month month = Month.valueOf(monthName.toUpperCase(Locale.ENGLISH));

        // Create a YearMonth instance for the specified month and year
        YearMonth yearMonth = YearMonth.of(year, month);

        // Return the number of days in the specified month and year
        return yearMonth.lengthOfMonth();
    }

    public BigDecimal calculateDailyAmount(BigDecimal gross, int numberOfDayInThatMonth) {
        if (numberOfDayInThatMonth == 0) {
            throw new ArithmeticException("Number of days in the month cannot be zero.");
        }

        BigDecimal divisor = new BigDecimal(numberOfDayInThatMonth);
        BigDecimal oneDay = gross.divide(divisor,2, RoundingMode.CEILING);
        return oneDay;
    }

}
