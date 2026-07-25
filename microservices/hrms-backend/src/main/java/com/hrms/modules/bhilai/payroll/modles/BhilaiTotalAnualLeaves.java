package com.hrms.modules.bhilai.payroll.modles;


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
@Table(schema = "bhilai")
public class BhilaiTotalAnualLeaves {
	 @Id
	 @GeneratedValue(strategy = GenerationType.IDENTITY)
	 private Long anualLeavId;
	 private String leaveName;
	 private Date leaveStartDate;
	 private Date leaveEndDate;
	 @Enumerated(EnumType.STRING)
	 private Status status;
}
