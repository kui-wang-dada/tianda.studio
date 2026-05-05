import hashlib

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from .config import settings

bearer_scheme = HTTPBearer(auto_error=False)


def require_admin_token(
    creds: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
) -> None:
    if creds is None or creds.credentials != settings.ADMIN_TOKEN.get_secret_value():
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="invalid or missing admin token",
            headers={"WWW-Authenticate": "Bearer"},
        )


def hash_ip(ip: str) -> str:
    salt = settings.IP_SALT.get_secret_value()
    return hashlib.sha256(f"{ip}:{salt}".encode()).hexdigest()
