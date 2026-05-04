package kr.co.realestate.domain.user.service;

import kr.co.realestate.domain.common.enums.ErrorCode;
import kr.co.realestate.domain.user.dto.UserResponse;
import kr.co.realestate.domain.user.generated.mapper.UserMapper;
import kr.co.realestate.domain.user.generated.model.User;
import kr.co.realestate.domain.user.mapstruct.UserMapStruct;
import kr.co.realestate.exceptions.BizException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock private UserMapper userMapper;
    @Mock private UserRoleQueryService userRoleQueryService;
    @Mock private UserMapStruct userMapStruct;

    @InjectMocks
    private UserService userService;

    @Test
    void getUser_shouldReturnUserWithRoles_whenUserExists() {
        User user = buildUser(1L, "alice", "alice@example.com", true);
        UserResponse expected = UserResponse.builder().id(1L).username("alice").roles(List.of("ROLE_USER")).build();

        when(userMapper.selectByPrimaryKey(1L)).thenReturn(Optional.of(user));
        when(userRoleQueryService.getRoleNames(1L)).thenReturn(List.of("ROLE_USER"));
        when(userMapStruct.toResponseWithRoles(user, List.of("ROLE_USER"))).thenReturn(expected);

        UserResponse result = userService.getUser(1L);

        assertThat(result.getUsername()).isEqualTo("alice");
        assertThat(result.getRoles()).containsExactly("ROLE_USER");
    }

    @Test
    void getUser_shouldThrow_whenUserNotFound() {
        when(userMapper.selectByPrimaryKey(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.getUser(99L))
                .isInstanceOf(BizException.class)
                .satisfies(e -> assertThat(((BizException) e).getErrorCode())
                        .isEqualTo(ErrorCode.NOT_FOUND_ERROR));
    }

    private User buildUser(Long id, String username, String email, Boolean enabled) {
        User user = new User();
        user.setId(id);
        user.setUsername(username);
        user.setEmail(email);
        user.setEnabled(enabled);
        return user;
    }
}
