package com.hrms.modules.dmc.hiring.models;


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
@Table(schema = "dmc")
public class DmcDesignations {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long desigId;
    private String desigName;
    @Enumerated(EnumType.STRING)
    private Status status; 
}
