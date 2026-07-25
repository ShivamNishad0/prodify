package com.hrms.modules.ho.payroll.modles;

import com.hrms.modules.utilsServics.Status;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.sql.Date;
import java.sql.Timestamp;

@Data
@Getter
@Setter
@Entity
@Table(schema = "ho")
public class HoStaffLeaves {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long leaveId;
	private Long staffId;
	private String empNo;
	private Date fromDate;
	private Date toDate;
	private Long totalDay;
	@Enumerated(EnumType.STRING)
	private Status leaveStatus;
	private String leaveType;
	private Long createdBy;
	private Long assignBy;
	private Long approvedBy;
	private String comments;
	private Long rejectedBy;
	private Long cancledBy;
	private Timestamp stamp;
	
}
