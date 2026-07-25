package com.hrms.modules.dtos;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class SumOfDistributionDTO {
    private String month;
    private String year;
    private String zoneOf;
    private BigDecimal totalBasic ;
    private BigDecimal totalHra ;
    private BigDecimal totalConvOther ;
    private BigDecimal totalGross ;
    private BigDecimal totalEmpPf ;
    private BigDecimal totalEmpEsi ;
    private BigDecimal totalAdvance ;
    private BigDecimal totalDa ;
    private BigDecimal totalTds ;
    private BigDecimal totalOthers ;
    private BigDecimal totalDedOfEmp ;
    private BigDecimal totalAdditional ;
    private BigDecimal totalSetteled ;
    private BigDecimal totalDeduction ;
    private BigDecimal totalNetPaid ;
    private BigDecimal prevSetldAmt;
}
