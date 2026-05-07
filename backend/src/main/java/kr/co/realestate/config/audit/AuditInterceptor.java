package kr.co.realestate.config.audit;

import lombok.extern.slf4j.Slf4j;
import org.apache.ibatis.executor.Executor;
import org.apache.ibatis.mapping.MappedStatement;
import org.apache.ibatis.mapping.SqlCommandType;
import org.apache.ibatis.plugin.Interceptor;
import org.apache.ibatis.plugin.Intercepts;
import org.apache.ibatis.plugin.Invocation;
import org.apache.ibatis.plugin.Signature;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.lang.reflect.Field;
import java.time.LocalDateTime;

@Slf4j
@Component
@Intercepts(@Signature(type = Executor.class, method = "update", args = {MappedStatement.class, Object.class}))
public class AuditInterceptor implements Interceptor {

    private static final String CREATED_AT  = "createdAt";
    private static final String UPDATED_AT  = "updatedAt";
    private static final String CREATED_BY  = "createdBy";
    private static final String UPDATED_BY  = "updatedBy";

    @Override
    public Object intercept(Invocation invocation) throws Throwable {
        MappedStatement statement = (MappedStatement) invocation.getArgs()[0];
        Object parameter = invocation.getArgs()[1];

        if (parameter == null) {
            return invocation.proceed();
        }

        LocalDateTime now = LocalDateTime.now();
        String actor = resolveActor();
        SqlCommandType commandType = statement.getSqlCommandType();

        if (commandType == SqlCommandType.INSERT) {
            setFieldIfPresent(parameter, CREATED_AT, now);
            setFieldIfPresent(parameter, CREATED_BY, actor);
            setFieldIfPresent(parameter, UPDATED_AT, now);
            setFieldIfPresent(parameter, UPDATED_BY, actor);
        } else if (commandType == SqlCommandType.UPDATE) {
            setFieldIfPresent(parameter, UPDATED_AT, now);
            setFieldIfPresent(parameter, UPDATED_BY, actor);
        }

        return invocation.proceed();
    }

    private String resolveActor() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
                return auth.getName();
            }
        } catch (Exception ignored) {
        }
        return "system";
    }

    private void setFieldIfPresent(Object target, String fieldName, Object value) {
        try {
            Field field = findField(target.getClass(), fieldName);
            if (field == null) return;
            field.setAccessible(true);
            if (field.get(target) == null) {
                field.set(target, value);
            }
        } catch (Exception e) {
            log.debug("AuditInterceptor: could not set field '{}' on {}", fieldName, target.getClass().getSimpleName());
        }
    }

    private Field findField(Class<?> clazz, String fieldName) {
        while (clazz != null && clazz != Object.class) {
            try {
                return clazz.getDeclaredField(fieldName);
            } catch (NoSuchFieldException e) {
                clazz = clazz.getSuperclass();
            }
        }
        return null;
    }
}
