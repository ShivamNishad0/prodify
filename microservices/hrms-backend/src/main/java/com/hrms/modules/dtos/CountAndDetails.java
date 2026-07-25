package com.hrms.modules.dtos;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CountAndDetails {
    private Integer count;
    private List<?> results;
}
