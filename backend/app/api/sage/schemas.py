# app/api/sage/schemas.py

from __future__ import annotations

from typing import Any, Dict, List, Optional

from pydantic import BaseModel


class SageAskRequest(BaseModel):
    """
    Generic SAGE request.

    The idea is: the frontend (or another backend module) can pass in the
    full JSON pattern payload from /pattern/pro, /pattern/elite, or
    /pattern/vision-tier as the `pattern` field.

    Optionally, a natural-language `question` can be provided to steer the
    coaching tone (e.g., "How should I fish this pattern in a short evening
    trip?", "Where should I start?").
    """

    pattern: Dict[str, Any]
    question: Optional[str] = None


class SageAskResponse(BaseModel):
    """
    SAGE's coaching output.

    - `answer` is the main paragraph-style guidance.
    - `key_points` are concise bullets that the UI can render as chips or list.
    - `meta` is a grab-bag for debugging / analytics (no UI contract).
    """

    answer: str
    key_points: List[str]
    meta: Dict[str, Any] = {}
