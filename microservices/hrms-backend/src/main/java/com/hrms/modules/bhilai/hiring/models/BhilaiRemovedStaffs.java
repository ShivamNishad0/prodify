package com.hrms.modules.bhilai.hiring.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Date;
import java.sql.Timestamp;

@Setter
@Getter
@Entity
@Table(schema = "bhilai")
public class BhilaiRemovedStaffs {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long brsId;
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
