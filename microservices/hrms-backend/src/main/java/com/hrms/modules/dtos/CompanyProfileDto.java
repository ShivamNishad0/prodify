package com.hrms.modules.dtos;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CompanyProfileDto {
	private long compnayId;
	private String name;
    private String address;
    private String phoneNumber;
    private String email;
    private String website;
    private String industry;
    private int numberOfEmployees;
    private String establishedDate;
    private String ceo;
    private String description;
    private String gstNo;
    private String cinNo;
    private String tinNo;
    private Long createdBy;
    private Long zoneId;
}
