package com.hrms.modules.utilsServics;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import java.time.Period;

import com.hrms.modules.ho.hiring.models.HoIDCard;
import com.hrms.modules.ho.hiring.models.HoStaff;
import com.hrms.modules.ho.hiring.repository.HoIDCardRepo;
import com.hrms.modules.ho.hiring.repository.HoStaffRepo;
import java.time.LocalDate;
import java.util.List;
import java.time.format.DateTimeFormatter;

@Component
public class IDCardStatusUpdater {
	@Autowired
	private HoIDCardRepo idCardRepo;
	@Autowired
	private HoStaffRepo staffRepo;

//	    @Scheduled(cron = "0 0 0 * * ?") 

	public String updateIDCardStatus() {
		LocalDate currentDate = LocalDate.now();
		List<HoIDCard> idCards = idCardRepo.findAll();

		if (idCards != null && !idCards.isEmpty()) {
			for (HoIDCard idCard : idCards) {
				// Retrieve staff details
				HoStaff staff = staffRepo.findByEmpId(idCard.getEmpNo());

				// Check if character is verified
				if (staff.getIsCharaterVerified() != Status.VERIFIED) {

					Period period = Period.between(staff.getFilledDate().toLocalDate(), currentDate);

					
					if (period.getDays() > 30) {
						staff.setIsCharaterVerified(Status.INACTIVE);
						staff.setActive(Status.INACTIVE);
						staff.setVerified(Status.UNVERIFIED);
						staffRepo.save(staff);
						idCard.setStatus(Status.INACTIVE);
						idCardRepo.save(idCard);

						System.out.println("Status updated to INACTIVE for IDCard with empNo: " + idCard.getEmpNo());
					}
				}
			}
			return Result.SUCCESS.toString();
		}
		return Result.NOT_FOUND.toString();
	}

	public static LocalDate convertStringToLocalDate(String dateStr, String pattern) {
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern(pattern);
		return LocalDate.parse(dateStr, formatter);
	}
}
