package kr.co.realestate.domain.batch.controller;

import kr.co.realestate.domain.batch.dto.BatchExecutionResponse;
import kr.co.realestate.domain.batch.service.BatchService;
import kr.co.realestate.domain.common.model.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Batch", description = "Batch API")
@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/v1/batch")
@RequiredArgsConstructor
public class BatchController {

    private final BatchService batchService;

    @Operation(summary = "Run template maintenance batch job")
    @PostMapping("/jobs/template-maintenance/run")
    public ResponseEntity<ApiResponse<BatchExecutionResponse>> runTemplateMaintenanceJob() {
        return ResponseEntity.status(HttpStatus.ACCEPTED)
                .body(ApiResponse.success(batchService.runTemplateMaintenanceJob()));
    }

    @Operation(summary = "Get latest template maintenance batch execution")
    @GetMapping("/jobs/template-maintenance/executions/latest")
    public ResponseEntity<ApiResponse<BatchExecutionResponse>> getLatestTemplateMaintenanceJobExecution() {
        return ResponseEntity.ok(ApiResponse.success(batchService.getLatestTemplateMaintenanceJobExecution()));
    }
}
