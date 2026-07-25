package com.hrms.modules.ho.payroll.service;

import com.hrms.modules.dtos.*;
import com.hrms.modules.ho.payroll.modles.HoStaffSalaryDetails;

import java.util.List;

public interface HoStaffSalaryDetailsService {
    public String generateSalary(Long StaffId, int year, String month);

    public String editSalaryDetails(Long sslId, SalaryDetails_EDIT_DTO details, Long editedBy);

    public HoStaffSalaryDetails findSalaryDetails(Long StaffId, String month, String year);

    public String verifySalary(List<Long> salaryDetId, Long userId);

    public CountAndSalaryDetailsByZone allSalariesList(Long zoneId, String month, String year,String type, int page, int size);

    public CountAndSalaryDetailsByZone findByStaffEmpNo(String tempEmp, String month, String year,String type);

    public StaffAdvanceInfoDTO findAdvDetailsOfEmp(String empNo);

    public List<SalaryReportDTO> getAllSalaryByDetails(String month, Long zoneId, String year,String type);

    public String createAdvPaymentOfStaff(AdvancePaymentDTO data, String type);

    public List<HoStaffSalaryDetails> getAnualResultOfEmp(String empNo, Long zoneId, String year);

    public CountAndSalaryDetailsByZone allSalariesListForTargetBased(Long zoneId, String month, String year, int page, int size);

    public SumOfDistributionDTO findTotalMoneyDistribution(String month, String year,String type);

    public CountAndSalaryDetailsByZone allRemovedStaffSalary(int page, int size);

    public CountAndSalaryDetailsByZone removedStaffSalary(int page, int size,String empNo);

    public CountAndDetails getSumOf(String month,String year,String type,boolean isReport,int pageNumber,int pageSize);

    public CountAndDetails getSumOfIndividual(String empNo,String month, String year, String type, int pageNumber, int pageSize);

    public HoStaffSalaryDetails findPrevAmt(String empNo,String month,String year);

    public String updateAllSalary(String month,String year);

    public String createDeduction(DeductionReqDTO data);

    public CountAndSalaryDetailsByZone getDataAsPerMonthAndYear(String type, String month, String year, int page, int size);

    public String salaryOnHold(String empNo,String month,String year,String type);

    public String removeSalaryDetails(String month, String year, String empNo);

}
