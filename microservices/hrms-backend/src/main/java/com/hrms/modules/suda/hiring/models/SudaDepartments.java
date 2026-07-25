package com.hrms.modules.suda.hiring.models;

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
@Table(schema = "suda")
public class SudaDepartments {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long depId;
    private String depName;
    @Enumerated(EnumType.STRING)
    private Status status; 
}
