package com.hrms.modules.suda.payroll.controller;

import com.hrms.modules.suda.payroll.modles.SudaAssest;
import com.hrms.modules.suda.payroll.service.SudaStaffAssestService;
import com.hrms.modules.utilsServics.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api/spshrm/suda/assets")
public class SudaStaffAssestController {
	@Autowired
	private SudaStaffAssestService assetService;

	@PostMapping("/new-asset")
	public ResponseEntity<String> createNewAsset(@RequestBody SudaAssest asset) {
		String result = assetService.createNewAsset(asset);
		if (Result.SUCCESS.toString().equals(result)) {
			return new ResponseEntity<>(result, HttpStatus.CREATED);
		} else {
			return new ResponseEntity<>(result, HttpStatus.CONFLICT);
		}
	}

	@PutMapping("/{assetId}")
	public ResponseEntity<String> updateAsset(@PathVariable Long assetId, @RequestBody SudaAssest asset) {
		String result = assetService.updateAsset(assetId, asset);
		if (Result.SUCCESS.toString().equals(result)) {
			return new ResponseEntity<>(result, HttpStatus.OK);
		} else {
			return new ResponseEntity<>(result, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping("/{assetId}")
	public ResponseEntity<SudaAssest> getByAssetId(@PathVariable Long assetId) {
		SudaAssest foundAsset = assetService.getByassetId(assetId);
		if (foundAsset != null) {
			return new ResponseEntity<>(foundAsset, HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

	@GetMapping("/all-asset")
	public ResponseEntity<List<SudaAssest>> getAllAssets() {
		List<SudaAssest> foundAssets = assetService.getAllAsset();
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
