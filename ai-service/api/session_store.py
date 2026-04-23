"""
Session store with Redis primary and in-memory fallback.
Serializes ConversationSession to JSON with TTL.
Falls back to an in-process dict when Redis is unreachable (e.g., local dev without Redis).
"""
import json
import logging
from typing import Optional

import redis.asyncio as aioredis

from config import settings
from models.conversation import ConversationSession

logger = logging.getLogger(__name__)

# In-memory fallback — used when Redis is unavailable
_fallback: dict[str, str] = {}


def _session_key(session_id: str) -> str:
    return f"harbor:session:{session_id}"


async def _get_redis() -> Optional[aioredis.Redis]:
    try:
        client = aioredis.from_url(
            settings.redis_url,
            decode_responses=True,
            socket_connect_timeout=1,
        )
        await client.ping()
        return client
    except Exception as exc:
        logger.debug("Redis unavailable (%s), using in-memory store", exc)
        return None


async def get_session(session_id: str) -> Optional[ConversationSession]:
    client = await _get_redis()
    if client:
        try:
            raw = await client.get(_session_key(session_id))
            await client.aclose()
            if raw:
                return ConversationSession.model_validate_json(raw)
            return None
        except Exception as exc:
            logger.error("Redis get error: %s", exc)
            try:
                await client.aclose()
            except Exception:
                pass

    raw = _fallback.get(session_id)
    return ConversationSession.model_validate_json(raw) if raw else None


async def save_session(session: ConversationSession) -> None:
    raw = session.model_dump_json()
    client = await _get_redis()
    if client:
        try:
            await client.setex(
                _session_key(session.session_id),
                settings.session_ttl_seconds,
                raw,
            )
            await client.aclose()
            _fallback.pop(session.session_id, None)
            return
        except Exception as exc:
            logger.error("Redis save error: %s", exc)
            try:
                await client.aclose()
            except Exception:
                pass

    _fallback[session.session_id] = raw


async def delete_session(session_id: str) -> None:
    _fallback.pop(session_id, None)
    client = await _get_redis()
    if client:
        try:
            await client.delete(_session_key(session_id))
            await client.aclose()
        except Exception as exc:
            logger.error("Redis delete error: %s", exc)
            try:
                await client.aclose()
            except Exception:
                pass
