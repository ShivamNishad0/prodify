package com.hrms.modules.dtos;

import com.hrms.modules.rmc.payroll.modles.RmcAttendanceDeatils;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Data
public class StaffAttendaceDetialDTO {
    private Long count;
    private List<?> result;
}
