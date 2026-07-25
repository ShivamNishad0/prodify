package com.hrms.modules.bijli.payroll.serviceImpl;

import com.hrms.modules.bijli.hiring.models.BijliSalaryStructure;
import com.hrms.modules.bijli.hiring.models.BijliStaff;
import com.hrms.modules.bijli.hiring.repository.BijliSalaryStructureRepo;
import com.hrms.modules.bijli.hiring.repository.BijliStaffRepo;
import com.hrms.modules.bijli.payroll.modles.BijliStaffSalaryDetails;
import com.hrms.modules.bijli.payroll.repository.BijliAttendanceDeatilsRepository;
import com.hrms.modules.bijli.payroll.repository.BijliStaffSalaryDetailsRepository;
import com.hrms.modules.bijli.payroll.repository.BijliStaffTargetDetailsRepository;
import com.hrms.modules.bijli.payroll.service.BijliSalaryEarnedService;
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
import java.util.Optional;

@Service
public class BijliStaffSalaryServicesForRMC {

    @Autowired
    private BijliStaffSalaryDetailsRepository salaryRepo;
    @Autowired
    private BijliAttendanceDeatilsRepository detailsRepo;
    @Autowired
    private BijliSalaryStructureRepo bijliSalaryStructureRepo;
    @Autowired
    BijliSalaryEarnedService salaryEarned;
    @Autowired
    BijliStaffRepo staffRepo;
    @Autowired
    private BijliStaffTargetDetailsRepository targetRepo;

    public String generateSalaryForTargetBased(Long StaffId, int year, String month,BigDecimal target,Long salaryStructureId) {
        System.out.println("MAKING SALARY DETAILS PLEASE WAIT");
        Optional<BijliSalaryStructure> salaryStructure = bijliSalaryStructureRepo.findById(salaryStructureId);
        BijliSalaryStructure structure = new BijliSalaryStructure();
        if (salaryStructure.isPresent()){
            structure=salaryStructure.get();
        }else {
            return  Result.WENT_WRONG.toString();
        }
        BijliStaff foundStaff = staffRepo.findById(StaffId).get();

        if (structure == null) {
            return Result.NOT_FOUND.toString() + " Salary Structure Not Found Of Staff " + foundStaff.getTempEmp();
        }

        // Getting number of days in the month
        int numberOfDayInThatMonth = getDaysInMonth(month, year);
        BigDecimal achivedGross = new BigDecimal("5")
                .multiply(target)
                .setScale(2, RoundingMode.HALF_UP);

        System.out.println("ACHIVED GROSS OF EMP ====> "+structure.getEmpNo()+" Structure Gross = "+structure.getGross()+" Target Of Month = "+ target+" Achived ==>"+achivedGross);
        // Calculating one day salary
        BigDecimal oneDay = calculateDailyAmount(achivedGross, numberOfDayInThatMonth);

        // Calculating gross salary by no of days present and adding half day salary
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
        BijliStaffSalaryDetails foundSalary = salaryRepo.findBydetails(StaffId, month, yearName);
        if (foundSalary == null) {
            // Saving the calculated salary
            BijliStaffSalaryDetails salary = new BijliStaffSalaryDetails();
            salary.setStaffId(StaffId);
            salary.setEmpNo(structure.getEmpNo());
            salary.setYear(yearName);
            salary.setStaffName(foundStaff.getName());
            salary.setMonth(month);
            salary.setBasic(basic.setScale(0, RoundingMode.HALF_UP));
//        salary.setDa(da);
            salary.setHra(hra.setScale(0, RoundingMode.HALF_UP));
            salary.setConv_or_Other(convAndOther.setScale(0, RoundingMode.HALF_UP));
            salary.setGross(grossSalary.setScale(0, RoundingMode.HALF_UP));
            salary.setEmpPF(pf.setScale(0, RoundingMode.HALF_UP));
            salary.setEmpESI(esi.setScale(0, RoundingMode.HALF_UP));
            salary.setNetPaid(netpay.setScale(0, RoundingMode.HALF_UP));
            salary.setTotalNoDay(numberOfDayInThatMonth);
//            salary.setNoOfDayPresent(Integer.parseInt(details.getNoOfDayPresent()));
//            salary.setNoOfDayAbsent(Integer.parseInt(details.getNoOfDayAbsent()));
//            salary.setNoOfHalfDay(Integer.parseInt(details.getNoOfDayHalfPresent()));
            salary.setDedOfEmpShare(deduction.setScale(0, RoundingMode.HALF_UP));
            salary.setStatus(Status.UNVERIFIED);
            salary.setIsTargetBased(Status.TRUE);
            salary.setIsTargetBased(salary.getIsTargetBased());
            salary.setOnHold(Status.FALSE);
            Timestamp currentTimestamp = new Timestamp(System.currentTimeMillis());
            salary.setStamp(currentTimestamp);
            BijliStaffSalaryDetails saved = salaryRepo.save(salary);
            return saved != null ? Result.SUCCESS.toString() : Result.WENT_WRONG.toString();
        } else {
            // Updating the calculated salary
            foundSalary.setBasic(basic.setScale(0, RoundingMode.HALF_UP));
            foundSalary.setHra(hra.setScale(0, RoundingMode.HALF_UP));
            foundSalary.setConv_or_Other(convAndOther.setScale(0, RoundingMode.HALF_UP));
            foundSalary.setGross(grossSalary.setScale(0, RoundingMode.HALF_UP));
            foundSalary.setEmpPF(pf.setScale(0, RoundingMode.HALF_UP));
//        foundSalary.setDa(da);
            foundSalary.setEmpESI(esi.setScale(0, RoundingMode.HALF_UP));
            foundSalary.setNetPaid(netpay.setScale(0, RoundingMode.HALF_UP));
            foundSalary.setDedOfEmpShare(deduction.setScale(0, RoundingMode.HALF_UP));
//            foundSalary.setNoOfDayPresent(Integer.parseInt(details.getNoOfDayPresent()));
//            foundSalary.setNoOfDayAbsent(Integer.parseInt(details.getNoOfDayAbsent()));
//            foundSalary.setNoOfHalfDay(Integer.parseInt(details.getNoOfDayHalfPresent()));
            BijliStaffSalaryDetails saved = salaryRepo.save(foundSalary);
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
