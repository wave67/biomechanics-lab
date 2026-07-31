import statistics
from typing import List, Optional, Any, Dict
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.encoders import jsonable_encoder

from ..models.biomechanical_data import BiomechanicalTestData
from ..models.analysis import Analysis
from ..schemas.analysis import AnalysisCreate, AnalysisResponse


def _extract_values(td, metric_path: str) -> List[float]:
    paths = metric_path.split(".")
    for data in [td.pressure_data, td.force_plate_data, td.motion_capture_data]:
        if data and isinstance(data, dict):
            val = data
            try:
                for p in paths:
                    if isinstance(val, dict) and p in val:
                        val = val[p]
                    elif isinstance(val, (int, float)):
                        break
                    else:
                        val = None; break
                if isinstance(val, (int, float)):
                    return [float(val)]
                if isinstance(val, dict):
                    return [float(v) for v in val.values() if isinstance(v, (int, float))]
            except: pass
    return []


def _compute_stats(values: List[float]) -> Dict[str, float]:
    if not values:
        return {"n": 0, "mean": 0, "std": 0, "min": 0, "max": 0, "median": 0}
    n = len(values)
    mean = statistics.mean(values)
    try: std = statistics.stdev(values) if n > 1 else 0
    except: std = 0
    return {
        "n": n, "mean": round(mean, 3), "std": round(std, 3),
        "min": round(min(values), 3), "max": round(max(values), 3),
        "median": round(statistics.median(values), 3)
    }


async def run_descriptive(db, project_id, metric_path, metric_name="", unit=""):
    from ..models.shoe_sample import ShoeSample
    result = await db.execute(select(BiomechanicalTestData).where(BiomechanicalTestData.project_id == project_id))
    all_values = []
    for rec in result.scalars().all():
        all_values.extend(_extract_values(rec, metric_path))
    stats = _compute_stats(all_values)
    return {"metric_name": metric_name, "metric_path": metric_path, "unit": unit, "stats": stats, "data_sample": all_values[:50]}


async def run_shoe_comparison(db, project_id, metric_path, metric_name="", unit=""):
    from ..models.shoe_sample import ShoeSample
    result = await db.execute(select(BiomechanicalTestData).where(BiomechanicalTestData.project_id == project_id))
    groups = {}
    for rec in result.scalars().all():
        if rec.sample_id:
            s = await db.execute(select(ShoeSample).where(ShoeSample.id == rec.sample_id))
            sample = s.scalar_one_or_none()
            label = f"{sample.brand or '?'} {sample.shoe_name or '?'}" if sample else f"Sample#{rec.sample_id}"
        else:
            label = "Unknown"
        vals = _extract_values(rec, metric_path)
        if vals:
            groups.setdefault(label, []).extend(vals)
    comparison = {label: _compute_stats(vals) for label, vals in groups.items()}
    return {"metric_name": metric_name, "metric_path": metric_path, "unit": unit, "comparison": comparison}


async def save_analysis(db, data: AnalysisCreate) -> Analysis:
    a = Analysis(**data.model_dump())
    db.add(a); await db.flush(); await db.refresh(a); return a


async def get_analyses(db, project_id: int) -> List[dict]:
    result = await db.execute(select(Analysis).where(Analysis.project_id == project_id).order_by(Analysis.created_at.desc()).limit(50))
    return jsonable_encoder([AnalysisResponse.model_validate(a).model_dump() for a in result.scalars().all()])


async def get_analysis(db, aid: int):
    r = await db.execute(select(Analysis).where(Analysis.id == aid)); return r.scalar_one_or_none()


async def delete_analysis(db, aid: int) -> bool:
    a = await get_analysis(db, aid)
    if not a: return False
    await db.delete(a); await db.flush(); return True
