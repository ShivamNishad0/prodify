package com.hrms.modules.ho.payroll.modles;


import com.hrms.modules.utilsServics.Attendance;
import com.hrms.modules.utilsServics.Status;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Timestamp;
import java.time.Month;
import java.time.Year;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(schema = "ho")
public class HoStaffAttendance {
	@Id
	 @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long attendanceId;
	private Long staffId;
	private String empNo;
	private Year year;
	private String empName;
	private Month month;
	private String monthName;
	@Enumerated(EnumType.STRING)
	private Attendance d1;
	private String d1In;
	private String d1Out;
	@Enumerated(EnumType.STRING)
	private Attendance d2;
	private String d2In;
	private String d2Out;
	@Enumerated(EnumType.STRING)
	private Attendance d3;
	private String d3In;
	private String d3Out;
	@Enumerated(EnumType.STRING)
	private Attendance d4;
	private String d4In;
	private String d4Out;
	@Enumerated(EnumType.STRING)
	private Attendance d5;
	private String d5In;
	private String d5Out;
	@Enumerated(EnumType.STRING)
	private Attendance d6;
	private String d6In;
	private String d6Out;
	@Enumerated(EnumType.STRING)
	private Attendance d7;
	private String d7In;
	private String d7Out;
	@Enumerated(EnumType.STRING)
	private Attendance d8;
	private String d8In;
	private String d8Out;
	@Enumerated(EnumType.STRING)
	private Attendance d9;
	private String d9In;
	private String d9Out;
	@Enumerated(EnumType.STRING)
	private Attendance d10;
	private String d10In;
	private String d10Out;
	@Enumerated(EnumType.STRING)
	private Attendance d11;
	private String d11In;
	private String d11Out;
	@Enumerated(EnumType.STRING)
	private Attendance d12;
	private String d12In;
	private String d12Out;
	@Enumerated(EnumType.STRING)
	private Attendance d13;
	private String d13In;
	private String d13Out;
	@Enumerated(EnumType.STRING)
	private Attendance d14;
	private String d14In;
	private String d14Out;
	@Enumerated(EnumType.STRING)
	private Attendance d15;
	private String d15In;
	private String d15Out;
	@Enumerated(EnumType.STRING)
	private Attendance d16;
	private String d16In;
	private String d16Out;
	@Enumerated(EnumType.STRING)
	private Attendance d17;
	private String d17In;
	private String d17Out;
	@Enumerated(EnumType.STRING)
	private Attendance d18;
	private String d18In;
	private String d18Out;
	@Enumerated(EnumType.STRING)
	private Attendance d19;
	private String d19In;
	private String d19Out;
	@Enumerated(EnumType.STRING)
	private Attendance d20;
	private String d20In;
	private String d20Out;
	@Enumerated(EnumType.STRING)
	private Attendance d21;
	private String d21In;
	private String d21Out;
	@Enumerated(EnumType.STRING)
	private Attendance d22;
	private String d22In;
	private String d22Out;
	@Enumerated(EnumType.STRING)
	private Attendance d23;
	private String d23In;
	private String d23Out;
	@Enumerated(EnumType.STRING)
	private Attendance d24;
	private String d24In;
	private String d24Out;
	@Enumerated(EnumType.STRING)
	private Attendance d25;
	private String d25In;
	private String d25Out;
	@Enumerated(EnumType.STRING)
	private Attendance d26;
	private String d26In;
	private String d26Out;
	@Enumerated(EnumType.STRING)
	private Attendance d27;
	private String d27In;
	private String d27Out;
	@Enumerated(EnumType.STRING)
	private Attendance d28;
	private String d28In;
	private String d28Out;
	@Enumerated(EnumType.STRING)
	private Attendance d29;
	private String d29In;
	private String d29Out;
	@Enumerated(EnumType.STRING)
	private Attendance d30;
	private String d30In;
	private String d30Out;
	@Enumerated(EnumType.STRING)
	private Attendance d31;
	private String d31In;
	private String d31Out;
	@Enumerated(EnumType.STRING)
	private Status status;
	@Enumerated(EnumType.STRING)
	private Status verified;
	private Long verifiedBy;
	private Long editedBy;
	private Long createdBy;
	private Timestamp stamp;
}
