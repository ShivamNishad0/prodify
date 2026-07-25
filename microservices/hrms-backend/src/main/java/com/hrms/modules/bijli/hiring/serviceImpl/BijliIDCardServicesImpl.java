package com.hrms.modules.bijli.hiring.serviceImpl;

import com.hrms.modules.bijli.hiring.models.BijliIDCard;
import com.hrms.modules.bijli.hiring.models.BijliStaff;
import com.hrms.modules.bijli.hiring.models.BijliStaffArea;
import com.hrms.modules.bijli.hiring.repository.BijliIDCardRepo;
import com.hrms.modules.bijli.hiring.repository.BijliStaffAreaRepo;
import com.hrms.modules.bijli.hiring.repository.BijliStaffRepo;
import com.hrms.modules.bijli.hiring.service.BijliIDCardServices;
import com.hrms.modules.utilsServics.Result;
import com.hrms.modules.utilsServics.Status;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class BijliIDCardServicesImpl implements BijliIDCardServices {

    @Autowired
    private BijliIDCardRepo idRepo;
    @Autowired
    private BijliStaffRepo staffRepo;
    @Autowired
    private BijliStaffAreaRepo areaRepo;

    @Override
    public String approveAndGenerateId(Long staffId, Long userId) {
        Optional<BijliStaff> optionalStaff = staffRepo.findById(staffId);
        if (optionalStaff.isPresent()) {
            BijliStaff staff = optionalStaff.get();
            staff.setIsIdGenrated(Status.TRUE);
            staff.setIdStatus(Status.ACTIVE);
            staff.setVerified(Status.VERIFIED);
            staff.setIsOfferGenrated(Status.TRUE);
            staff.setApprovBy(userId);
            BijliStaff savedStaff = staffRepo.save(staff);

            if (savedStaff != null) {
                BijliStaff s = optionalStaff.get();
                BijliIDCard oldCard = idRepo.findByEmpNo(s.getEmpNo());
                if (oldCard != null) {
                    BijliIDCard card = new BijliIDCard();
                    card.setEmpNo(savedStaff.getTempEmp());
                    card.setName(savedStaff.getName());
                    card.setPost(savedStaff.getDesigId().toString());
                    card.setDob(savedStaff.getDob().toString());
                    card.setFname(savedStaff.getFname());
                    card.setStaffImg(savedStaff.getStaffImg());
                    card.setMobNo(savedStaff.getContactNo());
                    LocalDate currentDate = LocalDate.now();
                    card.setGenerationDate(currentDate);
                    card.setValidUpto(currentDate.plusDays(90).toString());
                    card.setAddress(savedStaff.getPaddress());
                    card.setStaffId(staffId);
                    BijliStaffArea area = areaRepo.findByStaff(staffId).get(0);
                    card.setAreaId(area.getAreaId());
                    card.setStatus(Status.ACTIVE);
                    card.setGeneratedBy(userId);
                    Timestamp currentTimestamp = new Timestamp(System.currentTimeMillis());
                    card.setStamp(currentTimestamp);

                    idRepo.save(card);
                    return Result.SUCCESS.toString();
                }
                return Result.ALLREADY_EXISTS.toString();
            }
        }
        return Result.WENT_WRONG.toString();
    }

    @Override
    public String generateIdOnly(Long staffId, Long userId) {
        BijliStaff staff = staffRepo.findById(staffId).orElse(null);
        if (staff == null) {
            return Result.NOT_FOUND.toString();
        }

        if (!isValidStaff(staff) || idRepo.existsByStaffId(staffId)) {
            return Result.INVALID_ACTION.toString();
        }

        return generateAndSaveIdCard(staff, userId);
    }

    private boolean isValidStaff(BijliStaff staff) {
        return Status.ACTIVE.equals(staff.getActive()) &&
                Status.VERIFIED.equals(staff.getVerified()) &&
                Status.TRUE.equals(staff.getIsOfferGenrated());
    }

    public String generateAndSaveIdCard(BijliStaff staff, Long userId) {
        // Create a new IDCard
        BijliIDCard card = new BijliIDCard();
        card.setEmpNo(staff.getTempEmp());
        card.setName(staff.getName());
        card.setPost(staff.getDesigId().toString());
        card.setDob(staff.getDob());
        card.setFname(staff.getFname());
        card.setStaffImg(staff.getStaffImg());
        card.setMobNo(staff.getContactNo());
        LocalDate currentDate = LocalDate.now();
        card.setGenerationDate(currentDate);
        card.setValidUpto(currentDate.plusDays(90).toString());
        card.setAddress(staff.getPaddress());
        card.setTempEmp(staff.getTempEmp());
        card.setStaffId(staff.getStaffId());
        card.setAreaId(areaRepo.findById(staff.getAreaId()).orElseThrow().getAreaId());
        card.setStatus(Status.ACTIVE);
        card.setGeneratedBy(userId);
        card.setStamp(new Timestamp(System.currentTimeMillis()));
        card.setPrintCount(0L); // Directly set to 0L

        // Update staff status
        staff.setIsIdGenrated(Status.TRUE);

        // Save both the updated staff and the new IDCard
        staffRepo.save(staff);
        idRepo.save(card);

        return Result.SUCCESS.toString();
    }

    @Override
    public List<BijliIDCard> allActiveCards() {
        return idRepo.findAllActiveCard();
    }

    @Override
    public BijliIDCard findByEmpNo(String empNo) {
        BijliIDCard foundId = idRepo.findByEmpNo(empNo);
        return foundId;
    }

    @Override
    public List<BijliIDCard> getAllUnActiveIDCard() {
        return idRepo.findDeactiveCards();
    }

    @Override
    public String increaseCount(List<Long> cardId) {
        for (Long id : cardId) {
            BijliIDCard card = idRepo.findById(id).get();
            card.setPrintCount(card.getPrintCount() + 1);
            idRepo.save(card);
        }

        return Result.SUCCESS.toString();
    }


    @Override
    public String updateIdDetails(Long staffId, Long cardId) {
        // Fetch the staff and ID card objects
        Optional<BijliStaff> staffOpt = staffRepo.findById(staffId);

        // Check if both objects are present

        BijliStaff staff = staffOpt.get();

        BijliIDCard existingCard = idRepo.findBystaff_id(staffId);
        if (existingCard != null) {
            existingCard.setEmpNo(staff.getTempEmp());
            existingCard.setName(staff.getName());
            existingCard.setPost(staff.getDesigId() != null ? staff.getDesigId().toString() : "");
            existingCard.setDob(staff.getDob() != null ? staff.getDob().toString() : "");
            existingCard.setStaffImg(staff.getStaffImg());
            existingCard.setFname(staff.getFname());
            existingCard.setMobNo(staff.getContactNo());
            existingCard.setAddress(staff.getPaddress());
            existingCard.setStaffId(staffId);
            existingCard.setAreaId(staff.getAreaId());

            // Save the updated ID card
            idRepo.save(existingCard);
            return Result.SUCCESS.toString();
        } else {
            return Result.ALLREADY_EXISTS.toString();
        }


//        return Result.WENT_WRONG.toString();
    }


    @Override
    public List<BijliIDCard> idByStaffsIds(List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return new ArrayList<>();
        }

        // Fetch all IDCards for the given list of IDs in one query
        List<BijliIDCard> foundBijliIDCards = idRepo.findByStaffIds(ids);

        return foundBijliIDCards;
    }

}
