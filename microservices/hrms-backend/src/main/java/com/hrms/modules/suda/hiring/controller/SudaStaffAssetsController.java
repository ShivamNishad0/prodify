package com.hrms.modules.suda.hiring.controller;

import com.hrms.modules.dtos.NewAssetDTO;
import com.hrms.modules.suda.hiring.models.SudaStaffAssests;
import com.hrms.modules.suda.hiring.service.SudaStaffAssestsService;
import com.hrms.modules.utilsServics.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api/spshrm/suda/staff-assets")
public class SudaStaffAssetsController {
	@Autowired
	private SudaStaffAssestsService staffAssetsService;

	@PostMapping("/allot-new")
    public ResponseEntity<String> createAssetChalan(@RequestBody NewAssetDTO assets) {
        String result = staffAssetsService.createAssetChalan(assets);
        if (Result.SUCCESS.toString().equals(result)) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
        }
    }

	@GetMapping("/staff/{staffId}")
	public ResponseEntity<List<SudaStaffAssests>> findByStaff(@PathVariable String staffId) {
		List<SudaStaffAssests> assetsList = staffAssetsService.findByStaff(Long.parseLong(decoder(staffId)));
		return assetsList.isEmpty() ? new ResponseEntity<>(HttpStatus.NOT_FOUND)
				: new ResponseEntity<>(assetsList, HttpStatus.OK);
	}

	@PutMapping("/{assetId}")
	public ResponseEntity<String> updateStaffAsset(@PathVariable String assetId,
			@RequestBody SudaStaffAssests newAssetDetails) {
		
			String result = staffAssetsService.updateStaffAsset(Long.parseLong(decoder(assetId)), newAssetDetails);
			if(result.equals(Result.SUCCESS.toString())) {				
				return new ResponseEntity<>(result, HttpStatus.OK);
			}
			if(result.equals(Result.WENT_WRONG.toString())) {				
				return new ResponseEntity<>(result, HttpStatus.INTERNAL_SERVER_ERROR);
			}
			return new ResponseEntity<>(result, HttpStatus.NO_CONTENT);

		
	}
	
	@DeleteMapping("/{assetId}")
	public ResponseEntity<String> removeStaffAsset(@PathVariable String assetId) {
		String result = staffAssetsService.deleteAsset(Long.parseLong(decoder(assetId)));
		return new ResponseEntity<>(result, HttpStatus.OK);
	}
	 public String decoder(String content) {
	    	byte[] decodedBytes = Base64.getDecoder().decode(content);
	    	return new String(decodedBytes, StandardCharsets.UTF_8);
	    }
}
