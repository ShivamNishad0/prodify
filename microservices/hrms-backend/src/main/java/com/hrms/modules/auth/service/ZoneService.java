package com.hrms.modules.auth.service;

import com.hrms.modules.auth.models.Zone;

import java.util.List;

public interface ZoneService {
    public String createZone(Zone zone, Long userId);
    public String editZone(Long zoneId,Zone zone);
    public List<Zone> allZones();
}
