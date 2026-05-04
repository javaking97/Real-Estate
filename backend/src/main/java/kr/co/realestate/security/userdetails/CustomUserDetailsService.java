package kr.co.realestate.security.userdetails;

import kr.co.realestate.domain.user.generated.mapper.UserMapper;
import kr.co.realestate.domain.user.generated.model.User;
import kr.co.realestate.domain.user.service.UserRoleQueryService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import static kr.co.realestate.domain.user.generated.support.UserDynamicSqlSupport.username;
import static org.mybatis.dynamic.sql.SqlBuilder.isEqualTo;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserMapper userMapper;
    private final UserRoleQueryService userRoleQueryService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = selectByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        List<String> roleNames = userRoleQueryService.getRoleNames(user.getId());

        return new CustomUserDetails(user, roleNames);
    }

    private Optional<User> selectByUsername(String loginUsername) {
        return userMapper.selectOne(query -> query.where(username, isEqualTo(loginUsername)));
    }
}
