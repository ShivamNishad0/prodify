package com.hrms.modules.dtos;


import com.hrms.modules.auth.security.UserRequestDTO;
import com.hrms.modules.utilsServics.Status;
import lombok.*;

import java.sql.Date;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Data
public class NewStaffDTO {
	private Long desigId;
	private String name;
	private String fname;
	private String dob;
	private String age;
	private String gender;
	private String nationality;
	private String maritalStatus;
	private String contactNo;
	private String paddress;
	private String caddress;
	private String email;
	private String staffImgName;
	private UserRequestDTO user;
	private Long areaId;
	private String aadharNo;
	private String panCard;
	private String bankDocName;
	private String panFrontDocName;
	private String panBackDocName;
	private String addharFrontDocName;
	private String addharBackDocName;
	private String bloodGroup;
	private String accountNumber;
	private String bankName;
	private String branch;
	private String ifscCode;
	private String dlNo;
	private Date dlExpDate;
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
	private String approvBy;
	private String characterDocName;
	private String exEmp;
	private String idCopy;
	private String declaration;
	private String filledDate;
	private Long departmentId;
	private String dateOfJoining;
	private String place;
	private String filledBy;
	private Long zoneId;
	private List<StaffExprienceDTOS> exp;
	private Long salaryStructureId;
	private String tempEmp;
	private Status isOfferGenrated;
	private Status isIdGenrated;
	private Status verified;
	private Status idStatus;
}
