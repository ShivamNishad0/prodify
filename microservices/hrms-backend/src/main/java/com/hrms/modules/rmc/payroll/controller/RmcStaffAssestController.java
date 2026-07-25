package com.hrms.modules.rmc.payroll.controller;

import com.hrms.modules.rmc.payroll.modles.RmcAssest;
import com.hrms.modules.rmc.payroll.service.RmcStaffAssestService;
import com.hrms.modules.utilsServics.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api/spshrm/rmc/assets")
public class RmcStaffAssestController {
	@Autowired
	private RmcStaffAssestService assetService;

	@PostMapping("/new-asset")
	public ResponseEntity<String> createNewAsset(@RequestBody RmcAssest asset) {
		String result = assetService.createNewAsset(asset);
		if (Result.SUCCESS.toString().equals(result)) {
			return new ResponseEntity<>(result, HttpStatus.CREATED);
		} else {
			return new ResponseEntity<>(result, HttpStatus.CONFLICT);
		}
	}

	@PutMapping("/{assetId}")
	public ResponseEntity<String> updateAsset(@PathVariable Long assetId, @RequestBody RmcAssest asset) {
		String result = assetService.updateAsset(assetId, asset);
		if (Result.SUCCESS.toString().equals(result)) {
			return new ResponseEntity<>(result, HttpStatus.OK);
		} else {
			return new ResponseEntity<>(result, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping("/{assetId}")
	public ResponseEntity<RmcAssest> getByAssetId(@PathVariable Long assetId) {
		RmcAssest foundAsset = assetService.getByassetId(assetId);
		if (foundAsset != null) {
			return new ResponseEntity<>(foundAsset, HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

	@GetMapping("/all-asset")
	public ResponseEntity<List<RmcAssest>> getAllAssets() {
		List<RmcAssest> foundAssets = assetService.getAllAsset();
		if (foundAssets != null && !foundAssets.isEmpty()) {
			return new ResponseEntity<>(foundAssets, HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		}
	}

	@DeleteMapping("/{assetId}")
	public ResponseEntity<String> deleteAsset(@PathVariable Long assetId) {
		assetService.deleteAsset(assetId);
		return new ResponseEntity<>(Result.SUCCESS.toString(), HttpStatus.OK);
	}
}
