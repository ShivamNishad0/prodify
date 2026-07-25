package com.hrms.modules.rmc.payroll.modles;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data
@Entity
@Table(schema = "rmc")
public class RmcAssest {

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private Long assetId;
	private String assetName;
	
}
