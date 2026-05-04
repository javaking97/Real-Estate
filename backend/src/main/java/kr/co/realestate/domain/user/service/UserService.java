package kr.co.realestate.domain.user.service;

import kr.co.realestate.domain.common.enums.ErrorCode;
import kr.co.realestate.domain.user.dto.UserResponse;
import kr.co.realestate.domain.user.generated.mapper.UserMapper;
import kr.co.realestate.domain.user.generated.model.User;
import kr.co.realestate.domain.user.mapstruct.UserMapStruct;
import kr.co.realestate.exceptions.BizException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserMapper userMapper;
    private final UserRoleQueryService userRoleQueryService;
    private final UserMapStruct userMapStruct;

    @Transactional(readOnly = true)
    public UserResponse getUser(Long userId) {
        User user = userMapper.selectByPrimaryKey(userId)
                .orElseThrow(() -> new BizException(ErrorCode.NOT_FOUND_ERROR));

        List<String> roles = userRoleQueryService.getRoleNames(userId);

        return userMapStruct.toResponseWithRoles(user, roles);
    }
}
