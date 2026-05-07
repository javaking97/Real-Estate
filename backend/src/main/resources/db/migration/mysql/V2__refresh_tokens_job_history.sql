CREATE TABLE IF NOT EXISTS refresh_tokens (
    id          BIGINT          NOT NULL AUTO_INCREMENT,
    user_id     BIGINT          NOT NULL,
    token_hash  VARCHAR(128)    NOT NULL COMMENT 'SHA-256 hash of the raw token',
    jti         VARCHAR(64)     NOT NULL COMMENT 'JWT ID claim',
    expires_at  DATETIME(6)     NOT NULL,
    revoked     TINYINT(1)      NOT NULL DEFAULT 0,
    created_at  DATETIME(6)     NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at  DATETIME(6)     NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    created_by  VARCHAR(64)     NOT NULL DEFAULT 'system',
    updated_by  VARCHAR(64)     NOT NULL DEFAULT 'system',
    PRIMARY KEY (id),
    UNIQUE KEY uq_refresh_tokens_jti (jti),
    CONSTRAINT fk_refresh_tokens_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
