package com.hrms.modules.suda.payroll.modles;

import com.hrms.modules.utilsServics.Status;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.sql.Timestamp;

@Data
@Getter
@Setter
@Entity
@Table(schema = "suda")
public class SudaStaffSalaryDetails {
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
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
	private BigDecimal deduction=BigDecimal.ZERO;
	private  String deductionRemark;
	private String additionalRemark;
	private BigDecimal prevSetldAmt;
	private String prevSetldRmk;
	private BigDecimal netPaid;
	private int totalNoDay;
	private int noOfDayPresent;
	private int noOfDayAbsent;
	private int noOfHalfDay;
	private String month;
	private String year;
	@Enumerated(EnumType.STRING)
	private Status status;
	private Long editedBy;
	private Long verifiedBy;
	private BigDecimal securityDeduction;
	private BigDecimal rent=BigDecimal.ZERO;
	private BigDecimal check_incentive=BigDecimal.ZERO;
	private BigDecimal other_expenses=BigDecimal.ZERO;
	private String other_expensesRemark;
	private Timestamp stamp;
	@Enumerated(EnumType.STRING)
	private Status onHold;
	@Enumerated(EnumType.STRING)
	private Status isTargetBased = Status.FALSE;
}
	