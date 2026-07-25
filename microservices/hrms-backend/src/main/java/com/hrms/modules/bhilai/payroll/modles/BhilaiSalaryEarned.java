package com.hrms.modules.bhilai.payroll.modles;

import com.hrms.modules.utilsServics.Status;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.sql.Timestamp;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(schema = "bhilai")
public class BhilaiSalaryEarned {
	@Id
	 @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long salId;
	private Long staffId;
	private String empNo;
	private String staffName;
	private String staffImg;
	private BigDecimal basic;
	private BigDecimal hra;
	private BigDecimal da;
	private BigDecimal conv_Oth;
	private BigDecimal gross;
	private BigDecimal additional;
	private BigDecimal netPaid;
	private BigDecimal pf;
	private BigDecimal esi;
	private BigDecimal tds;
	@Enumerated(EnumType.STRING)
	private Status pfStatus;
	private String pfUAN_NO;
	private String esiNo;
	private String remarks;
	@Enumerated(EnumType.STRING)
	private Status isApproved;
	private Long approvBy;
	private String month;
	private String year;
	private int totalDay;
	private Timestamp stamp;
	private Status status;
}
