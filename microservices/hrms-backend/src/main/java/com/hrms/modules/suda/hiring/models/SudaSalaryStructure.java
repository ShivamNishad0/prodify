package com.hrms.modules.suda.hiring.models;


import com.hrms.modules.utilsServics.Status;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(schema = "suda")
public class SudaSalaryStructure {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long ssId;
	private BigDecimal basic;
	private BigDecimal hra;
	private BigDecimal conv_oth;
	private BigDecimal da;
	private BigDecimal gross;
	private Long staffId;
	private String empNo;
	private BigDecimal scale;
	@Enumerated(EnumType.STRING)
	private Status pfStatus;
	private BigDecimal pfPercent;
	private BigDecimal mobileAllowence;
	private BigDecimal security;
	private BigDecimal pendingSecurity;
	private BigDecimal insentive;
	private BigDecimal ProfTax;
	private String pfUAN_NO;
	private String esiNo;
	@Enumerated(EnumType.STRING)
	private Status esiStatus;
	private BigDecimal esiPercent;
	@Enumerated(EnumType.STRING)
	private Status tdsStatus;
	@Enumerated(EnumType.STRING)
	private Status targetBased;
	private BigDecimal tdsPercent;
}
