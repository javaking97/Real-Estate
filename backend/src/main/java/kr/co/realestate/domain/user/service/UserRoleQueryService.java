package kr.co.realestate.domain.user.service;

import kr.co.realestate.domain.user.generated.mapper.RoleMapper;
import kr.co.realestate.domain.user.generated.mapper.UserRoleMapper;
import kr.co.realestate.domain.user.generated.model.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static kr.co.realestate.domain.user.generated.support.RoleDynamicSqlSupport.id;
import static kr.co.realestate.domain.user.generated.support.UserRoleDynamicSqlSupport.userId;
import static org.mybatis.dynamic.sql.SqlBuilder.isEqualTo;
import static org.mybatis.dynamic.sql.SqlBuilder.isIn;

@Service
@RequiredArgsConstructor
public class UserRoleQueryService {

    private final UserRoleMapper userRoleMapper;
    private final RoleMapper roleMapper;

    @Transactional(readOnly = true)
    public List<String> getRoleNames(Long targetUserId) {
        List<Long> roleIds = userRoleMapper.select(query -> query.where(userId, isEqualTo(targetUserId))).stream()
                .map(userRole -> userRole.getRoleId())
                .toList();

        if (roleIds.isEmpty()) {
            return List.of();
        }

        return roleMapper.select(query -> query.where(id, isIn(roleIds))).stream()
                .map(Role::getName)
                .toList();
    }
}
