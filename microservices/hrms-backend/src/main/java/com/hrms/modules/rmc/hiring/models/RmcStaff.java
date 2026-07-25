package com.hrms.modules.rmc.hiring.models;

import com.hrms.modules.utilsServics.Status;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Date;
import java.sql.Timestamp;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(schema = "rmc")
public class RmcStaff {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long staffId;
	private Long desigId;
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
	private Long areaId;
	private String aadharNo;
	private String addharFrontDoc;
	private String addharBackDoc;
	private String panCard;
	private String panFrontDoc;
	private String panBackDoc;
	private String bankDoc;
	private String accountNumber;
	private String bankName;
	private String branch;
	private String ifscCode;
	private String exEmp;
	private String idCopy;
	private String declaration;
	private String bloodGroup;
	private Date filledDate;
	@Enumerated(EnumType.STRING)
	private Status active;
	@Column(name = "verified")
	@Enumerated(EnumType.STRING)
	private Status verified;
	@Enumerated(EnumType.STRING)
	private Status idStatus;
	private String characterDoc;
	@Enumerated(EnumType.STRING)
	private Status isOfferGenrated;
	@Enumerated(EnumType.STRING)
	private Status isIdGenrated;
	private String offerGenDate;
	private String offerGenBy;
	private Long approvBy;
	@Enumerated(EnumType.STRING)
	private Status isAssetAlloted;
	private String empNo;
	private Long sampleId;
	private String tempEmp;
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
	private String place;
	private String dateOfJoining;
	@Enumerated(EnumType.STRING)
	private Status isCharaterVerified;
	private Long departmentId;
	private Long filledBy;
	private Timestamp stamp;

}
