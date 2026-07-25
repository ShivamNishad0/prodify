package com.hrms.modules.rmc.payroll.service;


import com.hrms.modules.dtos.TargetRequestDTO;
import com.hrms.modules.dtos.TargetResponseDTO;

public interface RmcStaffTargetDetailsService {
    public String createTargetDetails(TargetRequestDTO data);

    public String createFixedDetails(TargetRequestDTO data);
    public TargetResponseDTO staffStaffDetails( String[] areaId,String month,String year,String emp_no, int page, int size) ;

    public TargetResponseDTO staffStaffFixedDetails(String[] areaId, String month, String year, String empNo, int page, int size) ;
}
