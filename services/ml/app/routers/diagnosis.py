from fastapi import APIRouter, HTTPException
from app.schemas import (
    SuccessResponse,
    PersonalColorRequest, PersonalColorResponse, PersonalColorSeason,
    BodyMeasurementsRequest, BodyMeasurementsResponse,
    SkeletonTypeRequest, SkeletonTypeResponse, SkeletonType,
)

router = APIRouter(prefix="/diagnosis", tags=["diagnosis"])


@router.post("/personal-color", response_model=SuccessResponse[PersonalColorResponse])
async def diagnose_personal_color(req: PersonalColorRequest):
    """
    퍼스널컬러 진단 — S2에서 MediaPipe + OpenCV 실제 구현 예정.
    현재: 고정값 stub 반환 (confidence 0.0으로 저신뢰 C정책 테스트 가능)
    """
    stub = PersonalColorResponse(
        user_id=req.user_id,
        season=PersonalColorSeason.SUMMER_COOL,
        confidence=0.0,  # 저신뢰 → 재촬영 유도 테스트용
        skin_tone_hex="#F5D5C0",
        iris_tone_hex="#6B4F3A",
        rationale="S2에서 실제 모델 추론 구현 예정",
    )
    return SuccessResponse(data=stub)


@router.post("/body-measurements", response_model=SuccessResponse[BodyMeasurementsResponse])
async def extract_body_measurements(req: BodyMeasurementsRequest):
    """
    신체 측정치 추출 — S2에서 Live-Measurements-Api 포크 기반 구현 예정.
    """
    stub = BodyMeasurementsResponse(
        user_id=req.user_id,
        shoulder_width_ratio=0.42,
        waist_hip_ratio=0.75,
        body_length_ratio=0.52,
        confidence=0.0,
    )
    return SuccessResponse(data=stub)


@router.post("/skeleton-type", response_model=SuccessResponse[SkeletonTypeResponse])
async def classify_skeleton_type(req: SkeletonTypeRequest):
    """
    골격 타입 분류 — S2에서 휴리스틱 + 확률 분류 구현 예정.
    """
    stub = SkeletonTypeResponse(
        user_id=req.user_id,
        skeleton_type=SkeletonType.WAVE,
        confidence=0.0,
        rationale="S2에서 실제 분류 로직 구현 예정",
        alternative_type=SkeletonType.NATURAL,
        alternative_confidence=0.0,
    )
    return SuccessResponse(data=stub)
