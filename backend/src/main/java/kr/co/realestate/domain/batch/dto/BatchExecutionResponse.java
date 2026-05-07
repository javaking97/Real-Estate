package kr.co.realestate.domain.batch.dto;

import lombok.Builder;
import lombok.Getter;
import org.springframework.batch.core.JobExecution;

import java.time.LocalDateTime;

@Getter
@Builder
public class BatchExecutionResponse {

    private final String jobName;
    private final Long executionId;
    private final String status;
    private final String exitCode;
    private final LocalDateTime createdAt;
    private final LocalDateTime startedAt;
    private final LocalDateTime endedAt;

    public static BatchExecutionResponse from(String jobName, JobExecution execution) {
        return BatchExecutionResponse.builder()
                .jobName(jobName)
                .executionId(execution.getId())
                .status(execution.getStatus().name())
                .exitCode(execution.getExitStatus() == null ? null : execution.getExitStatus().getExitCode())
                .createdAt(execution.getCreateTime())
                .startedAt(execution.getStartTime())
                .endedAt(execution.getEndTime())
                .build();
    }
}
