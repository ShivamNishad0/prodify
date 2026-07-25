package com.hrms.modules.dmc.payroll.modles;

import com.hrms.modules.utilsServics.Status;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(schema = "dmc")
public class DmcAttendanceDeatils {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long atdId;
	private Long StaffId;
	private String empNo;
	private String empName;
	private String noOfDayPresent;
	private String noOfDayAbsent;
	private String noOfDayHalfPresent;
	private String noOfWO;
	private String noOfPaidLeave;
	private String noOfHoliday;
	private String month;
	private String year;
	private Long salaryId;
	@Enumerated(EnumType.STRING)
	private Status verified;
	private Long verifiedBy;
}
