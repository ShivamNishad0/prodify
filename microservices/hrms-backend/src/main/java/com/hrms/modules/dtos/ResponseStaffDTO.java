package com.hrms.modules.dtos;

import lombok.*;

import java.sql.Date;
import java.sql.Timestamp;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Data
public class ResponseStaffDTO {
	private Long desigId;
	private String staffId;
	private String name;
	private String fname;
	private String dob;
	private int age;
	private String gender;
	private String nationality;
	private String maritalStatus;
	private String contactNo;
	private String paddress;
	private String caddress;
	private String email;
	private String staffImg;
	private List<QualificationDTO> quali;
	private List<StaffExprienceDTOS>exp;
	private StaffAreaDTO area;
	private String aadharNo;
	private String panCard;
	private String bankDoc;
	private String isOfferGenrated;
	private String empNo;
	private String panFrontDoc;
	private String panBackDoc;
	private String addharFrontDoc;
	private String addharBackDoc;
	private String bloodGroup;
	private String dlNo;
	private Date dlExpDate;
	private String isIdGenrated;
	private String accountNumber;
	private String bankName;
	private String branch;
	private String ifscCode;
	private String approvBy;
	private String exEmp;
	private String idCopy;
	private String declaration;
	private Date filledDate;
	private String place;
	private String active;
	private String verified;
	private String emergencyRelation;
	private String emergencyMobile;
	private String street1;
	private String street2;
	private String city;
	private String state;
	private String pincode;
	private String pstreet1;
	private String pstreet2;
	private String pcity;
	private String pstate;
	private String ppincode;
	private String jobSpecification;
	private String jobCat;
	private String contractStartDate;
	private String contractEndDate;
	private String idStatus;
	private String characterDoc;
	private String tempEmp;
	private Long filledBy;
	private String offerGenDate;
	private String departmentId;
	private String offerGenBy;
	private String isAssetGenrated;
	private String isCharaterVerified;
	private String dateOfJoining;
	private Long salaryStructureId;
	private Timestamp stamp;
}
