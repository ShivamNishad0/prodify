package com.hrms.modules.rmc.payroll.serviceImpl;

import com.hrms.modules.bijli.hiring.models.BijliSalaryStructure;
import com.hrms.modules.bijli.hiring.models.BijliStaff;
import com.hrms.modules.bijli.payroll.modles.BijliStaffSalaryDetails;
import com.hrms.modules.bijli.payroll.modles.BijliStaffTargetDetails;
import com.hrms.modules.dtos.SalaryReportDTO;
import com.hrms.modules.dtos.TargetSalaryDetailsDTO;
import com.hrms.modules.rmc.hiring.models.RmcDesignations;
import com.hrms.modules.rmc.hiring.models.RmcSalaryStructure;
import com.hrms.modules.rmc.hiring.models.RmcStaff;
import com.hrms.modules.rmc.hiring.repository.RmcDesignationsRepo;
import com.hrms.modules.rmc.hiring.repository.RmcSalaryStructureRepo;
import com.hrms.modules.rmc.hiring.repository.RmcStaffRepo;
import com.hrms.modules.rmc.payroll.modles.RmcStaffSalaryDetails;
import com.hrms.modules.rmc.payroll.modles.RmcStaffTargetDetails;
import com.hrms.modules.rmc.payroll.repository.RmcAttendanceDeatilsRepository;
import com.hrms.modules.rmc.payroll.repository.RmcStaffSalaryDetailsRepository;
import com.hrms.modules.rmc.payroll.repository.RmcStaffTargetDetailsRepository;
import com.hrms.modules.rmc.payroll.service.RmcSalaryEarnedService;
import com.hrms.modules.suda.payroll.modles.SudaStaffSalaryDetails;
import com.hrms.modules.utilsServics.Result;
import com.hrms.modules.utilsServics.Status;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.Month;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
public class RmcStaffSalaryServicesForRMC {

    @Autowired
    private RmcStaffSalaryDetailsRepository salaryRepo;
    @Autowired
    private RmcAttendanceDeatilsRepository detailsRepo;
    @Autowired
    private RmcSalaryStructureRepo salaryStructureRepo;
    @Autowired
    RmcSalaryEarnedService salaryEarned;

    @Autowired
    RmcStaffTargetDetailsRepository targetRepo;

    @Autowired
    RmcStaffRepo staffRepo;
    @Autowired
    private RmcDesignationsRepo desigRepo;

    public String generateSalaryForTargetBased(Long StaffId, int year, String month,BigDecimal target,Long salaryStructureId) {
        System.out.println("MAKING SALARY DETAILS PLEASE WAIT");
        Integer yearof = year;
//        AttendanceDeatils details = detailsRepo.findByDetails(StaffId, month, yearof.toString());
        RmcSalaryStructure structure = salaryStructureRepo.findById(salaryStructureId).get();
        RmcStaff foundStaff = staffRepo.findById(StaffId).get();
        RmcDesignations designations = desigRepo.findById(foundStaff.getDesigId()).get();
        if (structure == null) {
            return Result.NOT_FOUND.toString() + " Salary Structure Not Found Of Staff " + foundStaff.getTempEmp();
        }

        // Getting number of days in the month
        int numberOfDayInThatMonth = getDaysInMonth(month, year);

        BigDecimal achivedGross =new BigDecimal(0.00);
        if(designations.getDesigName().equals("TAX COLLECTOR")){
            System.out.println("Looking for data of  emp ===> "+foundStaff.getTempEmp()+"  "+foundStaff.getDateOfJoining());
            if(!hasCompleted3Months(foundStaff.getDateOfJoining())){
                achivedGross=structure.getGross();
            }else {
                achivedGross=rmcTcGrossCriteria(target,structure.getGross());
            }
        } else if (designations.getDesigName().equals("ASSISTANT TEAM LEADER")) {
            achivedGross=rmcATLGrossCriteria(target,structure.getGross());
        } else if (designations.getDesigName().equals("TEAM LEADER")) {
            achivedGross=rmcTLGrossCriteria(target,structure.getGross());
        } else if (designations.getDesigName().equals("SUPERVISOR")) {
            achivedGross=rmcSupervisorGrossCriteria(target,structure.getGross());
        }

        System.out.println("ACHIVED GROSS OF EMP ====> "+structure.getEmpNo()+" Structure Gross = "+structure.getGross()+" Target Of Month = "+ target+" Achived ==>"+achivedGross);
        // Calculating one day salary
        BigDecimal oneDay = calculateDailyAmount(achivedGross, numberOfDayInThatMonth);

        // Calculating gross salary by no of days present and adding half day salary
        // Calculate tempGross


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

        // Calculating net pay
        BigDecimal netpay = grossSalary.subtract(deduction).setScale(2, RoundingMode.HALF_UP);

        String yearName = Integer.toString(year);
        RmcStaffSalaryDetails foundSalary = salaryRepo.findBydetails(StaffId, month, yearName);

        if (foundSalary != null && foundSalary.getDeduction() != null && foundSalary.getDeduction().compareTo(BigDecimal.ZERO) > 0) {
            netpay = netpay.subtract(foundSalary.getDeduction());
        }

        if (foundSalary == null) {
            // Saving the calculated salary
            RmcStaffSalaryDetails salary = new RmcStaffSalaryDetails();
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
            Timestamp currentTimestamp = new Timestamp(System.currentTimeMillis());
            salary.setStamp(currentTimestamp);
            RmcStaffSalaryDetails saved = salaryRepo.save(salary);
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
            RmcStaffSalaryDetails saved = salaryRepo.save(foundSalary);
            return saved != null ? Result.SUCCESS.toString() : Result.WENT_WRONG.toString();
        }
    }

