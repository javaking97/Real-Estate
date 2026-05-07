package kr.co.realestate.domain.batch.service;

import kr.co.realestate.domain.batch.dto.BatchExecutionResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobExecution;
import org.springframework.batch.core.JobInstance;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.explore.JobExplorer;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BatchService {

    private final JobLauncher jobLauncher;
    private final JobExplorer jobExplorer;
    private final Job templateMaintenanceJob;

    public BatchExecutionResponse runTemplateMaintenanceJob() {
        JobParameters parameters = new JobParametersBuilder()
                .addLong("requestedAt", System.currentTimeMillis())
                .toJobParameters();

        try {
            JobExecution execution = jobLauncher.run(templateMaintenanceJob, parameters);
            return BatchExecutionResponse.from(templateMaintenanceJob.getName(), execution);
        } catch (Exception e) {
            throw new IllegalStateException("Failed to launch batch job", e);
        }
    }

    public BatchExecutionResponse getLatestTemplateMaintenanceJobExecution() {
        List<JobInstance> instances = jobExplorer.getJobInstances(templateMaintenanceJob.getName(), 0, 1);
        if (instances.isEmpty()) {
            return null;
        }

        return jobExplorer.getJobExecutions(instances.getFirst()).stream()
                .max(Comparator.comparing(JobExecution::getCreateTime, Comparator.nullsLast(Comparator.naturalOrder())))
                .map(execution -> BatchExecutionResponse.from(templateMaintenanceJob.getName(), execution))
                .orElse(null);
    }
}
