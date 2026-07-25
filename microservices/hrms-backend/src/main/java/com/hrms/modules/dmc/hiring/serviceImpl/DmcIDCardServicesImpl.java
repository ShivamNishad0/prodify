package com.hrms.modules.dmc.hiring.serviceImpl;

import com.hrms.modules.dmc.hiring.models.DmcIDCard;
import com.hrms.modules.dmc.hiring.models.DmcStaff;
import com.hrms.modules.dmc.hiring.models.DmcStaffArea;
import com.hrms.modules.dmc.hiring.repository.DmcIDCardRepo;
import com.hrms.modules.dmc.hiring.repository.DmcStaffAreaRepo;
import com.hrms.modules.dmc.hiring.repository.DmcStaffRepo;
import com.hrms.modules.dmc.hiring.service.DmcIDCardServices;
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
public class DmcIDCardServicesImpl implements DmcIDCardServices {

	@Autowired
	private DmcIDCardRepo idRepo;
	@Autowired
	private DmcStaffRepo staffRepo;
	@Autowired
	private DmcStaffAreaRepo areaRepo;

	@Override
	public String approveAndGenerateId(Long staffId, Long userId) {
		Optional<DmcStaff> optionalStaff = staffRepo.findById(staffId);
		if (optionalStaff.isPresent()) {
			DmcStaff staff = optionalStaff.get();
			staff.setIsIdGenrated(Status.TRUE);
			staff.setIdStatus(Status.ACTIVE);
			staff.setVerified(Status.VERIFIED);
			staff.setIsOfferGenrated(Status.TRUE);
			staff.setApprovBy(userId);
			DmcStaff savedStaff = staffRepo.save(staff);

			if (savedStaff != null) {
				DmcStaff s = optionalStaff.get();
				DmcIDCard oldCard = idRepo.findByEmpNo(s.getEmpNo());
				if (oldCard != null) {
					DmcIDCard card = new DmcIDCard();
					card.setEmpNo(savedStaff.getEmpNo());
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
					DmcStaffArea area = areaRepo.findByStaff(staffId).get(0);
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
	    DmcStaff staff = staffRepo.findById(staffId).orElse(null);
	    if (staff == null) {
	        return Result.NOT_FOUND.toString();
	    }

	    if (!isValidStaff(staff) || idRepo.existsByStaffId(staffId)) {
	        return Result.INVALID_ACTION.toString();
	    }

	    return generateAndSaveIdCard(staff, userId);
	}

	private boolean isValidStaff(DmcStaff staff) {
	    return Status.ACTIVE.equals(staff.getActive()) &&
	           Status.VERIFIED.equals(staff.getVerified()) &&
	           Status.TRUE.equals(staff.getIsOfferGenrated());
	}

	public String generateAndSaveIdCard(DmcStaff staff, Long userId) {
	    // Create a new IDCard
	    DmcIDCard card = new DmcIDCard();
	    card.setEmpNo(staff.getEmpNo());
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
	public List<DmcIDCard> allActiveCards() {
		return idRepo.findAllActiveCard();
	}

	@Override
	public DmcIDCard findByEmpNo(String empNo) {
		DmcIDCard foundId = idRepo.findByEmpNo(empNo);
		return foundId;
	}

	@Override
	public List<DmcIDCard> getAllUnActiveIDCard() {
		return idRepo.findDeactiveCards();
	}

	@Override
	public String increaseCount(List<Long> cardId) {
		for (Long id : cardId) {
			DmcIDCard card = idRepo.findById(id).get();
			card.setPrintCount(card.getPrintCount() + 1);
			idRepo.save(card);
		}

		return Result.SUCCESS.toString();
	}


	@Override
	public String updateIdDetails(Long staffId, Long cardId) {
	    // Fetch the staff and ID card objects
	    Optional<DmcStaff> staffOpt = staffRepo.findById(staffId);
	    Optional<DmcIDCard> cardOpt = idRepo.findById(cardId);
	    
	    // Check if both objects are present
	    if (staffOpt.isPresent() && cardOpt.isPresent()) {
	        DmcStaff staff = staffOpt.get();
	        DmcIDCard card = cardOpt.get();
	        
	        // Check if the staff ID is different and if a record with the new staff ID already exists
	        if (!card.getStaffId().equals(staffId)) {
	            Optional<DmcIDCard> existingCard = idRepo.findBystaff_id(staffId);
	            if (existingCard.isPresent()) {
	            	// Update the ID card details
	            	DmcIDCard foundCard = existingCard.get();
	            	foundCard.setEmpNo(staff.getEmpNo());
	            	foundCard.setName(staff.getName());
	            	foundCard.setPost(staff.getDesigId() != null ? staff.getDesigId().toString() : "");
	            	foundCard.setDob(staff.getDob() != null ? staff.getDob().toString() : "");
	            	foundCard.setStaffImg(staff.getStaffImg());
	            	foundCard.setFname(staff.getFname());
	            	foundCard.setMobNo(staff.getContactNo());
	            	foundCard.setAddress(staff.getPaddress());
	            	foundCard.setStaffId(staffId);
	            	foundCard.setAreaId(staff.getAreaId());
	    	        
	    	        // Save the updated ID card
	    	        idRepo.save(foundCard);
	                return Result.SUCCESS.toString(); 
	            }
	        }
	      
	    }
	    
	    return Result.WENT_WRONG.toString();
	}



	@Override
	public List<DmcIDCard> idByStaffsIds(List<Long> ids) {
		if (ids == null || ids.isEmpty()) {
			return new ArrayList<>();
		}

		// Fetch all IDCards for the given list of IDs in one query
		List<DmcIDCard> foundIDCards = idRepo.findByStaffIds(ids);

		return foundIDCards;
	}

}
