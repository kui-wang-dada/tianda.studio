-- 首次启动 postgres 容器（pg_data 卷为空时）执行此文件。
-- 之后想改 schema：在线连进容器跑 SQL，或这里改 + 重置数据卷（dev 环境）。
--
-- V1 active：feedbacks
-- V1 dormant：users / comments / comment_likes（建好但 endpoint 暂未启用）

-- ─────────────── feedbacks ───────────────
CREATE TABLE feedbacks (
    id           BIGSERIAL PRIMARY KEY,
    type         VARCHAR(16)   NOT NULL,
    name         VARCHAR(80),
    email        VARCHAR(255),
    message      TEXT          NOT NULL,
    locale       VARCHAR(8),
    ip_hash      VARCHAR(64),
    user_agent   VARCHAR(512),
    referer      VARCHAR(512),
    is_spam      BOOLEAN       NOT NULL DEFAULT FALSE,
    is_archived  BOOLEAN       NOT NULL DEFAULT FALSE,
    created_at   TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    CONSTRAINT ck_feedback_type CHECK (type IN ('general', 'hire', 'collab'))
);
CREATE INDEX ix_feedbacks_type        ON feedbacks (type);
CREATE INDEX ix_feedbacks_ip_hash     ON feedbacks (ip_hash);
CREATE INDEX ix_feedbacks_is_spam     ON feedbacks (is_spam);
CREATE INDEX ix_feedbacks_is_archived ON feedbacks (is_archived);
CREATE INDEX ix_feedbacks_created_at  ON feedbacks (created_at);
CREATE INDEX ix_feedback_created_type ON feedbacks (created_at, type);

-- ─────────────── users（V1 dormant） ───────────────
CREATE TABLE users (
    id            BIGSERIAL PRIMARY KEY,
    email         VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255),
    display_name  VARCHAR(80),
    avatar_url    VARCHAR(512),
    role          VARCHAR(16)  NOT NULL DEFAULT 'user',
    provider      VARCHAR(32),
    provider_uid  VARCHAR(128),
    is_active     BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
CREATE UNIQUE INDEX ix_users_email ON users (email);
CREATE INDEX        ix_users_role  ON users (role);

-- ─────────────── comments（V1 dormant） ───────────────
CREATE TABLE comments (
    id           BIGSERIAL PRIMARY KEY,
    user_id      BIGINT REFERENCES users(id)    ON DELETE CASCADE,
    target_type  VARCHAR(16)  NOT NULL,
    target_slug  VARCHAR(128) NOT NULL,
    parent_id    BIGINT REFERENCES comments(id) ON DELETE CASCADE,
    content      TEXT         NOT NULL,
    like_count   INTEGER      NOT NULL DEFAULT 0,
    is_deleted   BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
CREATE INDEX ix_comments_user_id     ON comments (user_id);
CREATE INDEX ix_comments_target_type ON comments (target_type);
CREATE INDEX ix_comments_target_slug ON comments (target_slug);
CREATE INDEX ix_comments_parent_id   ON comments (parent_id);
CREATE INDEX ix_comments_created_at  ON comments (created_at);
CREATE INDEX ix_comment_target       ON comments (target_type, target_slug, created_at);

-- ─────────────── comment_likes（V1 dormant） ───────────────
CREATE TABLE comment_likes (
    user_id    BIGINT NOT NULL REFERENCES users(id)    ON DELETE CASCADE,
    comment_id BIGINT NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, comment_id)
);
