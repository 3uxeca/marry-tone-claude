from pydantic import BaseModel, Field
from enum import Enum
from typing import Optional

# ─── Personal Color ───────────────────────────────────────────────────────────

class PersonalColorSeason(str, Enum):
    SPRING_WARM = "SPRING_WARM"
    SUMMER_COOL = "SUMMER_COOL"
    AUTUMN_WARM = "AUTUMN_WARM"
    WINTER_COOL = "WINTER_COOL"

class PersonalColorRequest(BaseModel):
    image_base64: str = Field(..., description="맨얼굴 이미지 base64")
    user_id: str

class PersonalColorResponse(BaseModel):
    user_id: str
    season: PersonalColorSeason
    confidence: float = Field(..., ge=0.0, le=1.0)
    skin_tone_hex: str
    iris_tone_hex: str
    rationale: str

# ─── Body Measurements ───────────────────────────────────────────────────────

class BodyMeasurementsRequest(BaseModel):
    image_base64: str = Field(..., description="전신 이미지 base64")
    user_id: str
    height_cm: Optional[float] = None

class BodyMeasurementsResponse(BaseModel):
    user_id: str
    shoulder_width_ratio: float
    waist_hip_ratio: float
    body_length_ratio: float
    confidence: float = Field(..., ge=0.0, le=1.0)

# ─── Skeleton Type ───────────────────────────────────────────────────────────

class SkeletonType(str, Enum):
    STRAIGHT = "STRAIGHT"
    WAVE = "WAVE"
    NATURAL = "NATURAL"

class SkeletonTypeRequest(BaseModel):
    user_id: str
    shoulder_width_ratio: float
    waist_hip_ratio: float
    body_length_ratio: float

class SkeletonTypeResponse(BaseModel):
    user_id: str
    skeleton_type: SkeletonType
    confidence: float = Field(..., ge=0.0, le=1.0)
    rationale: str
    alternative_type: Optional[SkeletonType] = None
    alternative_confidence: Optional[float] = None
