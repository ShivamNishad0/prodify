package com.hrms.modules.auth.repositories;

import com.hrms.modules.auth.models.Zone;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ZoneRepo extends JpaRepository<Zone,Long> {

}
