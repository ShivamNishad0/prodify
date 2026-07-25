package com.hrms.modules.bhilai.payroll.serviceImpl;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.sql.Timestamp;
import java.time.Month;
import java.time.YearMonth;
import java.util.*;
import java.util.stream.Collectors;

import com.hrms.modules.bhilai.hiring.models.BhilaiRemovedStaffs;
import com.hrms.modules.bhilai.hiring.repository.BhilaiRemovedStaffsRepo;
import com.hrms.modules.bhilai.payroll.modles.BhilaiStaffTargetDetails;
import com.hrms.modules.bhilai.payroll.repository.*;
import com.hrms.modules.dtos.*;
import com.hrms.modules.bhilai.hiring.models.BhilaiSalaryStructure;
import com.hrms.modules.bhilai.hiring.models.BhilaiStaff;
import com.hrms.modules.bhilai.hiring.repository.BhilaiSalaryStructureRepo;
import com.hrms.modules.bhilai.hiring.repository.BhilaiStaffRepo;
import com.hrms.modules.bhilai.payroll.modles.BhilaiAttendanceDeatils;
import com.hrms.modules.bhilai.payroll.modles.BhilaiStaffSalaryDetails;
import com.hrms.modules.bhilai.payroll.service.BhilaiSalaryEarnedService;
import com.hrms.modules.bhilai.payroll.service.BhilaiStaffSalaryDetailsService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.hrms.modules.utilsServics.Result;
import com.hrms.modules.utilsServics.Status;

@Service
public class BhilaiStaffSalaryDetailsServiceImpl implements BhilaiStaffSalaryDetailsService {

    @Autowired
    private BhilaiStaffSalaryDetailsRepository salaryRepo;
    @Autowired
    private BhilaiAttendanceDeatilsRepository detailsRepo;
    @Autowired
    private BhilaiSalaryStructureRepo bhilaiSalaryStructureRepo;
    @Autowired
    private BhilaiStaffSalaryServicesForRMC salarySerive;
    @Autowired
    private BhilaiSalaryEarnedService salaryEarned;
    @Autowired
    private BhilaiSalaryEarnedRepository salaryEarnedRepo;
    @Autowired
    private BhilaiStaffAttendanceRepository attendanceRepo;
    @Autowired
    private BhilaiStaffRepo bhilaiStaffRepo;
    @Autowired
    private BhilaiRemovedStaffsRepo removeStaffRepo;
    @Autowired
    private EntityManager entityManager;
    @Autowired
    private BhilaiStaffTargetDetailsRepository targetRepo;

