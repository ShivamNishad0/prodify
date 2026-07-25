package com.hrms.modules.bijli.payroll.modles;

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
@Table(schema = "bijli")
public class BijliStaffTargetDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long stId;
    private String month;
    private String year;
    private BigDecimal target=BigDecimal.ZERO;
    private BigDecimal gross;
    private Long staffId;
    private String empNo;
    private String name;
    private  BigDecimal extraAchived=BigDecimal.ZERO;
    private Long ssid;
}
