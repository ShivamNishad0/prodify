package com.hrms.modules.dtos;


import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Data
public class NewAssetDTO {
	private String leaderName;
	private String assetId;
	private String areaOfStaff;
	private String modelNo;
	private String deviceSlNo;
	private String reciverName;
	private String empNo;
	private Long staffId;
	private String ram;
	private String hardDisk;
	private String remarks;
	private String issuer;
}
