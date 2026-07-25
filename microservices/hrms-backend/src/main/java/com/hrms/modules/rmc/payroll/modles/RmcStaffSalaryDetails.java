package com.hrms.modules.rmc.payroll.modles;

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
@Table(schema = "rmc")
public class RmcStaffSalaryDetails {
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
	private BigDecimal advance=new BigDecimal(0.0);
	private BigDecimal da;
	private String advanceRemark;
	private BigDecimal tds;
	private BigDecimal other;
	private String otherRemark;
	private BigDecimal dedOfEmpShare;
	private BigDecimal additional=new BigDecimal(0.0);
	private BigDecimal setteled_Adv_Amt;
	private String additionalRemark;
	private BigDecimal deduction=new BigDecimal(0.0);
	private String deductionRemark;
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
	@Enumerated(EnumType.STRING)
	private Status onHold;
	private Timestamp stamp;
	@Enumerated(EnumType.STRING)
	private Status isTargetBased = Status.FALSE;
}
	