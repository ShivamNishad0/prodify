package com.hrms.modules.dtos;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SalaryDetails_EDIT_DTO {
	private BigDecimal empPF;
	private BigDecimal empESI;
	private BigDecimal advance;
	private String advanceRemark;
	private BigDecimal tds;
	private BigDecimal other;
	private String otherRemark;
	private BigDecimal dedOfEmpShare;
	private BigDecimal additional;
	private String additionalRemark;
	private BigDecimal netPaid;
}
