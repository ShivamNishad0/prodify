package com.hrms.modules.suda.payroll.modles;

import com.hrms.modules.utilsServics.Status;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Date;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(schema = "suda")
public class SudaHoliday {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long holidayId;
	private String holidayName;
	private Date holidayStart;
	private Date holidayEnd;
	private int totalHoliday;
	@Enumerated(EnumType.STRING)
	private Status status;
}
