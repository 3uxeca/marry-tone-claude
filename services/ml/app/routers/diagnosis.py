from fastapi import APIRouter

router = APIRouter()


@router.post("/personal-color")
def analyze_personal_color():
    """Stub: personal color analysis (warm/cool season classification)."""
    return {
        "season": "spring_warm",
        "undertone": "warm",
        "recommended_palette": ["coral", "peach", "golden_yellow"],
    }


@router.post("/body-measurements")
def analyze_body_measurements():
    """Stub: body measurement estimation from image."""
    return {
        "height_cm": 165,
        "shoulder_width_cm": 38,
        "waist_cm": 68,
        "hip_cm": 92,
    }


@router.post("/skeleton-type")
def analyze_skeleton_type():
    """Stub: skeleton/body-type classification."""
    return {
        "skeleton_type": "natural",
        "recommended_silhouettes": ["relaxed", "straight", "oversized"],
    }
