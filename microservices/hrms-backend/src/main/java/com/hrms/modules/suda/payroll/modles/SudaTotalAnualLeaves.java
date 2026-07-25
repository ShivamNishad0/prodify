package com.hrms.modules.suda.payroll.modles;


import com.hrms.modules.utilsServics.Status;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Date;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(schema = "suda")
public class SudaTotalAnualLeaves {
	 @Id
	 @GeneratedValue(strategy = GenerationType.IDENTITY)
	 private Long anualLeavId;
	 private String leaveName;
	 private Date leaveStartDate;
	 private Date leaveEndDate;
	 @Enumerated(EnumType.STRING)
	 private Status status;
}
