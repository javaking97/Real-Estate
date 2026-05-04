package kr.co.realestate.domain.batch.service;

import kr.co.realestate.domain.batch.dto.BatchExecutionResponse;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.batch.core.BatchStatus;
import org.springframework.batch.core.ExitStatus;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobExecution;
import org.springframework.batch.core.JobInstance;
import org.springframework.batch.core.explore.JobExplorer;
import org.springframework.batch.core.launch.JobLauncher;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BatchServiceTest {

    @Mock private JobLauncher jobLauncher;
    @Mock private JobExplorer jobExplorer;
    @Mock private Job templateMaintenanceJob;

    @InjectMocks
    private BatchService batchService;

    @Test
    void runTemplateMaintenanceJob_shouldLaunchJob() throws Exception {
        when(templateMaintenanceJob.getName()).thenReturn("templateMaintenanceJob");

        JobExecution execution = mock(JobExecution.class);
        when(execution.getId()).thenReturn(1L);
        when(execution.getStatus()).thenReturn(BatchStatus.STARTING);
        when(execution.getExitStatus()).thenReturn(ExitStatus.EXECUTING);

        when(jobLauncher.run(any(Job.class), any())).thenReturn(execution);

        BatchExecutionResponse response = batchService.runTemplateMaintenanceJob();

        assertThat(response.getJobName()).isEqualTo("templateMaintenanceJob");
        assertThat(response.getExecutionId()).isEqualTo(1L);
        assertThat(response.getStatus()).isEqualTo("STARTING");
    }

    @Test
    void getLatestTemplateMaintenanceJobExecution_shouldReturnLatestExecution() {
        when(templateMaintenanceJob.getName()).thenReturn("templateMaintenanceJob");

        JobInstance instance = mock(JobInstance.class);
        JobExecution older = mock(JobExecution.class);
        JobExecution latest = mock(JobExecution.class);

        when(older.getCreateTime()).thenReturn(LocalDateTime.now().minusMinutes(5));

        when(latest.getCreateTime()).thenReturn(LocalDateTime.now());
        when(latest.getExitStatus()).thenReturn(ExitStatus.COMPLETED);
        when(latest.getId()).thenReturn(11L);
        when(latest.getStatus()).thenReturn(BatchStatus.COMPLETED);

        when(jobExplorer.getJobInstances("templateMaintenanceJob", 0, 1)).thenReturn(List.of(instance));
        when(jobExplorer.getJobExecutions(instance)).thenReturn(List.of(older, latest));

        BatchExecutionResponse response = batchService.getLatestTemplateMaintenanceJobExecution();

        assertThat(response.getExecutionId()).isEqualTo(11L);
        assertThat(response.getJobName()).isEqualTo("templateMaintenanceJob");
    }
}
