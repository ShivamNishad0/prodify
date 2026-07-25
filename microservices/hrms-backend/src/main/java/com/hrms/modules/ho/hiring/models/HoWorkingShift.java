package com.hrms.modules.ho.hiring.models;

import com.hrms.modules.utilsServics.Status;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(schema = "ho")
public class HoWorkingShift {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long shiftId;
    private String shiftName;
    private String shiftStart;
    private String shifEnd;
    private String shiftStartDate;
    private String shiftEndDate;
    private Long shiftIssuedBy;
    @Enumerated(EnumType.STRING)
    private Status status; 
}
