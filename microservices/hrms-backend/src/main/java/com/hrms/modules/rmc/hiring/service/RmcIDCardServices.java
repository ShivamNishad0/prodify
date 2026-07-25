package com.hrms.modules.rmc.hiring.service;

import com.hrms.modules.rmc.hiring.models.RmcIDCard;

import java.util.List;

public interface RmcIDCardServices {
	 public String approveAndGenerateId(Long staffId, Long userId);
	 
	 public String generateIdOnly(Long staffId, Long userId);
	 
	 public List<RmcIDCard> allActiveCards();
	 
	 public RmcIDCard findByEmpNo(String empNo);
	 
	 public List<RmcIDCard> getAllUnActiveIDCard();
	 
	 public String increaseCount(List <Long>cardId);
	 
	 public String updateIdDetails(Long staffId, Long cardId);
	 
	 public List<RmcIDCard> idByStaffsIds(List<Long>ids);
}
