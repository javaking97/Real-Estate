package kr.co.realestate.domain.common.model;

import org.junit.jupiter.api.Test;

import java.lang.reflect.Field;
import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

class BaseModelStructureTest {

    @Test
    void baseVO_shouldDeclareAuditFieldsWithExpectedTypes() throws Exception {
        Field createdAt = BaseVO.class.getDeclaredField("createdAt");
        Field updatedAt = BaseVO.class.getDeclaredField("updatedAt");
        Field createdBy = BaseVO.class.getDeclaredField("createdBy");
        Field updatedBy = BaseVO.class.getDeclaredField("updatedBy");

        assertThat(createdAt.getType()).isEqualTo(LocalDateTime.class);
        assertThat(updatedAt.getType()).isEqualTo(LocalDateTime.class);
        assertThat(createdBy.getType()).isEqualTo(String.class);
        assertThat(updatedBy.getType()).isEqualTo(String.class);
    }
}
