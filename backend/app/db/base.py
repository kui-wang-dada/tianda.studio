from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


# Import models so they register on Base.metadata for ORM queries.
# Schema 由 postgres-init.sql 提供，模型只用于查询。
from app.models import comment, comment_like, feedback, user  # noqa: E402,F401
