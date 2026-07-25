package com.hrms.modules.auth.serviceImpl;

import com.hrms.modules.auth.models.Users;
import com.hrms.modules.auth.models.Zone;
import com.hrms.modules.auth.repositories.UserRepository;
import com.hrms.modules.auth.repositories.ZoneRepo;
import com.hrms.modules.auth.service.ZoneService;
import com.hrms.modules.utilsServics.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ZoneServiceImpl implements ZoneService {

    @Autowired
    private ZoneRepo zoneRepo;
    @Autowired
    private UserRepository userRepo;

    @Override
    public String createZone(Zone zone, Long userId) {
        Users foundUser = userRepo.findById(userId).get();
        Zone savedZone = zoneRepo.save(zone);
        foundUser.setZoneId(savedZone.getZoneId());
        userRepo.save(foundUser);
        return savedZone!=null? Result.SUCCESS.toString():Result.WENT_WRONG.toString();
    }

    @Override
    public String editZone(Long zoneId,Zone zone) {
        Zone foundZone = zoneRepo.findById(zoneId).get();
        foundZone.setDescription(zone.getDescription());
        foundZone.setZoneAddress(zone.getZoneAddress());
        foundZone.setZoneName(zone.getZoneName());
        foundZone.setZoneNumber(zone.getZoneNumber());
        Zone savedZone = zoneRepo.save(foundZone);
        return savedZone!=null?Result.SUCCESS.toString():Result.WENT_WRONG.toString();
    }

    @Override
    public List<Zone> allZones(){
        List<Zone> allZone = zoneRepo.findAll();
        return allZone;
    }
}
