package com.hrms.modules.dtos;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class TargetResponseDTO {
    private Long count;
    private List<TargetReqToTakeTargetDTO>results;
}
