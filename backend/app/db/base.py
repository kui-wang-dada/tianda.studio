from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


# Import models so Alembic + create_all see them.
from app.models import comment, comment_like, feedback, user  # noqa: E402,F401
