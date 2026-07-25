package com.hrms.modules.rmc.hiring.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.sql.Date;
import java.sql.Timestamp;

@Setter
@Getter
@Entity
@Table(schema = "rmc")
public class RmcRemovedStaffs {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long rmcrsId;
    private Long staffId;
    private Long removedBy;
    private Long sallaryStructureId;
    private Long areaId;
    private String month;
    private String year;
    private String empNo;
    private String lastWorkingDay;
    private Timestamp timeStamp;
}
