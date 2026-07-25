package com.hrms.modules.dmc.payroll.modles;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data
@Entity
@Table(schema = "dmc")
public class DmcAssest {

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private Long assetId;
	private String assetName;
	
}
