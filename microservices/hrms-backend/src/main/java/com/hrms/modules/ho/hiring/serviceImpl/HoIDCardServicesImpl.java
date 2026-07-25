package com.hrms.modules.ho.hiring.serviceImpl;

import com.hrms.modules.ho.hiring.models.HoIDCard;
import com.hrms.modules.ho.hiring.models.HoStaff;
import com.hrms.modules.ho.hiring.models.HoStaffArea;
import com.hrms.modules.ho.hiring.repository.HoIDCardRepo;
import com.hrms.modules.ho.hiring.repository.HoStaffAreaRepo;
import com.hrms.modules.ho.hiring.repository.HoStaffRepo;
import com.hrms.modules.ho.hiring.service.HoIDCardServices;
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
public class HoIDCardServicesImpl implements HoIDCardServices {

	@Autowired
	private HoIDCardRepo idRepo;
	@Autowired
	private HoStaffRepo staffRepo;
	@Autowired
	private HoStaffAreaRepo areaRepo;

	@Override
	public String approveAndGenerateId(Long staffId, Long userId) {
		Optional<HoStaff> optionalStaff = staffRepo.findById(staffId);
		if (optionalStaff.isPresent()) {
			HoStaff staff = optionalStaff.get();
			staff.setIsIdGenrated(Status.TRUE);
			staff.setIdStatus(Status.ACTIVE);
			staff.setVerified(Status.VERIFIED);
			staff.setIsOfferGenrated(Status.TRUE);
			staff.setApprovBy(userId);
			HoStaff savedStaff = staffRepo.save(staff);

			if (savedStaff != null) {
				HoStaff s = optionalStaff.get();
				HoIDCard oldCard = idRepo.findByEmpNo(s.getEmpNo());
				if (oldCard != null) {
					HoIDCard card = new HoIDCard();
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
					HoStaffArea area = areaRepo.findByStaff(staffId).get(0);
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
	    HoStaff staff = staffRepo.findById(staffId).orElse(null);
	    if (staff == null) {
	        return Result.NOT_FOUND.toString();
	    }

	    if (!isValidStaff(staff) || idRepo.existsByStaffId(staffId)) {
	        return Result.INVALID_ACTION.toString();
	    }

	    return generateAndSaveIdCard(staff, userId);
	}

	private boolean isValidStaff(HoStaff staff) {
	    return Status.ACTIVE.equals(staff.getActive()) &&
	           Status.VERIFIED.equals(staff.getVerified()) &&
	           Status.TRUE.equals(staff.getIsOfferGenrated());
	}

	public String generateAndSaveIdCard(HoStaff staff, Long userId) {
	    // Create a new IDCard
	    HoIDCard card = new HoIDCard();
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
	public List<HoIDCard> allActiveCards() {
		return idRepo.findAllActiveCard();
	}

	@Override
	public HoIDCard findByEmpNo(String empNo) {
		HoIDCard foundId = idRepo.findByEmpNo(empNo);
		return foundId;
	}

	@Override
	public List<HoIDCard> getAllUnActiveIDCard() {
		return idRepo.findDeactiveCards();
	}

	@Override
	public String increaseCount(List<Long> cardId) {
		for (Long id : cardId) {
			HoIDCard card = idRepo.findById(id).get();
			card.setPrintCount(card.getPrintCount() + 1);
			idRepo.save(card);
		}

		return Result.SUCCESS.toString();
	}


	@Override
	public String updateIdDetails(Long staffId, Long cardId) {
	    // Fetch the staff and ID card objects
	    Optional<HoStaff> staffOpt = staffRepo.findById(staffId);
	    Optional<HoIDCard> cardOpt = idRepo.findById(cardId);
	    
	    // Check if both objects are present
	    if (staffOpt.isPresent() && cardOpt.isPresent()) {
	        HoStaff staff = staffOpt.get();
	        HoIDCard card = cardOpt.get();
	        
	        // Check if the staff ID is different and if a record with the new staff ID already exists

	            HoIDCard existingCard = idRepo.findBystaff_id(staffId);
	            if (existingCard!=null) {
					existingCard.setEmpNo(staff.getEmpNo());
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
	            }

	      
	    }else {
			return Result.ALLREADY_EXISTS.toString();
		}
	    
	    return Result.WENT_WRONG.toString();
	}



	@Override
	public List<HoIDCard> idByStaffsIds(List<Long> ids) {
		if (ids == null || ids.isEmpty()) {
			return new ArrayList<>();
		}

		// Fetch all IDCards for the given list of IDs in one query
		List<HoIDCard> foundIDCards = idRepo.findByStaffIds(ids);

		return foundIDCards;
	}

}
