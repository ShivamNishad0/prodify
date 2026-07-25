package com.hrms.modules.dtos;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Year;
import java.util.List;
import java.util.Map;

@Getter
@Setter
public class StaffDeductionsInfoDTO {
    private String empNo;
    private Long staffId;
    private BigDecimal totalDeduction;
    private String year;
    private List<Map<String, BigDecimal>> deductions;
}
