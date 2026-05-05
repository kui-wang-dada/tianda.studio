"""initial schema — feedbacks live + users/comments/comment_likes dormant

Revision ID: 0001
Revises:
Create Date: 2026-05-04
"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "0001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "feedbacks",
        sa.Column("id", sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column("type", sa.String(16), nullable=False),
        sa.CheckConstraint(
            "type IN ('general', 'hire', 'collab')", name="ck_feedback_type"
        ),
        sa.Column("name", sa.String(80), nullable=True),
        sa.Column("email", sa.String(255), nullable=True),
        sa.Column("message", sa.Text(), nullable=False),
        sa.Column("locale", sa.String(8), nullable=True),
        sa.Column("ip_hash", sa.String(64), nullable=True),
        sa.Column("user_agent", sa.String(512), nullable=True),
        sa.Column("referer", sa.String(512), nullable=True),
        sa.Column("is_spam", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("is_archived", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.func.now(),
        ),
    )
    op.create_index("ix_feedbacks_type", "feedbacks", ["type"])
    op.create_index("ix_feedbacks_ip_hash", "feedbacks", ["ip_hash"])
    op.create_index("ix_feedbacks_is_spam", "feedbacks", ["is_spam"])
    op.create_index("ix_feedbacks_is_archived", "feedbacks", ["is_archived"])
    op.create_index("ix_feedbacks_created_at", "feedbacks", ["created_at"])
    op.create_index("ix_feedback_created_type", "feedbacks", ["created_at", "type"])

    # ── V1 dormant: users ─────────────────────────────────────────────
    op.create_table(
        "users",
        sa.Column("id", sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column("email", sa.String(255), nullable=False),
        sa.Column("password_hash", sa.String(255), nullable=True),
        sa.Column("display_name", sa.String(80), nullable=True),
        sa.Column("avatar_url", sa.String(512), nullable=True),
        sa.Column("role", sa.String(16), nullable=False, server_default="user"),
        sa.Column("provider", sa.String(32), nullable=True),
        sa.Column("provider_uid", sa.String(128), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.func.now(),
        ),
        sa.UniqueConstraint("email"),
    )
    op.create_index("ix_users_email", "users", ["email"], unique=True)
    op.create_index("ix_users_role", "users", ["role"])

    # ── V1 dormant: comments ──────────────────────────────────────────
    op.create_table(
        "comments",
        sa.Column("id", sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column("user_id", sa.BigInteger(), nullable=True),
        sa.Column("target_type", sa.String(16), nullable=False),
        sa.Column("target_slug", sa.String(128), nullable=False),
        sa.Column("parent_id", sa.BigInteger(), nullable=True),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("like_count", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("is_deleted", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.func.now(),
        ),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["parent_id"], ["comments.id"], ondelete="CASCADE"),
    )
    op.create_index("ix_comments_user_id", "comments", ["user_id"])
    op.create_index("ix_comments_target_type", "comments", ["target_type"])
    op.create_index("ix_comments_target_slug", "comments", ["target_slug"])
    op.create_index("ix_comments_parent_id", "comments", ["parent_id"])
    op.create_index("ix_comments_created_at", "comments", ["created_at"])
    op.create_index("ix_comment_target", "comments", ["target_type", "target_slug", "created_at"])

    # ── V1 dormant: comment_likes ─────────────────────────────────────
    op.create_table(
        "comment_likes",
        sa.Column("user_id", sa.BigInteger(), nullable=False),
        sa.Column("comment_id", sa.BigInteger(), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.func.now(),
        ),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["comment_id"], ["comments.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("user_id", "comment_id"),
    )


def downgrade() -> None:
    op.drop_table("comment_likes")
    op.drop_table("comments")
    op.drop_table("users")
    op.drop_table("feedbacks")
