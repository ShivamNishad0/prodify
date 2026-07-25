package com.hrms.modules.dtos;


import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Data
public class GetStaffAndStaffCountDTO {
private Long count;
private List<?> results;
}