    public String generateSalaryForFixedBased(Long StaffId, int year, String month,BigDecimal target,Long salaryStructureId) {
        System.out.println("MAKING SALARY DETAILS PLEASE WAIT");
        Integer yearof = year;
//        AttendanceDeatils details = detailsRepo.findByDetails(StaffId, month, yearof.toString());
        RmcSalaryStructure structure = salaryStructureRepo.findById(salaryStructureId).get();
        RmcStaff foundStaff = staffRepo.findById(StaffId).get();
        RmcDesignations designations = desigRepo.findById(foundStaff.getDesigId()).get();
        if (structure == null) {
            return Result.NOT_FOUND.toString() + " Salary Structure Not Found Of Staff " + foundStaff.getTempEmp();
        }

        // Getting number of days in the month
        int numberOfDayInThatMonth = getDaysInMonth(month, year);

        BigDecimal achivedGross =target;

        System.out.println("ACHIVED GROSS OF EMP ====> "+structure.getEmpNo()+" Structure Gross = "+structure.getGross()+" Target Of Month = "+ target+" Achived ==>"+achivedGross);
        // Calculating one day salary
        BigDecimal oneDay = calculateDailyAmount(achivedGross, numberOfDayInThatMonth);

        // Calculating gross salary by no of days present and adding half day salary
        // Calculate tempGross


        // Calculate the final sum and apply scale
        BigDecimal grossSalary = achivedGross.setScale(0, RoundingMode.DOWN);
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
        RmcStaffSalaryDetails foundSalary = salaryRepo.findBydetails(StaffId, month, yearName);
        if(foundSalary!=null||foundSalary.getDeduction().compareTo(BigDecimal.ZERO)>0){
            netpay.subtract(foundSalary.getDeduction());
        }
        if (foundSalary == null) {
            // Saving the calculated salary
            RmcStaffSalaryDetails salary = new RmcStaffSalaryDetails();
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
            salary.setIsTargetBased(Status.FIXED);
            salary.setOnHold(Status.FALSE);
            salary.setIsTargetBased(salary.getIsTargetBased());
            Timestamp currentTimestamp = new Timestamp(System.currentTimeMillis());
            salary.setStamp(currentTimestamp);
            RmcStaffSalaryDetails saved = salaryRepo.save(salary);
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
            RmcStaffSalaryDetails saved = salaryRepo.save(foundSalary);
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
    public BigDecimal rmcTcGrossCriteria(BigDecimal target,BigDecimal structureGross){
        BigDecimal gross = new BigDecimal(0.00);
        if(target.compareTo(new BigDecimal(60))<=0){
            gross= new BigDecimal(8000);
        }
        if (target.compareTo(new BigDecimal(60))>=0 && target.compareTo(new BigDecimal(70))<=0){
            gross=new BigDecimal(9000);
        }
        if (target.compareTo(new BigDecimal(70))>=0 && target.compareTo(new BigDecimal(80))<=0){
            gross=  new BigDecimal(10000);
        }
        if (target.compareTo(new BigDecimal(80))>=0 && target.compareTo(new BigDecimal(90))<=0){
            gross=  new BigDecimal(11000);
        }
        if (target.compareTo(new BigDecimal(90))>=0 && target.compareTo(new BigDecimal(100))<=0){
            gross=  new BigDecimal(12000);
        }
        if (target.compareTo(new BigDecimal(100))>=0 ){
            gross=  new BigDecimal(5000).add(structureGross);
        }
        return  gross;
    }


    public BigDecimal rmcATLGrossCriteria(BigDecimal target,BigDecimal structureGross){
        BigDecimal gross = new BigDecimal(0.00);
        if(target.compareTo(new BigDecimal(60))<=0){
            gross= new BigDecimal(9000);
        }
        if (target.compareTo(new BigDecimal(60))>=0 && target.compareTo(new BigDecimal(70))<=0){
            gross=new BigDecimal(12000);
        }
        if (target.compareTo(new BigDecimal(70))>=0 && target.compareTo(new BigDecimal(80))<=0){
            gross=  new BigDecimal(14000);
        }
        if (target.compareTo(new BigDecimal(80))>=0 && target.compareTo(new BigDecimal(90))<=0){
            gross=  new BigDecimal(16000);
        }
        if (target.compareTo(new BigDecimal(90))>=0 && target.compareTo(new BigDecimal(100))<=0){
            gross=  new BigDecimal(18000);
        }
        if (target.compareTo(new BigDecimal(100))>=0 ){
            gross=  new BigDecimal(5000).add(structureGross);
        }
        return  gross;
    }

    public BigDecimal rmcTLGrossCriteria(BigDecimal target,BigDecimal structureGross){
        BigDecimal gross = new BigDecimal(0.00);
        if(target.compareTo(new BigDecimal(60))<=0){
            gross= new BigDecimal(12000);
        }
        if (target.compareTo(new BigDecimal(60))>=0 && target.compareTo(new BigDecimal(70))<=0){
            gross=new BigDecimal(16000);
        }
        if (target.compareTo(new BigDecimal(70))>=0 && target.compareTo(new BigDecimal(80))<=0){
            gross=  new BigDecimal(18000);
        }
        if (target.compareTo(new BigDecimal(80))>=0 && target.compareTo(new BigDecimal(90))<=0){
            gross=  new BigDecimal(20000);
        }
        if (target.compareTo(new BigDecimal(90))>=0 && target.compareTo(new BigDecimal(100))<=0){
            gross=  new BigDecimal(24000);
        }
        if (target.compareTo(new BigDecimal(100))>=0 ){
            gross=  new BigDecimal(5000).add(structureGross);
        }
        return  gross;
    }

    public BigDecimal rmcSupervisorGrossCriteria(BigDecimal target,BigDecimal structureGross){
        BigDecimal gross = new BigDecimal(0.00);
        if(target.compareTo(new BigDecimal(60))<=0){
            gross= new BigDecimal(8000);
        }
        if (target.compareTo(new BigDecimal(60))>=0 && target.compareTo(new BigDecimal(70))<=0){
            gross=new BigDecimal(9000);
        }
        if (target.compareTo(new BigDecimal(70))>=0 && target.compareTo(new BigDecimal(80))<=0){
            gross=  new BigDecimal(10000);
        }
        if (target.compareTo(new BigDecimal(80))>=0 && target.compareTo(new BigDecimal(90))<=0){
            gross=  new BigDecimal(11000);
        }
        if (target.compareTo(new BigDecimal(90))>=0 && target.compareTo(new BigDecimal(100))<=0){
            gross=  new BigDecimal(12000);
        }
        if (target.compareTo(new BigDecimal(100))>=0 ){
            gross=  new BigDecimal(5000).add(structureGross);
        }
        return  gross;
    }

    public static boolean hasCompleted3Months(String joiningDateStr) {
        // Define the date format (adjust if needed)
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        // Parse the joining date string to LocalDate
        LocalDate joiningDate = LocalDate.parse(joiningDateStr, formatter);

        // Get the current date
        LocalDate currentDate = LocalDate.now();

        // Add 3 months to the joining date
        LocalDate threeMonthsLater = joiningDate.plusMonths(3);

        // Check if the current date is equal or after 3 months later
        return currentDate.isAfter(threeMonthsLater) || currentDate.isEqual(threeMonthsLater);
    }

    public List<TargetSalaryDetailsDTO> mapSalaryClassField(List<RmcStaffSalaryDetails> data){
        List<TargetSalaryDetailsDTO> result = new ArrayList<>();
        for (RmcStaffSalaryDetails found:data){
            TargetSalaryDetailsDTO set =  new TargetSalaryDetailsDTO();
            set.setSsdId(found.getSsdId()==null?00l:found.getSsdId());
            set.setStaffId(found.getStaffId()==null?00l:found.getStaffId());
            set.setEmpNo(found.getEmpNo()==null?"N/A":found.getEmpNo());
            set.setStaffName(found.getStaffName()==null?"N/A":found.getStaffName());
            set.setBasic(found.getBasic()==null?BigDecimal.ZERO:found.getBasic());
            set.setHra(found.getHra()==null?BigDecimal.ZERO:found.getHra());
            set.setConv_or_Other(found.getConv_or_Other()==null?BigDecimal.ZERO:found.getConv_or_Other());
            set.setGross(found.getGross()==null?BigDecimal.ZERO:found.getGross());
            set.setEmpPF(found.getEmpPF()==null?BigDecimal.ZERO:found.getEmpPF());
            set.setEmpESI(found.getEmpESI()==null?BigDecimal.ZERO:found.getEmpESI());
            set.setAdvance(found.getAdvance()==null?BigDecimal.ZERO:found.getAdvance());
            set.setDa(found.getDa()==null?BigDecimal.ZERO:found.getDa());
            set.setAdvanceRemark(found.getAdvanceRemark()==null?"N/A":found.getAdvanceRemark());
            set.setTds(found.getTds()==null?BigDecimal.ZERO:found.getTds());
            set.setOther(found.getOther()==null?BigDecimal.ZERO:found.getOther());
            set.setOtherRemark(found.getOtherRemark()==null?"N/A":found.getOtherRemark());
            set.setDedOfEmpShare(found.getDedOfEmpShare()==null?BigDecimal.ZERO:found.getDedOfEmpShare());
            set.setAdditional(found.getAdditional()==null?BigDecimal.ZERO:found.getAdditional());
            set.setSetteled_Adv_Amt(found.getSetteled_Adv_Amt()==null?BigDecimal.ZERO:found.getSetteled_Adv_Amt());
            set.setAdditionalRemark(found.getAdditionalRemark()==null?"N/A":found.getAdditionalRemark());
            set.setNetPaid(found.getNetPaid()==null?BigDecimal.ZERO:found.getNetPaid());
            set.setTotalNoDay(found.getTotalNoDay());
            set.setNoOfDayPresent(found.getNoOfDayPresent());
            set.setNoOfDayAbsent(found.getNoOfDayAbsent());
            set.setNoOfHalfDay(found.getNoOfHalfDay());
            set.setMonth(found.getMonth());
            set.setYear(found.getYear());
            set.setStatus(found.getStatus());
            RmcStaffTargetDetails details = targetRepo.findByDetails(found.getMonth(),found.getYear(),found.getEmpNo());
            set.setTarget(details.getTarget()==null||details==null?BigDecimal.ZERO:details.getTarget());
            set.setExtraTarget(details.getExtraAchived()==null||details==null?BigDecimal.ZERO:details.getExtraAchived());
            result.add(set);
        }
        return result;
    }


}
