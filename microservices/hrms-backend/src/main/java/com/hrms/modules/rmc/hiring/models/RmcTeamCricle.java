package com.hrms.modules.rmc.hiring.models;

import com.hrms.modules.utilsServics.Status;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(schema = "rmc")
public class RmcTeamCricle {
	 @Id
	 @GeneratedValue(strategy = GenerationType.IDENTITY)
	 private Long circleId;
	 private Long deptId;
	 private Long teamLead;
	 private Long teamManageBy;
	 private Status status;
	 
}
