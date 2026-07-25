package com.hrms.modules.dtos;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Data
@Getter
@Setter
public class StaffAdvanceData {
	private String advForMonth;
	private BigDecimal advAmt;
	private BigDecimal setteldAmt;
	private BigDecimal blanceAmt;

}
