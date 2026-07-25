package com.hrms.modules.bijli.payroll.service;

import com.hrms.modules.dtos.TargetRequestDTO;
import com.hrms.modules.dtos.TargetResponseDTO;

public interface BijliStaffTargetDetailsService {
    public String createTargetDetails(TargetRequestDTO data);
    public TargetResponseDTO staffStaffDetails(String []areaId,String month,String year,String emp_no, int page, int size) ;

    public  TargetResponseDTO staffDetails( String month, String year, String areaId, int page, int size);
}
