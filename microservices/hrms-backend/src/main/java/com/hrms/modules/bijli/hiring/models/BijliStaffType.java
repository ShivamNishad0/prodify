package com.hrms.modules.bijli.hiring.models;

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
@Table(schema = "bijli")
public class BijliStaffType {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long staffTypeID;
	private String stafType;
	private String isFieldWorker;
	private String isOfficeWorker;
	private String other;
	private String remarks;
	@Enumerated(EnumType.STRING)
	private Status status;
}
