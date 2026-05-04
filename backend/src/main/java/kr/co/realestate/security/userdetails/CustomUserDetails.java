package kr.co.realestate.security.userdetails;

import kr.co.realestate.domain.user.generated.model.User;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Getter
public class CustomUserDetails implements UserDetails {

    private final User user;
    private final List<GrantedAuthority> authorities;

    public CustomUserDetails(User user, List<String> roleNames) {
        this.user = user;
        this.authorities = roleNames.stream()
                .map(SimpleGrantedAuthority::new)
                .map(GrantedAuthority.class::cast)
                .toList();
    }

    public Long getUserId() {
        return user.getId();
    }

    @Override public String getUsername()  { return user.getUsername(); }
    @Override public String getPassword()  { return user.getPassword(); }
    @Override public boolean isEnabled()   { return Boolean.TRUE.equals(user.getEnabled()); }
    @Override public boolean isAccountNonExpired()     { return true; }
    @Override public boolean isAccountNonLocked()      { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }
}
