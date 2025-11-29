from __future__ import annotations

from typing import Any, Dict, Union

from app.domain.pattern.schemas import ElitePatternRequest, ElitePatternResponse
from .context import VisionContext
from .builders import build_vision_context
from .logic_elite import build_elite_pattern


def _coerce_vision_context(
    vision: Union[VisionContext, Dict[str, Any]],
) -> VisionContext:
    """
    Accept either a ready-made VisionContext or a dict of raw sonar/vision fields
    and convert it into a VisionContext using our builder.
    """

    if isinstance(vision, VisionContext):
        return vision

    if isinstance(vision, dict):
        return build_vision_context(
            depth_ft=vision.get("depth_ft"),
            arch_count=vision.get("arch_count"),
            activity_level=vision.get("activity_level"),
            bait_present=vision.get("bait_present"),
            bottom_hardness=vision.get("bottom_hardness"),
            stop_or_keep_moving=vision.get("stop_or_keep_moving"),
        )

    # Fallback: if we get something unexpected, just use defaults
    return build_vision_context()


def build_vision_tier_pattern(
    req: ElitePatternRequest,
    vision: Union[VisionContext, Dict[str, Any]],
) -> ElitePatternResponse:
    """
    Vision tier entrypoint.

    - Requires a VisionContext (or a dict of raw sonar signals).
    - Internally delegates to build_elite_pattern, which already knows how
      to handle fusion and vision adjustments.

    This does NOT change any existing behavior because:
    - It is a new function.
    - No existing routes or tests call it yet.
    """

    v_ctx = _coerce_vision_context(vision)

    # Delegate to Elite builder, passing the vision context
    return build_elite_pattern(req, vision_ctx=v_ctx)
