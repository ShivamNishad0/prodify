package com.hrms.modules.dtos;

import com.hrms.modules.utilsServics.Status;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.sql.Timestamp;

@Getter
@Setter
public class SalaryReportDTO {
    private Long ssdId;
    private Long staffId;
    private String empNo;
    private String staffName;
    private BigDecimal basic;
    private BigDecimal hra;
    private BigDecimal conv_or_Other;
    private BigDecimal gross;
    private BigDecimal empPF;
    private BigDecimal empESI;
    private BigDecimal advance;
    private BigDecimal da;
    private String advanceRemark;
    private BigDecimal tds;
    private BigDecimal other;
    private String otherRemark;
    private BigDecimal dedOfEmpShare;
    private BigDecimal additional;
    private BigDecimal setteled_Adv_Amt;
    private String additionalRemark;
    private BigDecimal prevSetldAmt;
    private String prevSetldRmk;
    private BigDecimal netPaid;
    private int totalNoDay;
    private int noOfDayPresent;
    private int noOfDayAbsent;
    private int noOfHalfDay;
    private String noOfWO;
    private String noOfPaidLeave;
    private  String noOfHoliday;
    private String month;
    private String year;
    private Status status;
    private Long editedBy;
    private Long verifiedBy;
    private Timestamp stamp;
    private Status isTargetBased ;
    private BigDecimal target;
    private BigDecimal extraTarget;
    private BigDecimal strcBasic;
    private BigDecimal strcDa;
    private BigDecimal strcHRA;
    private BigDecimal strcConv_oth;
    private BigDecimal strcGross;
    private BigDecimal esiPercent;
    private BigDecimal pfPercent;
    private String pfStatus ;
    private String pfUAN_NO ;
    private String esiNo ;
    private String accountNumber ;
    private String bankName ;
    private String branch ;
    private String ifscCode ;
    private String onHold;
    private BigDecimal deduction;
    private String deductionRemark;
    private BigDecimal rent;
    private BigDecimal check_incentive;
    private BigDecimal other_expenses;
    private BigDecimal securityDeduction;
    private BigDecimal mobileAllowances;
    private BigDecimal incentive;
}
