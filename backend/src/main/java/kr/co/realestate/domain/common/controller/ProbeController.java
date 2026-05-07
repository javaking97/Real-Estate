package kr.co.realestate.domain.common.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.co.realestate.config.Constant;

@RestController
@RequestMapping(path = {Constant.API_VERSION})
public class ProbeController {
	
	@GetMapping("/probe/readiness")
	public ResponseEntity<String> readinessProbe(){
		return ResponseEntity.ok("success");
	}
	
	
	@GetMapping("/probe/liveness")
	public ResponseEntity<String> livenessProbe(){
		return ResponseEntity.ok("success");
	}

}
