package com.hrms.modules.dmc.hiring.service;

import com.hrms.modules.dmc.hiring.models.DmcIDCard;

import java.util.List;

public interface DmcIDCardServices {
	 public String approveAndGenerateId(Long staffId, Long userId);
	 
	 public String generateIdOnly(Long staffId, Long userId);
	 
	 public List<DmcIDCard> allActiveCards();
	 
	 public DmcIDCard findByEmpNo(String empNo);
	 
	 public List<DmcIDCard> getAllUnActiveIDCard();
	 
	 public String increaseCount(List <Long>cardId);
	 
	 public String updateIdDetails(Long staffId, Long cardId);
	 
	 public List<DmcIDCard> idByStaffsIds(List<Long>ids);
}
