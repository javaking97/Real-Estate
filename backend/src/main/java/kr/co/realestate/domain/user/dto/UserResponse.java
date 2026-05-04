package kr.co.realestate.domain.user.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private String displayName;
    private Boolean enabled;
    private List<String> roles;
    private LocalDateTime createdAt;
}
