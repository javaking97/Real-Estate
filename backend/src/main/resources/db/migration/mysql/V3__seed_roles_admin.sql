INSERT IGNORE INTO roles (name, description, created_by, updated_by)
VALUES
    ('ROLE_USER',  'Standard user',        'system', 'system'),
    ('ROLE_ADMIN', 'Administrator',         'system', 'system');

-- WARNING: Change this password immediately after first boot.
-- BCrypt of "Admin1234!" (strength 10)
INSERT IGNORE INTO users (username, password, email, display_name, enabled, created_by, updated_by)
VALUES ('admin', '$2b$10$0LXK1vV/vrZEJhMm/v2kn.EVOPJZRCXJB5XYpfdl10YF18SiUgSii', 'admin@example.com', 'Administrator', 1, 'system', 'system');

INSERT IGNORE INTO user_roles (user_id, role_id, created_by, updated_by)
SELECT u.id, r.id, 'system', 'system'
FROM users u, roles r
WHERE u.username = 'admin' AND r.name = 'ROLE_ADMIN';
