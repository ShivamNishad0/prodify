package com.hrms.modules.dmc.payroll.modles;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(schema = "dmc")
public class DmcStaffTargetDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long stId;
    private String month;
    private String year;
    private BigDecimal target;
    private BigDecimal extraAchived;
    private BigDecimal assignTarget;
    private BigDecimal gross;
    private Long staffId;
    private String empNo;
    private String name;
    private Long ssid;
}
