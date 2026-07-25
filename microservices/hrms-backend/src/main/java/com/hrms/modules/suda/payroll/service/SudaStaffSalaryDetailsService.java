package com.hrms.modules.suda.payroll.service;


import com.hrms.modules.dtos.*;
import com.hrms.modules.suda.payroll.modles.SudaStaffSalaryDetails;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public interface SudaStaffSalaryDetailsService {
    public String generateSalary(Long StaffId, int year, String month);

    public String editSalaryDetails(Long sslId, SalaryDetails_EDIT_DTO details, Long editedBy);

    public SudaStaffSalaryDetails findSalaryDetails(Long StaffId, String month, String year);

    public String createDeduction(DeductionReqDTO data);

    public String verifySalary(List<Long> salaryDetId, Long userId);

    public CountAndSalaryDetailsByZone allSalariesList(Long zoneId, String month, String year,String req,String []area_id, int page, int size);

    public CountAndSalaryDetailsByZone findByStaffEmpNo(String tempEmp, String month, String year,String type);

    public StaffAdvanceInfoDTO findAdvDetailsOfEmp(String empNo);

    public List<SalaryReportDTO> getAllSalaryByDetails(String month, Long zoneId, String year,String[]area_id,String req);

    public List<SalaryReportDTO> getAllSalaryByDetailsFixed(String month, Long zoneId, String year,String[]area_id,String req);

    public String createAdvPaymentOfStaff(AdvancePaymentDTO data, String type);

    public List<SudaStaffSalaryDetails> getAnualResultOfEmp(String empNo, Long zoneId, String year);

    public CountAndSalaryDetailsByZone allSalariesListForTargetBased(Long zoneId, String month, String year,String []area_id, int page, int size);

    public CountAndSalaryDetailsByZone allSalariesListForFixed(Long zoneId, String month, String year,String []area_id, int page, int size);

    public SumOfDistributionDTO findTotalMoneyDistribution(String month, String year,String type);

    public CountAndSalaryDetailsByZone removedStaffSalary(int page, int size,String empNo);

    public CountAndSalaryDetailsByZone allRemovedStaffSalary(int page, int size);

    public SudaStaffSalaryDetails findPrevAmt(String empNo,String month,String year);

    public CountAndDetails getSumOf(String month, String year, String type, int pageNumber, int pageSize);

    public CountAndDetails getSumOfIndividual(String empNo,String month, String year, String type, int pageNumber, int pageSize);

    public Map<String, BigDecimal> otherAllowancesDetails(String emp_no,String month,String year);

    public CountAndSalaryDetailsByZone getDataAsPerMonthAndYear(String type, String month, String year, int page, int size);

    public String salaryOnHold(String empNo,String month,String year,String type);

    public CountAndSalaryDetailsByZone allSalariesListForAll(Long zoneId, String month, String year, String[] areaIds, int page, int size);

    public CountAndSalaryDetailsByZone allSalariesListForComplete( String month, String year, String[] areaIds);

    public String removeSalaryDetails(String month, String year, String empNo);



}
