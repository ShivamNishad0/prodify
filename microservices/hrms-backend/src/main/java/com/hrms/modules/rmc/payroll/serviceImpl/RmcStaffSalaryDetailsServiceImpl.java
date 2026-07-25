package com.hrms.modules.rmc.payroll.serviceImpl;

import com.hrms.modules.bijli.payroll.modles.BijliStaffSalaryDetails;
import com.hrms.modules.dtos.*;
import com.hrms.modules.rmc.hiring.models.RmcRemovedStaffs;
import com.hrms.modules.rmc.hiring.models.RmcSalaryStructure;
import com.hrms.modules.rmc.hiring.models.RmcStaff;
import com.hrms.modules.rmc.hiring.repository.RmcRemovedStaffsRepo;
import com.hrms.modules.rmc.hiring.repository.RmcSalaryStructureRepo;
import com.hrms.modules.rmc.hiring.repository.RmcStaffRepo;
import com.hrms.modules.rmc.payroll.modles.RmcAttendanceDeatils;
import com.hrms.modules.rmc.payroll.modles.RmcStaffSalaryDetails;
import com.hrms.modules.rmc.payroll.modles.RmcStaffTargetDetails;
import com.hrms.modules.rmc.payroll.repository.*;
import com.hrms.modules.rmc.payroll.service.RmcSalaryEarnedService;
import com.hrms.modules.rmc.payroll.service.RmcStaffSalaryDetailsService;
import com.hrms.modules.suda.payroll.modles.SudaStaffSalaryDetails;
import com.hrms.modules.utilsServics.Result;
import com.hrms.modules.utilsServics.Status;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.sql.Timestamp;
import java.time.Month;
import java.time.YearMonth;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class RmcStaffSalaryDetailsServiceImpl implements RmcStaffSalaryDetailsService {

    @Autowired
    private RmcStaffSalaryDetailsRepository salaryRepo;
    @Autowired
    private RmcAttendanceDeatilsRepository detailsRepo;
    @Autowired
    private RmcSalaryStructureRepo salaryStructureRepo;
    @Autowired
    private RmcStaffSalaryServicesForRMC salarySerive;
    @Autowired
    RmcSalaryEarnedService salaryEarned;
    @Autowired
    private RmcSalaryEarnedRepository salaryEarnedRepo;
    @Autowired
    private RmcStaffAttendanceRepository attendanceRepo;
    @Autowired
    RmcStaffRepo staffRepo;
    @Autowired
    private RmcRemovedStaffsRepo removeStaffRepo;
    @Autowired
    private EntityManager entityManager;
    @Autowired
    private RmcStaffTargetDetailsRepository targetRepo;

    @Override
    public String generateSalary(Long StaffId, int year, String month) {
        System.out.println("MAKING SALARY DETAILS PLEASE WAIT");
        Integer yearof = year;
        RmcAttendanceDeatils details = detailsRepo.findByDetails(StaffId, month, yearof.toString());
        RmcSalaryStructure structure = salaryStructureRepo.findById(details.getSalaryId()).get();
        RmcStaff foundStaff = staffRepo.findById(StaffId).get();

        if (structure == null) {
            return Result.NOT_FOUND.toString() + " Salary Structure Not Found Of Staff " + foundStaff.getTempEmp();
        }

//    if (structure.getIsTargetBased().equals(Status.TRUE)){
//        return  salarySerive.generateSalaryForTargetBased(StaffId, year, month,structure.getTarget());
//    }

        // Getting number of days in the month
        int numberOfDayInThatMonth = getDaysInMonth(details.getMonth(), year);

        // Calculating one day salary
        BigDecimal oneDay = calculateDailyAmount(structure.getGross(), numberOfDayInThatMonth);

        // Calculating half day salary
        BigDecimal halfDay = oneDay.multiply(new BigDecimal(Integer.parseInt(details.getNoOfDayHalfPresent())))
                .divide(new BigDecimal("2"), RoundingMode.HALF_UP);

        // Calculating Week off salary
        BigDecimal wo = oneDay.multiply(new BigDecimal(Integer.parseInt(details.getNoOfWO())));

        // Calculating holiday salary
        BigDecimal holiday = oneDay.multiply(new BigDecimal(Integer.parseInt(details.getNoOfHoliday())));

        // Calculating gross salary by no of days present and adding half day salary
        // Calculate tempGross
        BigDecimal tempGross = oneDay.multiply(new BigDecimal(details.getNoOfDayPresent()));

        // Calculate halfDaywoholiday
        BigDecimal halfDaywoholiday = halfDay.add(wo).add(holiday);

        // Calculate the final sum and apply scale
        BigDecimal grossSalary = tempGross.add(halfDaywoholiday).setScale(2, RoundingMode.DOWN);
        grossSalary = grossSalary.setScale(0, RoundingMode.DOWN);
        // Calculating basic salary by taking 40% of gross
        BigDecimal scale = structure.getScale() != null ? structure.getScale() : new BigDecimal(0.42);
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
        System.out.println("EMP NO ===> " + structure.getEmpNo() + " SCALE ==> " + scale + " GROSS ==> " + grossSalary + " BASIC ==> " + basic + " HRA==> " + hra + " PF==> " + pf + " ESI ==> " + esi);
        // Calculating deduction part of salary
        BigDecimal deduction = pf.add(esi).setScale(2, RoundingMode.HALF_UP);

        // Calculating net pay
        BigDecimal netpay = grossSalary.subtract(deduction).setScale(2, RoundingMode.HALF_UP);

        String yearName = Integer.toString(year);
        RmcStaffSalaryDetails foundSalary = salaryRepo.findBydetails(StaffId, month, yearName);
        if (foundSalary == null) {
            // Saving the calculated salary
            RmcStaffSalaryDetails salary = new RmcStaffSalaryDetails();
            salary.setStaffId(StaffId);
            salary.setEmpNo(details.getEmpNo());
            salary.setYear(yearName);
            salary.setStaffName(foundStaff.getName());
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
            salary.setNoOfDayPresent(Integer.parseInt(details.getNoOfDayPresent()));
            salary.setNoOfDayAbsent(Integer.parseInt(details.getNoOfDayAbsent()));
            salary.setNoOfHalfDay(Integer.parseInt(details.getNoOfDayHalfPresent()));
            salary.setDedOfEmpShare(deduction);
            salary.setStatus(Status.UNVERIFIED);
            salary.setOnHold(Status.FALSE);
            Timestamp currentTimestamp = new Timestamp(System.currentTimeMillis());
            salary.setStamp(currentTimestamp);
            salary.setIsTargetBased(structure.getTargetBased());
            RmcStaffSalaryDetails saved = salaryRepo.save(salary);
            return saved != null ? Result.SUCCESS.toString() : Result.WENT_WRONG.toString();
        } else {
            BigDecimal previousDeduction = foundSalary.getDeduction() == null ? BigDecimal.ZERO : foundSalary.getDeduction();
            netpay.subtract(previousDeduction);
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
            foundSalary.setNoOfDayPresent(Integer.parseInt(details.getNoOfDayPresent()));
            foundSalary.setNoOfDayAbsent(Integer.parseInt(details.getNoOfDayAbsent()));
            foundSalary.setNoOfHalfDay(Integer.parseInt(details.getNoOfDayHalfPresent()));
            RmcStaffSalaryDetails saved = salaryRepo.save(foundSalary);
            return saved != null ? Result.SUCCESS.toString() : Result.WENT_WRONG.toString();
        }
    }

    @Override
    public String editSalaryDetails(Long sslId, SalaryDetails_EDIT_DTO details, Long editedBy) {
        RmcStaffSalaryDetails found = salaryRepo.findById(sslId).get();
        found.setEmpPF(details.getEmpPF());
        found.setEmpESI(details.getEmpESI());
        found.setAdvance(details.getAdvance());
        found.setAdvanceRemark(details.getAdvanceRemark());
        found.setTds(details.getTds());
        found.setOther(details.getOther());
        found.setOtherRemark(details.getOtherRemark());
        found.setDedOfEmpShare(details.getDedOfEmpShare());
        found.setAdditional(details.getAdditional());
        found.setAdditionalRemark(details.getAdditionalRemark());
        found.setNetPaid(details.getNetPaid());
        found.setEditedBy(editedBy);
        found.setStatus(Status.UNVERIFIED);
        RmcStaffSalaryDetails saved = salaryRepo.save(found);
        return saved != null ? Result.SUCCESS.toString() : Result.WENT_WRONG.toString();

    }

    @Override
    public RmcStaffSalaryDetails findSalaryDetails(Long StaffId, String month, String year) {
        RmcStaffSalaryDetails foundSalary = salaryRepo.findBydetails(StaffId, month, year);
        return foundSalary != null ? foundSalary : null;
    }

    @Override
    public String verifySalary(List<Long> salaryDetId, Long userId) {
        for (Long salaryDetailId : salaryDetId) {
            RmcStaffSalaryDetails foundSalary = salaryRepo.findById(salaryDetailId).get();
            foundSalary.setVerifiedBy(userId);
            foundSalary.setStatus(Status.VERIFIED);
            RmcStaffSalaryDetails savedSalary = salaryRepo.save(foundSalary);
            if (savedSalary != null) {
                salaryEarned.finalStaffSalary(savedSalary);
            }
        }
        return Result.SUCCESS.toString();
    }

    @Override
    public CountAndSalaryDetailsByZone allSalariesList(Long zoneId, String month, String year, String type, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<RmcStaffSalaryDetails> dataPage = salaryRepo.findAllData(month, year, type, pageable);

        CountAndSalaryDetailsByZone result = new CountAndSalaryDetailsByZone();
        result.setResults(dataPage.getContent());
        result.setCount(salaryRepo.foundData(month, year, type));

        return result;
    }

    @Override
    public CountAndSalaryDetailsByZone allSalariesListForTargetBased(Long zoneId, String month, String year, String status, String[] area_id, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);

        // Convert String[] area_id to Long[] if provided
        Long[] areaIds = (area_id != null && area_id.length > 0)
                ? Arrays.stream(area_id).map(Long::parseLong).toArray(Long[]::new)
                : new Long[]{0L}; // Default to an array with one element 0L when no area_id is provided

        boolean hasSpecificAreaIds = areaIds.length > 0 && !Arrays.asList(areaIds).contains(0L);
        Page<RmcStaffSalaryDetails> dataPage;

        // Query based on the area_ids
        if (hasSpecificAreaIds) {
            dataPage = salaryRepo.findAllDataForTarget(month, year, status, areaIds, pageable); // Pass the Long[] array
        } else {
            dataPage = salaryRepo.findAllDataForTarget(month, year, status, pageable); // No area_id filtering
        }

        // Mapping and result preparation
        CountAndSalaryDetailsByZone result = new CountAndSalaryDetailsByZone();
        result.setResults(mapSalaryReportDetails(dataPage.getContent()));
        result.setCount(salaryRepo.foundDataOfTargetBased(month, year, status));

        return result;
    }



    @Override
    public CountAndSalaryDetailsByZone findByStaffEmpNo(String tempEmp, String month, String year,String type) {
        String is_target_based="";
        if(type.equals("SLR")){
            is_target_based="FALSE";
        }else {
            is_target_based="TRUE";
        }
        List<RmcStaffSalaryDetails> staffSalaryDetails = salaryRepo.findStaffByTempEmpOrContactNo(tempEmp, month, year,is_target_based);
        Long count = salaryRepo.countStaffByTempEmp(tempEmp);
        CountAndSalaryDetailsByZone staffDTO = new CountAndSalaryDetailsByZone();
        staffDTO.setCount(count);
        staffDTO.setResults(mapSalaryReportDetails(staffSalaryDetails));
        return staffDTO;
    }

    @Override
    public StaffAdvanceInfoDTO findAdvDetailsOfEmp(String empNo) {
        // Fetch the list of StaffSalaryDetails based on empNo and zoneId
        List<RmcStaffSalaryDetails> staffSalaryDetails = salaryRepo.advDetailsOfEmp(empNo);

        // Initialize a DTO to hold advance information for the employee
        StaffAdvanceInfoDTO staffAdvanceInfoDTO = new StaffAdvanceInfoDTO();

        // Set the empNo directly from the parameter
        staffAdvanceInfoDTO.setEmpNo(empNo);

        // Assuming the first entry contains the required employee details
        if (!staffSalaryDetails.isEmpty()) {
            RmcStaffSalaryDetails staffSalary = staffSalaryDetails.get(0);

            // Set the staffId and empName from the first entry in the list
            staffAdvanceInfoDTO.setStaffId(staffSalary.getStaffId());

        }

        // Create a list to hold the advance data details for each month
        List<StaffAdvanceData> advInfoList = new ArrayList<>();

        // Initialize variables to track total advance amounts
        BigDecimal totalAdvance = BigDecimal.ZERO;
        BigDecimal totalSettledAdvance = BigDecimal.ZERO;
        BigDecimal totalBlanceAdvance = BigDecimal.ZERO;
        // Iterate through the staff salary details to populate the advance info
        for (RmcStaffSalaryDetails staffSalary : staffSalaryDetails) {
            BigDecimal setlAdvAmt = staffSalary.getSetteled_Adv_Amt() == null ? BigDecimal.ZERO : staffSalary.getSetteled_Adv_Amt();
            if (staffSalary.getAdvance().compareTo(BigDecimal.ZERO) > 0 || setlAdvAmt.compareTo(BigDecimal.ZERO) > 0) {
                // Extract data from the StaffSalaryDetails object
                String month = staffSalary.getMonth();
                BigDecimal advAmt = staffSalary.getAdvance() != null ? staffSalary.getAdvance() : BigDecimal.ZERO;
                BigDecimal settleAmt = staffSalary.getSetteled_Adv_Amt() != null ? staffSalary.getSetteled_Adv_Amt() : BigDecimal.ZERO;
                BigDecimal blanceAmt = advAmt.compareTo(BigDecimal.ZERO) > 0 ? advAmt.subtract(settleAmt) : BigDecimal.ZERO;

                // Create and populate a new StaffAdvanceData object
                StaffAdvanceData staffAdvanceData = new StaffAdvanceData();
                staffAdvanceData.setAdvForMonth(month);
                staffAdvanceData.setAdvAmt(advAmt);
                staffAdvanceData.setSetteldAmt(settleAmt);
                staffAdvanceData.setBlanceAmt(blanceAmt);

                // Add the StaffAdvanceData object to the list
                advInfoList.add(staffAdvanceData);

                // Accumulate the total advance amount
                totalAdvance = totalAdvance.add(advAmt);
                totalSettledAdvance = totalSettledAdvance.add(settleAmt);
                totalBlanceAdvance = totalBlanceAdvance.add(blanceAmt);
            }
        }

        // Set the total advance and advance info list in the DTO
        staffAdvanceInfoDTO.setTotalAdv(totalAdvance);
        staffAdvanceInfoDTO.setAdvInfo(advInfoList);
        staffAdvanceInfoDTO.setTotalSettledAdv(totalSettledAdvance);
        staffAdvanceInfoDTO.setTotalBlanceAdv(totalBlanceAdvance);
        // Return the populated StaffAdvanceInfoDTO
        return staffAdvanceInfoDTO;
    }

    @Override
    public Map<String, BigDecimal> otherAllowancesDetails(String emp_no, String month, String year) {
        RmcStaffSalaryDetails details = salaryRepo.findBydetails(emp_no, month, year);
        Map<String, BigDecimal> allowance = new HashMap<>();
        if (details != null) {
           allowance.put("other_exp", details.getOther() == null ? BigDecimal.ZERO : details.getOther());

        }
        if (details == null) {
            allowance.put("other_exp", BigDecimal.ZERO);
        }
        return allowance;
    }

    @Override
    public List<?> getAllSalaryByDetails(String month, Long zoneId, String year, String type) {
        List<?> details = mapSalaryReportDetails(salaryRepo.detailsByMonth(month, year, type));
        if (details != null) {
            return details;
        }
        return null;
    }

    @Override
    public String createAdvPaymentOfStaff(AdvancePaymentDTO data, String type) {
        RmcStaffSalaryDetails staffSalary = salaryRepo.findStaffBydetails(data.getEmpNo(), data.getMonth(), data.getYear());
        if (staffSalary != null) {
            if (type.equals("adv")) {
                staffSalary.setAdvance(new BigDecimal(data.getAmount()));
            }
            if (type.equals("setl")) {
                staffSalary.setSetteled_Adv_Amt(new BigDecimal(data.getAmount()));
            }
            if (type.equals("other_exp")) {
                staffSalary.setOther(new BigDecimal(data.getAmount()));
            }

            if (type.equals("prev_setl")) {
                staffSalary.setPrevSetldAmt(new BigDecimal(data.getAmount()));
                staffSalary.setPrevSetldRmk(data.getRemark() == null ? "N/A" : data.getRemark());
            }
            salaryRepo.save(staffSalary);
            return Result.SUCCESS.toString();
        }
        return Result.WENT_WRONG.toString();
    }

    @Override
    public String createDeduction(DeductionReqDTO data) {
        RmcStaffSalaryDetails staffSalary = salaryRepo.findStaffBydetails(data.getEmpNo(), data.getMonth(), data.getYear());
        BigDecimal netPay = BigDecimal.ZERO;
        BigDecimal earnedGross = staffSalary.getGross().subtract(staffSalary.getDedOfEmpShare());
        netPay = earnedGross.subtract(new BigDecimal(data.getAmount()));
        staffSalary.setNetPaid(netPay);
        staffSalary.setDeduction(new BigDecimal(data.getAmount()));
        staffSalary.setDeductionRemark(data.getRemark());
        salaryRepo.save(staffSalary);
        return Result.SUCCESS.toString();
    }

    @Override
    public List<RmcStaffSalaryDetails> getAnualResultOfEmp(String empNo, Long zoneId, String year) {
        List<RmcStaffSalaryDetails> foundData = salaryRepo.detailsAnnually(empNo, year);
        if (foundData == null || foundData.isEmpty()) {
            return new ArrayList<>(); // Return an empty list instead of null
        }
        return foundData;
    }

    @Override
    public StaffDeductionsInfoDTO staffDeductionDetails(String empNo, String year) {
        List<RmcStaffSalaryDetails> staffSalaryDetails = salaryRepo.advDetailsOfEmpByYear(empNo, year);
        List<Map<String, BigDecimal>> deductions = new ArrayList<>();
        StaffDeductionsInfoDTO obj = new StaffDeductionsInfoDTO();
        BigDecimal totalDeduction = BigDecimal.ZERO;

        for (RmcStaffSalaryDetails details : staffSalaryDetails) {
            Map<String, BigDecimal> deductionDetails = new HashMap<>();

            // Accumulate total deduction
            totalDeduction = totalDeduction.add(details.getDeduction());

            // Set empNo, staffId, and year in DTO
            obj.setEmpNo(details.getEmpNo());
            obj.setStaffId(details.getStaffId());
            obj.setYear(details.getYear());

            // Store deduction by month
            deductionDetails.put(details.getMonth(), details.getDeduction());
            deductions.add(deductionDetails);
        }

        // Set the deductions list and total deduction in DTO
        obj.setDeductions(deductions);
        obj.setTotalDeduction(totalDeduction);

        return obj;
    }

    @Override
    public CountAndSalaryDetailsByZone getDataAsPerMonthAndYear(String type, String month, String year, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<RmcStaffSalaryDetails> data;
        CountAndSalaryDetailsByZone result = new CountAndSalaryDetailsByZone();
        Long count = 0l;
        if (type.equals("adv")) {
            data = salaryRepo.findStaffByAdvance(month, year, pageable);
            count = salaryRepo.foundCountOfAdv(month, year);
        } else {
            data = salaryRepo.findStaffByDeduction(month, year, pageable);
            count = salaryRepo.foundCountOfDeduction(month, year);
        }
        result.setResults(data.getContent());
        result.setCount(count);
        return result;
    }

    @Override
    public SumOfDistributionDTO findTotalMoneyDistribution(String month, String year, String type) {
        if (month == null || year == null || type == null) {
            return null;
        }
        List<RmcStaffSalaryDetails> found = salaryRepo.allDetailsForMonth(month, year);
        List<RmcStaffSalaryDetails> filterData = filterResult(found, type);
        // Initialize total fields to zero
        BigDecimal totalBasic = BigDecimal.ZERO;
        BigDecimal totalHra = BigDecimal.ZERO;
        BigDecimal totalConvOther = BigDecimal.ZERO;
        BigDecimal totalGross = BigDecimal.ZERO;
        BigDecimal totalEmpPf = BigDecimal.ZERO;
        BigDecimal totalEmpEsi = BigDecimal.ZERO;
        BigDecimal totalAdvance = BigDecimal.ZERO;
        BigDecimal totalDa = BigDecimal.ZERO;
        BigDecimal totalTds = BigDecimal.ZERO;
        BigDecimal totalOthers = BigDecimal.ZERO;
        BigDecimal totalDedOfEmp = BigDecimal.ZERO;
        BigDecimal totalAdditional = BigDecimal.ZERO;
        BigDecimal totalSetteled = BigDecimal.ZERO;
        BigDecimal totalDeduction = BigDecimal.ZERO;
        BigDecimal prevSetlAmt = BigDecimal.ZERO;
        BigDecimal totalNetPaid = BigDecimal.ZERO;
        // Calculate totals
        for (RmcStaffSalaryDetails details : filterData) {
            totalBasic = totalBasic.add(details.getBasic() != null ? details.getBasic() : BigDecimal.ZERO);
            totalHra = totalHra.add(details.getHra() != null ? details.getHra() : BigDecimal.ZERO);
            totalConvOther = totalConvOther.add(details.getConv_or_Other() != null ? details.getConv_or_Other() : BigDecimal.ZERO);
            totalGross = totalGross.add(details.getGross() != null ? details.getGross() : BigDecimal.ZERO);
            totalEmpPf = totalEmpPf.add(details.getEmpPF() != null ? details.getEmpPF() : BigDecimal.ZERO);
            totalEmpEsi = totalEmpEsi.add(details.getEmpESI() != null ? details.getEmpESI() : BigDecimal.ZERO);
            totalAdvance = totalAdvance.add(details.getAdvance() != null ? details.getAdvance() : BigDecimal.ZERO);
            totalDa = totalDa.add(details.getDa() != null ? details.getDa() : BigDecimal.ZERO);
            totalTds = totalTds.add(details.getTds() != null ? details.getTds() : BigDecimal.ZERO);
            totalOthers = totalOthers.add(details.getOther() != null ? details.getOther() : BigDecimal.ZERO);
            totalDedOfEmp = totalDedOfEmp.add(details.getDedOfEmpShare() != null ? details.getDedOfEmpShare() : BigDecimal.ZERO);
            totalAdditional = totalAdditional.add(details.getAdditional() != null ? details.getAdditional() : BigDecimal.ZERO);
            totalSetteled = totalSetteled.add(details.getSetteled_Adv_Amt() != null ? details.getSetteled_Adv_Amt() : BigDecimal.ZERO);
            totalDeduction = totalDeduction.add(details.getDeduction() != null ? details.getDeduction() : BigDecimal.ZERO);
            totalNetPaid = totalNetPaid.add(details.getNetPaid() != null ? details.getNetPaid() : BigDecimal.ZERO);
            prevSetlAmt = prevSetlAmt.add(details.getPrevSetldAmt() != null ? details.getPrevSetldAmt() : BigDecimal.ZERO);

        }
        SumOfDistributionDTO obj = new SumOfDistributionDTO();
        obj.setMonth(month);
        obj.setYear(year);
        obj.setZoneOf("RMC");
        obj.setTotalBasic(totalBasic);
        obj.setTotalHra(totalHra);
        obj.setTotalConvOther(totalConvOther);
        obj.setTotalGross(totalGross);
        obj.setTotalEmpPf(totalEmpPf);
        obj.setTotalEmpEsi(totalEmpEsi);
        obj.setTotalAdvance(totalAdvance);
        obj.setTotalDa(totalDa);
        obj.setTotalTds(totalTds);
        obj.setTotalOthers(totalOthers);
        obj.setTotalDedOfEmp(totalDedOfEmp);
        obj.setTotalAdditional(totalAdditional);
        obj.setTotalSetteled(totalSetteled);
        obj.setTotalDeduction(totalDeduction);
        obj.setPrevSetldAmt(prevSetlAmt);
        obj.setTotalNetPaid(totalNetPaid);
        return obj;
    }

    @Override
    public CountAndSalaryDetailsByZone allRemovedStaffSalary(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);

        List<RmcRemovedStaffs> staffs = removeStaffRepo.findAll();
        List<RmcStaffSalaryDetails> data = staffs.stream()
                .map(s -> salaryRepo.findStaffBydetails(s.getEmpNo(), s.getMonth(), s.getYear()))
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        // Apply pagination manually since data is fetched in bulk
        int start = Math.min((int) pageable.getOffset(), data.size());
        int end = Math.min((start + pageable.getPageSize()), data.size());
        List<RmcStaffSalaryDetails> paginatedData = data.subList(start, end);

        CountAndSalaryDetailsByZone result = new CountAndSalaryDetailsByZone();
        result.setCount((long) data.size());
        result.setResults(paginatedData);

        return result;
    }

    @Override
    public CountAndSalaryDetailsByZone removedStaffSalary(int page, int size, String empNo) {
        Pageable pageable = PageRequest.of(page, size);

        List<RmcRemovedStaffs> staffs = removeStaffRepo.removedStaffDetails(empNo);
        List<RmcStaffSalaryDetails> data = staffs.stream()
                .map(s -> salaryRepo.findStaffBydetails(s.getEmpNo(), s.getMonth(), s.getYear()))
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        // Apply pagination manually since data is fetched in bulk
        int start = Math.min((int) pageable.getOffset(), data.size());
        int end = Math.min((start + pageable.getPageSize()), data.size());
        List<RmcStaffSalaryDetails> paginatedData = data.subList(start, end);

        CountAndSalaryDetailsByZone result = new CountAndSalaryDetailsByZone();
        result.setCount((long) data.size());
        result.setResults(paginatedData);

        return result;
    }

    @Override
    public CountAndDetails getSumOf(String month, String year, String type, int pageNumber, int pageSize) {
        String columnName = type != null && !type.equals("ALL") ? getColumnName(type) : getColumnName("PF");
        CountAndDetails data = getDynamicColumnData(columnName, month, year, pageNumber, pageSize);
        return data;
    }

    @Override
    public CountAndDetails getSumOfIndividual(String empNo, String month, String year, String type, int pageNumber, int pageSize) {
        String columnName = type != null && !type.equals("ALL") ? getColumnName(type) : getColumnName("PF");
        CountAndDetails data = getDynamicColumnDataIndividual(empNo, columnName, month, year, pageNumber, pageSize);
        return data;
    }

    @Override
    public String salaryOnHold(String empNo,String month,String year,String type){
        RmcStaffSalaryDetails details = salaryRepo.findStaffBydetails(empNo,month,year);
        if (details!=null){
            if (type.equals("true")){
                details.setOnHold(Status.TRUE);
                salaryRepo.save(details);
                return Result.SALARY_UPDATED.toString();
            }
            if (type.equals("false")){
                details.setOnHold(Status.FALSE);
                salaryRepo.save(details);
                return Result.SALARY_UPDATED.toString();
            }
        }
        return Result.WENT_WRONG.name();
    }

    @Override
    public List<SalaryReportDTO> getAllSalaryByDetailsFixed(String month, Long zoneId, String year,String[]area_id,String req){

        Long[] areaIds = (area_id != null && area_id.length > 0)
                ? Arrays.stream(area_id).map(Long::parseLong).toArray(Long[]::new)
                : new Long[]{0L};
        List<SalaryReportDTO> details=new ArrayList<>();
        boolean isFixedRequest = "FIXED".equalsIgnoreCase(req);
        boolean hasSpecificAreaIds = areaIds.length > 0 && !Arrays.asList(areaIds).contains(0L);

        if (isFixedRequest && hasSpecificAreaIds){
            details=mapSalaryReportDetails(salaryRepo.findAllFixedData(month,year,areaIds));
        } else if (isFixedRequest && !hasSpecificAreaIds) {
            details=mapSalaryReportDetails(salaryRepo.findAllFixedData(month,year));
        }else {
            details=mapSalaryReportDetails(salaryRepo.findAllFixedData(month,year));
        }



        if(details!=null) {
            return details;
        }
        return null;
    }

    @Override
    public CountAndSalaryDetailsByZone allSalariesListForFixed(
            Long zoneId, String month, String year, String[] areaIds, int page, int size) {

        Pageable pageable = PageRequest.of(page, size);

        // Convert String[] to List<Long> and handle null/empty cases
        List<Long> areaIdList = (areaIds != null && areaIds.length > 0)
                ? Arrays.stream(areaIds).map(Long::parseLong).toList()
                : Collections.emptyList();

        // Fetch data using the repository
        Page<RmcStaffSalaryDetails> dataPage;
        if (!areaIdList.isEmpty()) {
            // If area IDs are provided, fetch data specific to those areas
            dataPage = salaryRepo.findAllDataForFixed(month, year, areaIdList, pageable);
        } else {
            // Fetch data without area ID filter
            dataPage = salaryRepo.findAllDataForFixed(month, year, pageable);
        }

        // Prepare the response
        CountAndSalaryDetailsByZone result = new CountAndSalaryDetailsByZone();
        result.setResults(mapSalaryReportDetails(dataPage.getContent()));
        result.setCount(dataPage.getTotalElements());

        return result;
    }

    @Transactional
    public String removeSalaryDetails(String month, String year, String empNo) {
        // Perform bulk deletions in a single transaction
        targetRepo.bulkDeleteByDetails(month, year, empNo);
        salaryRepo.bulkDeleteByDetails(month, year, empNo);
        salaryEarnedRepo.bulkDeleteByDetails(month, year, empNo);
        detailsRepo.bulkDeleteByDetails(month, year, empNo);
        attendanceRepo.bulkDeleteByDetails(month, year, empNo);

        return "Successfully removed salary details for empNo: " + empNo + ", month: " + month + ", year: " + year;
    }

    @Override
    public RmcStaffSalaryDetails findPrevAmt(String empNo, String month, String year) {
        return salaryRepo.findBydetails(empNo, month, year);
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
        BigDecimal oneDay = gross.divide(divisor, 2, RoundingMode.CEILING);
        return oneDay;
    }

    public List<RmcStaffSalaryDetails> filterResult(List<RmcStaffSalaryDetails> got, String type) {
        List<RmcStaffSalaryDetails> result = new ArrayList<>();

        for (RmcStaffSalaryDetails data : got) {
            RmcStaff staff = staffRepo.findStaffByTemp_emp(data.getEmpNo());
            if (type.equals("active") && staff.getActive().equals(Status.ACTIVE)) {
                result.add(data);
            } else if (type.equals("inactive") && staff.getActive().equals(Status.INACTIVE)) {
                result.add(data);
            }
        }

        return result;
    }

    @Override
    public CountAndDetails searchSalaryDetails(String searchTerm, String month, String year) {
        List<RmcStaffSalaryDetails> result = salaryRepo.methodForSearchIndivisual(searchTerm, month, year);
        CountAndDetails details = new CountAndDetails();
        details.setResults(result);
        details.setCount(result.size());
        return details;
    }

    public CountAndDetails getDynamicColumnData(String columnName, String month, String year, int pageNumber, int pageSize) {
        String query = "SELECT staff_name, emp_no, " + columnName +
                " FROM rmc.rmc_staff_salary_details " +
                " WHERE month = '" + month + "' AND CAST(year AS INTEGER) = " + year +
                " AND " + columnName + " > 0.00";

        Query nativeQuery = entityManager.createNativeQuery(query);
        CountAndDetails result = new CountAndDetails();
        result.setCount(nativeQuery.getResultList().size());
        // Apply pagination
        nativeQuery.setFirstResult((pageNumber - 1) * pageSize);
        nativeQuery.setMaxResults(pageSize);

        result.setResults(nativeQuery.getResultList());
        return result;
    }

    public CountAndDetails getDynamicColumnDataIndividual(String empNo, String columnName, String month, String year, int pageNumber, int pageSize) {
        // Construct the query using parameterized inputs
        String query = "SELECT staff_name, emp_no, " + columnName +
                " FROM rmc.rmc_staff_salary_details " +
                " WHERE emp_no LIKE :empNo AND month = :month AND CAST(year AS INTEGER) = :year" +
                " AND " + columnName + " > 0.00";

        // Create the native query
        Query nativeQuery = entityManager.createNativeQuery(query);
        CountAndDetails result = new CountAndDetails();
        result.setCount(nativeQuery.getResultList().size());
        // Set parameters for the query to avoid SQL injection risks
        nativeQuery.setParameter("emp_no", "%" + empNo + "%");
        nativeQuery.setParameter("month", month);
        nativeQuery.setParameter("year", Integer.parseInt(year));

        // Apply pagination
        nativeQuery.setFirstResult((pageNumber - 1) * pageSize); // Starting index (0-based)
        nativeQuery.setMaxResults(pageSize); // Limit the number of results

        // Fetch and return the result list
        result.setResults(nativeQuery.getResultList());
        return result;
    }

    public String getColumnName(String type) {
        switch (type) {
            case "PF" -> {
                return "emppf";
            }
            case "ADDITIONAL" -> {
                return "additional";
            }
            case "ADVANCE" -> {
                return "advance";
            }
            case "BASIC" -> {
                return "basic";
            }
            case "CONV_OTHER" -> {
                return "conv_or_other";
            }
            case "DA" -> {
                return "da";
            }
            case "ESI" -> {
                return "empesi";
            }
            case "GROSS" -> {
                return "gross";
            }
            case "HRA" -> {
                return "hra";
            }
            case "NET_PAID" -> {
                return "net_paid";
            }
            case "SETTL_AMT" -> {
                return "setteled_adv_amt";
            }
            case "TDS" -> {
                return "tds";
            }
            case "DEDUCTION" -> {
                return "deduction";
            }
            case "" -> {
                return "EMPTY_FIELD";
            }
            default -> {
                return "UNKNOWN_TYPE";
            }
        }
    }

    public List<TargetSalaryDetailsDTO> mapSalaryClassField(List<RmcStaffSalaryDetails> data) {
        List<TargetSalaryDetailsDTO> result = new ArrayList<>();
        for (RmcStaffSalaryDetails found : data) {
            TargetSalaryDetailsDTO set = new TargetSalaryDetailsDTO();
            set.setSsdId(found.getSsdId() == null ? 00l : found.getSsdId());
            set.setStaffId(found.getStaffId() == null ? 00l : found.getStaffId());
            set.setEmpNo(found.getEmpNo() == null ? "N/A" : found.getEmpNo());
            set.setStaffName(found.getStaffName() == null ? "N/A" : found.getStaffName());
            set.setBasic(found.getBasic() == null ? BigDecimal.ZERO : found.getBasic());
            set.setHra(found.getHra() == null ? BigDecimal.ZERO : found.getHra());
            set.setConv_or_Other(found.getConv_or_Other() == null ? BigDecimal.ZERO : found.getConv_or_Other());
            set.setGross(found.getGross() == null ? BigDecimal.ZERO : found.getGross());
            set.setEmpPF(found.getEmpPF() == null ? BigDecimal.ZERO : found.getEmpPF());
            set.setEmpESI(found.getEmpESI() == null ? BigDecimal.ZERO : found.getEmpESI());
            set.setAdvance(found.getAdvance() == null ? BigDecimal.ZERO : found.getAdvance());
            set.setDa(found.getDa() == null ? BigDecimal.ZERO : found.getDa());
            set.setAdvanceRemark(found.getAdvanceRemark() == null ? "N/A" : found.getAdvanceRemark());
            set.setTds(found.getTds() == null ? BigDecimal.ZERO : found.getTds());
            set.setOther(found.getOther() == null ? BigDecimal.ZERO : found.getOther());
            set.setOtherRemark(found.getOtherRemark() == null ? "N/A" : found.getOtherRemark());
            set.setDedOfEmpShare(found.getDedOfEmpShare() == null ? BigDecimal.ZERO : found.getDedOfEmpShare());
            set.setAdditional(found.getAdditional() == null ? BigDecimal.ZERO : found.getAdditional());
            set.setSetteled_Adv_Amt(found.getSetteled_Adv_Amt() == null ? BigDecimal.ZERO : found.getSetteled_Adv_Amt());
            set.setAdditionalRemark(found.getAdditionalRemark() == null ? "N/A" : found.getAdditionalRemark());
            set.setPrevSetldAmt(found.getPrevSetldAmt() == null ? BigDecimal.ZERO : found.getPrevSetldAmt());
            set.setPrevSetldRmk(found.getPrevSetldRmk() == null ? "N/A" : found.getPrevSetldRmk());
            set.setNetPaid(found.getNetPaid() == null ? BigDecimal.ZERO : found.getNetPaid());
            set.setTotalNoDay(found.getTotalNoDay());
            set.setOnHold(found.getOnHold().name());
            set.setNoOfDayPresent(found.getNoOfDayPresent());
            set.setNoOfDayAbsent(found.getNoOfDayAbsent());
            set.setNoOfHalfDay(found.getNoOfHalfDay());
            set.setMonth(found.getMonth());
            set.setYear(found.getYear());
            set.setStatus(found.getStatus());
            RmcStaffTargetDetails details = targetRepo.findByDetails(found.getMonth(), found.getYear(), found.getEmpNo());
            set.setTarget(details.getTarget() == null || details == null ? BigDecimal.ZERO : details.getTarget());
            set.setExtraTarget(details.getExtraAchived() == null || details == null ? BigDecimal.ZERO : details.getExtraAchived());
            result.add(set);
        }
        return result;
    }

    public List<SalaryReportDTO> mapSalaryReportDetails(List<RmcStaffSalaryDetails> data) {
        List<SalaryReportDTO> result = new ArrayList<>();
        for (RmcStaffSalaryDetails found : data) {
            SalaryReportDTO set = new SalaryReportDTO();
            set.setSsdId(found.getSsdId() == null ? 00l : found.getSsdId());
            set.setStaffId(found.getStaffId() == null ? 00l : found.getStaffId());
            set.setEmpNo(found.getEmpNo() == null ? "N/A" : found.getEmpNo());
            set.setStaffName(found.getStaffName() == null ? "N/A" : found.getStaffName());
            set.setBasic(found.getBasic() == null ? BigDecimal.ZERO : found.getBasic());
            set.setHra(found.getHra() == null ? BigDecimal.ZERO : found.getHra());
            set.setConv_or_Other(found.getConv_or_Other() == null ? BigDecimal.ZERO : found.getConv_or_Other());
            set.setGross(found.getGross() == null ? BigDecimal.ZERO : found.getGross());
            set.setEmpPF(found.getEmpPF() == null ? BigDecimal.ZERO : found.getEmpPF());
            set.setEmpESI(found.getEmpESI() == null ? BigDecimal.ZERO : found.getEmpESI());
            set.setAdvance(found.getAdvance() == null ? BigDecimal.ZERO : found.getAdvance());
            set.setDa(found.getDa() == null ? BigDecimal.ZERO : found.getDa());
            set.setAdvanceRemark(found.getAdvanceRemark() == null ? "N/A" : found.getAdvanceRemark());
            set.setTds(found.getTds() == null ? BigDecimal.ZERO : found.getTds());
            set.setOther(found.getOther() == null ? BigDecimal.ZERO : found.getOther());
            set.setOtherRemark(found.getOtherRemark() == null ? "N/A" : found.getOtherRemark());
            set.setDedOfEmpShare(found.getDedOfEmpShare() == null ? BigDecimal.ZERO : found.getDedOfEmpShare());
            set.setAdditional(found.getAdditional() == null ? BigDecimal.ZERO : found.getAdditional());
            set.setSetteled_Adv_Amt(found.getSetteled_Adv_Amt() == null ? BigDecimal.ZERO : found.getSetteled_Adv_Amt());
            set.setAdditionalRemark(found.getAdditionalRemark() == null ? "N/A" : found.getAdditionalRemark());
            set.setNetPaid(found.getNetPaid() == null ? BigDecimal.ZERO : found.getNetPaid());
            set.setPrevSetldAmt(found.getPrevSetldAmt() == null ? BigDecimal.ZERO : found.getPrevSetldAmt());
            set.setPrevSetldRmk(found.getPrevSetldRmk() == null ? "N/A" : found.getPrevSetldRmk());
            set.setDeduction(found.getDeduction()==null?BigDecimal.ZERO:found.getDeduction());
            set.setDeductionRemark(found.getDeductionRemark()==null?"N/A":found.getDeductionRemark());
            set.setTotalNoDay(found.getTotalNoDay());
            RmcAttendanceDeatils deatils=detailsRepo.findDetailsByDetails(found.getEmpNo(),found.getMonth(),found.getYear());
            if(deatils!=null){
                set.setNoOfDayPresent(Integer.parseInt(deatils.getNoOfDayPresent()==null?"0":deatils.getNoOfDayPresent()));
                set.setNoOfDayAbsent(Integer.parseInt(deatils.getNoOfDayAbsent()==null?"0":deatils.getNoOfDayAbsent()));
                set.setNoOfHalfDay(Integer.parseInt(deatils.getNoOfDayHalfPresent()==null?"0":deatils.getNoOfDayHalfPresent()));
                set.setNoOfWO(deatils.getNoOfWO());
                set.setNoOfHoliday(deatils.getNoOfHoliday()==null?"0":deatils.getNoOfHoliday());
                set.setNoOfPaidLeave(deatils.getNoOfPaidLeave());
            }else{
                set.setNoOfDayPresent(0);
                set.setNoOfDayAbsent(0);
                set.setNoOfHalfDay(0);
                set.setNoOfWO("0");
                set.setNoOfPaidLeave("0");
            }
            set.setOnHold(found.getOnHold().name());
            set.setStamp(found.getStamp());
            set.setMonth(found.getMonth());
            set.setYear(found.getYear());
            set.setStatus(found.getStatus());
            RmcStaffTargetDetails details = targetRepo.findByDetails(found.getMonth(), found.getYear(), found.getEmpNo());
            set.setTarget(details.getTarget() == null || details == null ? BigDecimal.ZERO : details.getTarget());
            set.setExtraTarget(details.getExtraAchived() == null || details == null ? BigDecimal.ZERO : details.getExtraAchived());
            RmcSalaryStructure bss = salaryStructureRepo.findByStaffId(found.getStaffId());
            set.setStrcBasic(bss.getBasic() == null || bss == null ? BigDecimal.ZERO : bss.getBasic());
            set.setStrcDa(bss.getDa() == null || bss == null ? BigDecimal.ZERO : bss.getDa());
            set.setStrcHRA(bss.getHra() == null ? BigDecimal.ZERO : bss.getHra());
            set.setStrcConv_oth(bss.getConv_oth() == null || bss == null ? BigDecimal.ZERO : bss.getConv_oth());
            set.setStrcGross(bss.getGross() == null || bss == null ? BigDecimal.ZERO : bss.getGross());
            set.setPfPercent(bss.getPfPercent() == null || bss == null ? BigDecimal.ZERO : bss.getPfPercent());
            set.setEsiPercent(bss.getEsiPercent() == null || bss == null ? BigDecimal.ZERO : bss.getEsiPercent());
            set.setPfStatus(bss.getPfStatus() == null || bss == null ? "N/A" : bss.getPfStatus().toString());
            set.setPfUAN_NO(bss.getPfUAN_NO() == null || bss == null ? "N/A" : bss.getPfUAN_NO());
            set.setEsiNo(bss.getEsiNo() == null || bss == null ? "N/A" : bss.getEsiNo());
            RmcStaff bs = staffRepo.findById(found.getStaffId()).get();
            set.setAccountNumber(bs.getAccountNumber() == null || bs == null ? "N/A" : bs.getAccountNumber());
            set.setBankName(bs.getBankName() == null || bs == null ? "N/A" : bs.getBankName());
            set.setBranch(bs.getBranch() == null || bs == null ? "N/A" : bs.getBranch());
            set.setIfscCode(bs.getIfscCode() == null || bs == null ? "N/A" : bs.getIfscCode());
            set.setStamp(found.getStamp());

            result.add(set);
        }
        return result;
    }

}
