package kr.co.realestate.domain.user.controller;

import kr.co.realestate.domain.common.model.ApiResponse;
import kr.co.realestate.domain.user.dto.UserResponse;
import kr.co.realestate.domain.user.service.UserService;
import kr.co.realestate.security.annotations.CurrentUserId;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "User", description = "User API")
@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @Operation(summary = "Get my profile")
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getMe(@CurrentUserId Long userId) {
        return ResponseEntity.ok(ApiResponse.success(userService.getUser(userId)));
    }
}
