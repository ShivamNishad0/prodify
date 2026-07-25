package com.hrms.modules.auth.models;


import java.sql.Date;
import java.sql.Timestamp;

import com.hrms.modules.utilsServics.Status;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class CompanyProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String address;
    private String phoneNumber;
    private String email;
    private String website;
    private String industry;
    private int numberOfEmployees;
    private Date establishedDate;
    private String ceo;
    private String description;
    private String gstNo;
    private String cinNo;
    private String tinNo;
    private Long zoneId;
    private Timestamp stamp;
    private Long createdBy;
    @Enumerated(EnumType.STRING)
    private Status status;
}
