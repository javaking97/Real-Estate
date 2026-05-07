package kr.co.realestate.domain.user.mapstruct;

import kr.co.realestate.domain.user.dto.UserResponse;
import kr.co.realestate.domain.user.generated.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserMapStruct {

    @Mapping(target = "roles", ignore = true)
    UserResponse toResponse(User user);

    // Complex mapping example: User + roles list → UserResponse
    default UserResponse toResponseWithRoles(User user, List<String> roles) {
        UserResponse base = toResponse(user);
        return UserResponse.builder()
                .id(base.getId())
                .username(base.getUsername())
                .email(base.getEmail())
                .displayName(base.getDisplayName())
                .enabled(base.getEnabled())
                .createdAt(base.getCreatedAt())
                .roles(roles)
                .build();
    }
}