    @Override
    public String generateSalary(Long StaffId, int year, String month) {
        System.out.println("MAKING SALARY DETAILS PLEASE WAIT");
        Integer yearof = year;
        BhilaiAttendanceDeatils details = detailsRepo.findByDetails(StaffId, month, yearof.toString());
        BhilaiSalaryStructure structure = bhilaiSalaryStructureRepo.findById(details.getSalaryId()).get();
        BhilaiStaff foundBhilaiStaff = bhilaiStaffRepo.findById(StaffId).get();

        if (structure == null) {
            return Result.NOT_FOUND.toString() + " Salary Structure Not Found Of Staff " + foundBhilaiStaff.getTempEmp();
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
        BigDecimal grossSalary = tempGross.add(halfDaywoholiday);
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
        BigDecimal deduction = pf.add(esi);

        // Calculating net pay
        BigDecimal netpay = grossSalary.subtract(deduction).setScale(2, RoundingMode.HALF_UP);

        String yearName = Integer.toString(year);
        BhilaiStaffSalaryDetails foundSalary = salaryRepo.findBydetails(StaffId, month, yearName);
        if (foundSalary != null && foundSalary.getDeduction() != null && foundSalary.getDeduction().compareTo(BigDecimal.ZERO) > 0) {
            netpay = netpay.subtract(foundSalary.getDeduction());
        }

        if (foundSalary == null) {
            // Saving the calculated salary
            BhilaiStaffSalaryDetails salary = new BhilaiStaffSalaryDetails();
            salary.setStaffId(StaffId);
            salary.setEmpNo(details.getEmpNo());
            salary.setYear(yearName);
            salary.setStaffName(foundBhilaiStaff.getName());
            salary.setMonth(month);
            salary.setBasic(basic.setScale(0, RoundingMode.HALF_UP));
//        salary.setDa(da);
            salary.setHra(hra);
            salary.setConv_or_Other(convAndOther.setScale(0, RoundingMode.HALF_UP));
            salary.setGross(grossSalary.setScale(0, RoundingMode.HALF_UP));
            salary.setEmpPF(pf.setScale(0, RoundingMode.HALF_UP));
            salary.setEmpESI(esi.setScale(0, RoundingMode.HALF_UP));
            salary.setNetPaid(netpay.setScale(0, RoundingMode.HALF_UP));
            salary.setTotalNoDay(numberOfDayInThatMonth);
            salary.setNoOfDayPresent(Integer.parseInt(details.getNoOfDayPresent()));
            salary.setNoOfDayAbsent(Integer.parseInt(details.getNoOfDayAbsent()));
            salary.setNoOfHalfDay(Integer.parseInt(details.getNoOfDayHalfPresent()));
            salary.setDedOfEmpShare(deduction.setScale(0, RoundingMode.HALF_UP));
            salary.setStatus(Status.UNVERIFIED);
            Timestamp currentTimestamp = new Timestamp(System.currentTimeMillis());
            salary.setStamp(currentTimestamp);
            salary.setOnHold(Status.FALSE);
            salary.setIsTargetBased(structure.getTargetBased());
            BhilaiStaffSalaryDetails saved = salaryRepo.save(salary);
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
            foundSalary.setNoOfDayPresent(Integer.parseInt(details.getNoOfDayPresent()));
            foundSalary.setNoOfDayAbsent(Integer.parseInt(details.getNoOfDayAbsent()));
            foundSalary.setNoOfHalfDay(Integer.parseInt(details.getNoOfDayHalfPresent()));
            BhilaiStaffSalaryDetails saved = salaryRepo.save(foundSalary);
            return saved != null ? Result.SUCCESS.toString() : Result.WENT_WRONG.toString();
        }
    }

    @Override
    public String editSalaryDetails(Long sslId, SalaryDetails_EDIT_DTO details, Long editedBy) {
        BhilaiStaffSalaryDetails found = salaryRepo.findById(sslId).get();
//		found.setBasic(details.getBasic());
//		found.setGross(details.getGross());
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
        BhilaiStaffSalaryDetails saved = salaryRepo.save(found);
        return saved != null ? Result.SUCCESS.toString() : Result.WENT_WRONG.toString();

    }

    @Override
    public BhilaiStaffSalaryDetails findSalaryDetails(Long StaffId, String month, String year) {
        BhilaiStaffSalaryDetails foundSalary = salaryRepo.findBydetails(StaffId, month, year);
        return foundSalary != null ? foundSalary : null;
    }

    @Override
    public String verifySalary(List<Long> salaryDetId, Long userId) {
        for (Long salaryDetailId : salaryDetId) {
            BhilaiStaffSalaryDetails foundSalary = salaryRepo.findById(salaryDetailId).get();
            foundSalary.setVerifiedBy(userId);
            foundSalary.setStatus(Status.VERIFIED);
            BhilaiStaffSalaryDetails savedSalary = salaryRepo.save(foundSalary);
            if (savedSalary != null) {
                salaryEarned.finalStaffSalary(savedSalary);
            }
        }
        return Result.SUCCESS.toString();
    }
    @Override
    public  Map<String,BigDecimal> otherAllowancesDetails(String emp_no,String month,String year){
        BhilaiStaffSalaryDetails details = salaryRepo.findBydetails(emp_no,month,year);
        Map<String,BigDecimal> allowance = new HashMap<>();
        if(details!=null){
            allowance.put("mobile",details.getMobileAllowances()==null?BigDecimal.ZERO:details.getMobileAllowances());
            allowance.put("incentive",details.getIncentive()==null?BigDecimal.ZERO:details.getIncentive());

        }
        if(details==null){
            allowance.put("mobile",BigDecimal.ZERO);
            allowance.put("incentive",BigDecimal.ZERO);
        }
        return allowance;
    }

    @Override
    public String createDeduction(DeductionReqDTO data) {
        BhilaiStaffSalaryDetails staffSalary = salaryRepo.findStaffBydetails(data.getEmpNo(), data.getMonth(), data.getYear());
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
    public CountAndSalaryDetailsByZone allSalariesList(Long zoneId, String month, String year, String type, String req, Long desigId, String[] area_id, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        String status = (type == null || type.isEmpty()) ? Status.UNVERIFIED.toString() : type;
        Long[] areaIds = (area_id != null && area_id.length > 0)
                ? Arrays.stream(area_id).map(Long::parseLong).toArray(Long[]::new)
                : new Long[]{0L};

        Page<BhilaiStaffSalaryDetails> dataPage;
        CountAndSalaryDetailsByZone result = new CountAndSalaryDetailsByZone();

        boolean isSalariedRequest = "SLR".equalsIgnoreCase(req);
        boolean hasSpecificAreaIds = areaIds.length > 0 && !Arrays.asList(areaIds).contains(0L);
        boolean hasDesignationId = desigId != null && desigId > 0;

        if (isSalariedRequest) {
            if (hasSpecificAreaIds && hasDesignationId) {
                dataPage = salaryRepo.findAllSalariedData(month, year, status, desigId, areaIds, pageable);
                result.setCount(salaryRepo.countAllSalariedData(month, year, status, desigId, areaIds));
            } else if (hasSpecificAreaIds) {
                dataPage = salaryRepo.findAllSalariedData(month, year, status, areaIds, pageable);
                result.setCount(salaryRepo.countAllSalariedData(month, year, status, areaIds));
            } else if (hasDesignationId) {
                dataPage = salaryRepo.findAllSalariedData(month, year, status, desigId, pageable);
                result.setCount(salaryRepo.countAllSalariedData(month, year, status, desigId));
            } else {
                dataPage = salaryRepo.findAllSalariedData(month, year, status, pageable);
                result.setCount(salaryRepo.foundDataSalaried(month, year, status));
            }
        } else {
            dataPage = salaryRepo.findAllDataForTargetEmp(month, year, status, desigId, pageable);
            result.setCount(salaryRepo.foundDataTarget(month, year, status, desigId));
        }

        result.setResults(mapSalaryReportDetails(dataPage.getContent()));
        return result;
    }


    @Override
    public CountAndSalaryDetailsByZone allSalariesListForTargetBased(Long zoneId, String month, String year, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<BhilaiStaffSalaryDetails> dataPage = salaryRepo.findAllDataForTarget(month, year, pageable);

        CountAndSalaryDetailsByZone result = new CountAndSalaryDetailsByZone();
        result.setResults(mapSalaryClassField(dataPage.getContent()));
        result.setCount(salaryRepo.foundDataOfTargetBased());

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

        List<BhilaiStaffSalaryDetails> bhilaiStaffSalaryDetails = salaryRepo.findStaffByTempEmpOrContactNo(tempEmp, month, year,is_target_based);
        Long count = salaryRepo.countStaffByTempEmp(tempEmp);
        CountAndSalaryDetailsByZone staffDTO = new CountAndSalaryDetailsByZone();
        staffDTO.setCount(count);
        staffDTO.setResults(mapSalaryReportDetails(bhilaiStaffSalaryDetails));
        return staffDTO;
    }

    @Override
    public StaffAdvanceInfoDTO findAdvDetailsOfEmp(String empNo) {
        // Fetch the list of StaffSalaryDetails based on empNo and zoneId
        List<BhilaiStaffSalaryDetails> bhilaiStaffSalaryDetails = salaryRepo.advDetailsOfEmp(empNo);

        // Initialize a DTO to hold advance information for the employee
        StaffAdvanceInfoDTO staffAdvanceInfoDTO = new StaffAdvanceInfoDTO();

        // Set the empNo directly from the parameter
        staffAdvanceInfoDTO.setEmpNo(empNo);

        // Assuming the first entry contains the required employee details
        if (!bhilaiStaffSalaryDetails.isEmpty()) {
            BhilaiStaffSalaryDetails staffSalary = bhilaiStaffSalaryDetails.get(0);

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
        for (BhilaiStaffSalaryDetails staffSalary : bhilaiStaffSalaryDetails) {
            BigDecimal advAmts=staffSalary==null||staffSalary.getAdvance()==null?BigDecimal.ZERO:staffSalary.getAdvance();
            BigDecimal advSettlAmts=staffSalary==null||staffSalary.getSetteled_Adv_Amt()==null?BigDecimal.ZERO:staffSalary.getSetteled_Adv_Amt();
            if (advAmts.compareTo(BigDecimal.ZERO) > 0 ||advSettlAmts.compareTo(BigDecimal.ZERO) > 0) {
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
    public List<SalaryReportDTO> getAllSalaryByDetails(String month, Long zoneId, String year) {
        List<SalaryReportDTO> details =mapSalaryReportDetails( salaryRepo.detailsByMonth(month, year));
        if (details != null) {
            return details;
        }
        return null;
    }

    @Override
    public String createAdvPaymentOfStaff(AdvancePaymentDTO data, String type) {
        BhilaiStaffSalaryDetails staffSalary = salaryRepo.findStaffBydetails(data.getEmpNo(), data.getMonth(), data.getYear());
        if (staffSalary != null) {
            BigDecimal newAmount = new BigDecimal(data.getAmount());
            if (type.equals("adv")) {
                staffSalary.setAdvance(new BigDecimal(data.getAmount()));
            }
            if (type.equals("setl")) {
                staffSalary.setSetteled_Adv_Amt(new BigDecimal(data.getAmount()));
            }
            if(type.equals("mobile")){
                updateNetPaid(staffSalary, newAmount, staffSalary.getMobileAllowances());
                staffSalary.setMobileAllowances(newAmount);
            }
            if(type.equals("incentive")){
                updateNetPaid(staffSalary, newAmount, staffSalary.getIncentive());
                staffSalary.setIncentive(newAmount);
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
    public BhilaiStaffSalaryDetails findPrevAmt(String empNo, String month, String year) {
        return salaryRepo.findBydetails(empNo, month, year);
    }

    @Override
    public List<BhilaiStaffSalaryDetails> getAnualResultOfEmp(String empNo, Long zoneId, String year) {
        List<BhilaiStaffSalaryDetails> foundData = salaryRepo.detailsAnnually(empNo, year);
        // Return an empty list if foundData is null or empty
        if (foundData == null || foundData.isEmpty()) {
            return new ArrayList<>(); // Return an empty list instead of null
        }
        return foundData;
    }

    @Override
    public SumOfDistributionDTO findTotalMoneyDistribution(String month, String year,String type) {
        if (month == null || year == null||type==null) {
            return null;
        }
        List<BhilaiStaffSalaryDetails> found = salaryRepo.allDetailsForMonth(month, year);
        List<BhilaiStaffSalaryDetails> filterData =filterResult(found,type);

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
        for (BhilaiStaffSalaryDetails details : filterData) {
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
            totalNetPaid = totalNetPaid.add(details.getNetPaid() != null ? details.getNetPaid() : BigDecimal.ZERO);
            prevSetlAmt = prevSetlAmt.add(details.getPrevSetldAmt() != null ? details.getPrevSetldAmt() : BigDecimal.ZERO);

        }
        SumOfDistributionDTO obj = new SumOfDistributionDTO();
        obj.setMonth(month);
        obj.setYear(year);
        obj.setZoneOf("BHILAI");
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
        obj.setTotalNetPaid(totalNetPaid);
        return obj;
    }

    @Override
    public CountAndSalaryDetailsByZone allRemovedStaffSalary(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);

        List<BhilaiRemovedStaffs> staffs = removeStaffRepo.findAll();
        List<BhilaiStaffSalaryDetails> data = staffs.stream()
                .map(s -> salaryRepo.findStaffBydetails(s.getEmpNo(), s.getMonth(), s.getYear()))
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        // Apply pagination manually since data is fetched in bulk
        int start = Math.min((int) pageable.getOffset(), data.size());
        int end = Math.min((start + pageable.getPageSize()), data.size());
        List<BhilaiStaffSalaryDetails> paginatedData = data.subList(start, end);

        CountAndSalaryDetailsByZone result = new CountAndSalaryDetailsByZone();
        result.setCount((long) data.size());
        result.setResults(paginatedData);

        return result;
    }


    @Override
    public CountAndSalaryDetailsByZone removedStaffSalary(int page, int size,String empNo) {
        Pageable pageable = PageRequest.of(page, size);

        List<BhilaiRemovedStaffs> staffs = removeStaffRepo.removedStaffDetails(empNo);
        List<BhilaiStaffSalaryDetails> data = staffs.stream()
                .map(s -> salaryRepo.findStaffBydetails(s.getEmpNo(), s.getMonth(), s.getYear()))
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        // Apply pagination manually since data is fetched in bulk
        int start = Math.min((int) pageable.getOffset(), data.size());
        int end = Math.min((start + pageable.getPageSize()), data.size());
        List<BhilaiStaffSalaryDetails> paginatedData = data.subList(start, end);

        CountAndSalaryDetailsByZone result = new CountAndSalaryDetailsByZone();
        result.setCount((long) data.size());
        result.setResults(paginatedData);

        return result;
    }

    @Override
    public CountAndDetails getSumOf(String month, String year, String type, int pageNumber, int pageSize){
        String columnName =type!=null && !type.equals("ALL") ?getColumnName(type):getColumnName("PF");
        CountAndDetails data = getDynamicColumnData(columnName, month, year, pageNumber, pageSize);
        return data;
    }
    @Override
    public CountAndDetails getSumOfIndividual(String empNo,String month, String year, String type, int pageNumber, int pageSize){
        String columnName =type!=null && !type.equals("ALL") ?getColumnName(type):getColumnName("PF");
        CountAndDetails data = getDynamicColumnDataIndividual(empNo,columnName, month, year, pageNumber, pageSize);
        return data;
    }

    @Override
    public CountAndSalaryDetailsByZone getDataAsPerMonthAndYear(String type, String month, String year, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<BhilaiStaffSalaryDetails> data;
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
    public String salaryOnHold(String empNo,String month,String year,String type){
        BhilaiStaffSalaryDetails details = salaryRepo.findStaffBydetails(empNo,month,year);
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
        System.out.println("ONE DAY AMT ====> "+oneDay);
        return oneDay;
    }

    public List<BhilaiStaffSalaryDetails> filterResult(List<BhilaiStaffSalaryDetails> got, String type) {
        List<BhilaiStaffSalaryDetails> result = new ArrayList<>();

        for (BhilaiStaffSalaryDetails data : got) {
            BhilaiStaff staff = bhilaiStaffRepo.findStaffByTemp_emp(data.getEmpNo());
            if (type.equals("active") && staff.getActive().equals(Status.ACTIVE)) {
                result.add(data);
            } else if (type.equals("inactive") && staff.getActive().equals(Status.INACTIVE)) {
                result.add(data);
            }
        }

        return result;
    }

    public CountAndDetails getDynamicColumnData(String columnName, String month, String year, int pageNumber, int pageSize) {
        String query = "SELECT staff_name, emp_no, " + columnName +
                " FROM bhilai.bhilai_staff_salary_details " +
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
                " FROM bhilai.bhilai_staff_salary_details " +
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
//            case "ALL" -> {
//                String [] all = {"emppf","additional","advance","basic",
//                        "conv_or_other","da","empesi","emppf"
//                        "gross","hra","net_paid","setteled_adv_amt",
//                        "tds","deduction"
//                };
//                return all;
//            }
            case "" -> {
                return "EMPTY_FIELD";  // Corrected typo and added semicolon
            }
            default -> {
                return "UNKNOWN_TYPE";  // Handle cases when type doesn't match known cases
            }
        }
    }
    public List<TargetSalaryDetailsDTO> mapSalaryClassField(List<BhilaiStaffSalaryDetails> data){
        List<TargetSalaryDetailsDTO> result = new ArrayList<>();
        for ( BhilaiStaffSalaryDetails found:data){
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
            set.setPrevSetldAmt(found.getPrevSetldAmt() == null ? BigDecimal.ZERO : found.getPrevSetldAmt());
            set.setPrevSetldRmk(found.getPrevSetldRmk() == null ? "N/A" : found.getPrevSetldRmk());
            set.setIncentive(found.getIncentive()==null?BigDecimal.ZERO:found.getIncentive());
            set.setMobileAllowances(found.getMobileAllowances()==null?BigDecimal.ZERO:found.getMobileAllowances());
            set.setTotalNoDay(found.getTotalNoDay());
            set.setNoOfDayPresent(found.getNoOfDayPresent());
            set.setNoOfDayAbsent(found.getNoOfDayAbsent());
            set.setStamp(found.getStamp());
            set.setNoOfHalfDay(found.getNoOfHalfDay());
            set.setMonth(found.getMonth());
            set.setYear(found.getYear());
            BhilaiStaffTargetDetails details = targetRepo.findByDetails(found.getMonth(),found.getYear(),found.getEmpNo());
            set.setTarget(details.getTarget()==null||details==null?BigDecimal.ZERO:details.getTarget());
            set.setExtraTarget(details.getExtraAchived()==null||details==null?BigDecimal.ZERO:details.getExtraAchived());
            result.add(set);
        }
        return result;
    }

    private void updateNetPaid(BhilaiStaffSalaryDetails staffSalary, BigDecimal newAmount, BigDecimal previousAmount) {
        BigDecimal prevValue = previousAmount == null ? BigDecimal.ZERO : previousAmount;
        BigDecimal updatedNet = staffSalary.getNetPaid().subtract(prevValue).add(newAmount);
        staffSalary.setNetPaid(updatedNet);
    }

    public List<SalaryReportDTO> mapSalaryReportDetails(List<BhilaiStaffSalaryDetails> data) {
        List<SalaryReportDTO> result = new ArrayList<>();
        for (BhilaiStaffSalaryDetails found : data) {
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
            set.setTotalNoDay(found.getTotalNoDay());
            set.setPrevSetldAmt(found.getPrevSetldAmt() == null ? BigDecimal.ZERO : found.getPrevSetldAmt());
            set.setPrevSetldRmk(found.getPrevSetldRmk() == null ? "N/A" : found.getPrevSetldRmk());
            BhilaiAttendanceDeatils deatils=detailsRepo.findAttendanceDetails(found.getEmpNo(),found.getMonth(),found.getYear());
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
            set.setOnHold(found.getOnHold().name());
            BhilaiStaffTargetDetails details = targetRepo.findByDetails(found.getMonth(), found.getYear(), found.getEmpNo());
            set.setTarget((details == null || details.getTarget() == null) ? BigDecimal.ZERO : details.getTarget());
            set.setExtraTarget((details == null || details.getExtraAchived() == null) ? BigDecimal.ZERO : details.getExtraAchived());
            BhilaiSalaryStructure bss = bhilaiSalaryStructureRepo.findByStaffId(found.getStaffId());
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
            BhilaiStaff bs = bhilaiStaffRepo.findById(found.getStaffId()).get();
            set.setAccountNumber(bs.getAccountNumber() == null || bs == null ? "N/A" : bs.getAccountNumber());
            set.setBankName(bs.getBankName() == null || bs == null ? "N/A" : bs.getBankName());
            set.setBranch(bs.getBranch() == null || bs == null ? "N/A" : bs.getBranch());
            set.setIfscCode(bs.getIfscCode() == null || bs == null ? "N/A" : bs.getIfscCode());
            set.setMobileAllowances(found.getMobileAllowances()==null?BigDecimal.ZERO:found.getMobileAllowances());
            set.setIncentive(found.getIncentive()==null?BigDecimal.ZERO:found.getIncentive());
            result.add(set);
        }
        return result;
    }

}
