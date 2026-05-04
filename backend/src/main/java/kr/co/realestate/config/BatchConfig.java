package kr.co.realestate.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.launch.support.RunIdIncrementer;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.PlatformTransactionManager;

@Configuration
@Slf4j
public class BatchConfig {

    public static final String TEMPLATE_MAINTENANCE_JOB = "templateMaintenanceJob";

    @Bean
    public Job templateMaintenanceJob(JobRepository jobRepository, Step templateMaintenanceStep) {
        return new JobBuilder(TEMPLATE_MAINTENANCE_JOB, jobRepository)
                .incrementer(new RunIdIncrementer())
                .start(templateMaintenanceStep)
                .build();
    }

    @Bean
    public Step templateMaintenanceStep(JobRepository jobRepository,
                                        PlatformTransactionManager transactionManager) {
        return new StepBuilder("templateMaintenanceStep", jobRepository)
                .tasklet((contribution, chunkContext) -> {
                    log.info("Executed template maintenance batch step");
                    return RepeatStatus.FINISHED;
                }, transactionManager)
                .build();
    }
}
