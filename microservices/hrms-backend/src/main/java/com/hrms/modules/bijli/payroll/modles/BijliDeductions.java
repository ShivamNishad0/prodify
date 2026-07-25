package com.hrms.modules.bijli.payroll.modles;

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
@Table(schema = "bijli")
public class BijliDeductions {
	 @Id
	 @GeneratedValue(strategy = GenerationType.IDENTITY)
	 private Long deductionId;
	 private Double empPF;
	 private Double empESI;
	 private BigDecimal advance;
	 private BigDecimal tds;
	 private BigDecimal others;
	 @Enumerated(EnumType.STRING)
	 private Status status;
	 
}
