package com.hrms.modules.suda.payroll.serviceImpl;

import com.hrms.modules.suda.hiring.models.SudaSalaryStructure;
import com.hrms.modules.suda.hiring.models.SudaStaff;
import com.hrms.modules.suda.hiring.repository.SudaSalaryStructureRepo;
import com.hrms.modules.suda.hiring.repository.SudaStaffRepo;
import com.hrms.modules.suda.payroll.modles.SudaStaffSalaryDetails;
import com.hrms.modules.suda.payroll.repository.SudaAttendanceDeatilsRepository;
import com.hrms.modules.suda.payroll.repository.SudaStaffSalaryDetailsRepository;
import com.hrms.modules.suda.payroll.service.SudaSalaryEarnedService;
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
public class SudaStaffSalaryServicesForTarget {

    @Autowired
    private SudaStaffSalaryDetailsRepository salaryRepo;
    @Autowired
    private SudaAttendanceDeatilsRepository detailsRepo;
    @Autowired
    private SudaSalaryStructureRepo salaryStructureRepo;
    @Autowired
    SudaSalaryEarnedService salaryEarned;
    @Autowired
    SudaStaffRepo staffRepo;

    public String generateSalaryForTargetBased(Long StaffId, int year, String month,BigDecimal target,Long salaryStructureId) {
        System.out.println("MAKING SALARY DETAILS PLEASE WAIT");
        Integer yearof = year;
        String yearName = Integer.toString(year);
//        AttendanceDeatils details = detailsRepo.findByDetails(StaffId, month, yearof.toString());
        SudaSalaryStructure structure = salaryStructureRepo.findById(salaryStructureId).get();
        SudaStaff foundStaff = staffRepo.findById(StaffId).get();

        if (structure == null) {
            return Result.NOT_FOUND.toString() + " Salary Structure Not Found Of Staff " + foundStaff.getTempEmp();
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

//        security deduction section
        BigDecimal []secDeduction=calculateSecurityDeduction(structure,grossSalary,month,yearName);

        // Calculating net pay
        BigDecimal netpay = grossSalary.subtract(deduction);

        netpay=netpay.subtract(secDeduction[0]);


        SudaStaffSalaryDetails foundSalary = salaryRepo.findBydetails(StaffId, month, yearName);
        BigDecimal ded = (foundSalary==null||foundSalary.getDeduction()==null)?BigDecimal.ZERO:foundSalary.getDeduction();
        if(foundSalary!=null||ded.compareTo(BigDecimal.ZERO)>0){
            netpay.subtract(foundSalary.getDeduction());
        }
        if (foundSalary == null) {
            // Saving the calculated salary
            SudaStaffSalaryDetails salary = new SudaStaffSalaryDetails();
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
            salary.setOnHold(Status.FALSE);
            salary.setIsTargetBased(salary.getIsTargetBased());
            salary.setSecurityDeduction(secDeduction[0]);
            Timestamp currentTimestamp = new Timestamp(System.currentTimeMillis());
            salary.setStamp(currentTimestamp);
            SudaStaffSalaryDetails saved = salaryRepo.save(salary);
            BigDecimal tempPending =structure.getPendingSecurity()==null?BigDecimal.ZERO:structure.getPendingSecurity();
            structure.setPendingSecurity(tempPending.subtract(secDeduction[1]).add(secDeduction[0]));
            salaryStructureRepo.save(structure);
            return saved != null ? Result.SUCCESS.toString() : Result.WENT_WRONG.toString();
        } else {
            BigDecimal previousDeduction = foundSalary.getDeduction() == null ? BigDecimal.ZERO : foundSalary.getDeduction();
            netpay.subtract(previousDeduction);
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
            foundSalary.setSecurityDeduction(secDeduction[0]);
//            foundSalary.setNoOfDayPresent(Integer.parseInt(details.getNoOfDayPresent()));
//            foundSalary.setNoOfDayAbsent(Integer.parseInt(details.getNoOfDayAbsent()));
//            foundSalary.setNoOfHalfDay(Integer.parseInt(details.getNoOfDayHalfPresent()));
            SudaStaffSalaryDetails saved = salaryRepo.save(foundSalary);
            BigDecimal tempPending=structure.getPendingSecurity()==null?BigDecimal.ZERO:structure.getPendingSecurity();
            structure.setPendingSecurity(tempPending.subtract(secDeduction[1]).add(secDeduction[0]));
            salaryStructureRepo.save(structure);
            return saved != null ? Result.SUCCESS.toString() : Result.WENT_WRONG.toString();
        }
    }

    public String generateSalaryForFixedBased(Long StaffId, int year, String month,BigDecimal target,Long salaryStructureId) {
        System.out.println("MAKING SALARY DETAILS PLEASE WAIT");
        Integer yearof = year;
//        AttendanceDeatils details = detailsRepo.findByDetails(StaffId, month, yearof.toString());
        SudaSalaryStructure structure = salaryStructureRepo.findById(salaryStructureId).get();
        SudaStaff foundStaff = staffRepo.findById(StaffId).get();

        if (structure == null) {
            return Result.NOT_FOUND.toString() + " Salary Structure Not Found Of Staff " + foundStaff.getTempEmp();
        }

        // Getting number of days in the month
        int numberOfDayInThatMonth = getDaysInMonth(month, year);

        BigDecimal achivedGross = target;

        System.out.println("ACHIVED GROSS OF EMP ====> "+structure.getEmpNo()+" Structure Gross = "+structure.getGross()+" Target Of Month = "+ target+" Achived ==>"+achivedGross);
        // Calculating one day salary

        // Calculate the final sum and apply scale
        BigDecimal grossSalary = achivedGross.setScale(2, RoundingMode.DOWN);
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
        String yearName = Integer.toString(year);
//        security deduction section
        BigDecimal[] secDeduction=calculateSecurityDeduction(structure,grossSalary,month,yearName);

        // Calculating net pay
        BigDecimal netpay = grossSalary.subtract(deduction);

        netpay=netpay.subtract(secDeduction[0]);


        SudaStaffSalaryDetails foundSalary = salaryRepo.findBydetails(StaffId, month, yearName);
        BigDecimal ded = (foundSalary==null||foundSalary.getDeduction()==null)?BigDecimal.ZERO:foundSalary.getDeduction();
        if(foundSalary!=null||ded.compareTo(BigDecimal.ZERO)>0){
            netpay.subtract(foundSalary.getDeduction());
        }
        if (foundSalary == null) {
            // Saving the calculated salary
            SudaStaffSalaryDetails salary = new SudaStaffSalaryDetails();
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
            salary.setOnHold(Status.FALSE);
            salary.setIsTargetBased(Status.FIXED);
            salary.setSecurityDeduction(secDeduction[0]);
            Timestamp currentTimestamp = new Timestamp(System.currentTimeMillis());
            salary.setStamp(currentTimestamp);
            SudaStaffSalaryDetails saved = salaryRepo.save(salary);
            structure.setPendingSecurity(structure.getPendingSecurity().subtract(secDeduction[1]).add(secDeduction[0]));
            salaryStructureRepo.save(structure);
            return saved != null ? Result.SUCCESS.toString() : Result.WENT_WRONG.toString();
        } else {
            BigDecimal previousDeduction = foundSalary.getDeduction() == null ? BigDecimal.ZERO : foundSalary.getDeduction();
            netpay.subtract(previousDeduction);
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
            foundSalary.setSecurityDeduction(secDeduction[0]);
//            foundSalary.setNoOfDayPresent(Integer.parseInt(details.getNoOfDayPresent()));
//            foundSalary.setNoOfDayAbsent(Integer.parseInt(details.getNoOfDayAbsent()));
//            foundSalary.setNoOfHalfDay(Integer.parseInt(details.getNoOfDayHalfPresent()));
            SudaStaffSalaryDetails saved = salaryRepo.save(foundSalary);
            structure.setPendingSecurity(structure.getPendingSecurity().subtract(secDeduction[1]).add(secDeduction[0]));
            salaryStructureRepo.save(structure);
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


    public BigDecimal[] calculateSecurityDeduction(SudaSalaryStructure structure,BigDecimal calculatedGross,String month,String yearName){

        SudaStaffSalaryDetails foundSalary = salaryRepo.findBydetails(structure.getStaffId(), month, yearName);

        BigDecimal deductionOfCurrentMonth = (foundSalary==null||foundSalary.getSecurityDeduction()==null)?BigDecimal.ZERO: foundSalary.getSecurityDeduction();

        BigDecimal security = structure.getSecurity();
        BigDecimal tempPending = structure.getPendingSecurity()==null?BigDecimal.ZERO:structure.getPendingSecurity();
        BigDecimal pendingSecurity= tempPending.subtract(deductionOfCurrentMonth);
        BigDecimal securityDeductionAmt = calculatedGross.multiply(new BigDecimal(0.05));
        BigDecimal remainingSecAmt=security.subtract(pendingSecurity);

        BigDecimal[]result=new BigDecimal[2];
        if(remainingSecAmt.compareTo(BigDecimal.ZERO)>0){
            if(remainingSecAmt.compareTo(securityDeductionAmt)>0){
                  result[0]=securityDeductionAmt;
                  result[1]=deductionOfCurrentMonth;
                  return result;
            }
            result[0]=remainingSecAmt;
            result[1]=deductionOfCurrentMonth;
            return result;
        }
        result[0]=BigDecimal.ZERO;
        result[1]=BigDecimal.ZERO;
        return result;
    }
}
