from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from ..core.dependencies import get_db
from ..schemas.analysis import AnalysisCreate, AnalysisResponse
from ..services import analysis_service

router = APIRouter()

@router.post("/descriptive")
async def run_descriptive(
    project_id: int, metric_path: str, metric_name: str = "", unit: str = "",
    db: AsyncSession = Depends(get_db)
):
    result = await analysis_service.run_descriptive(db, project_id, metric_path, metric_name, unit)
    data = AnalysisCreate(
        project_id=project_id,
        analysis_name=f"Descriptive: {metric_name or metric_path}",
        analysis_type="descriptive",
        parameters={"metric_path": metric_path, "metric_name": metric_name, "unit": unit},
        result_data=result,
    )
    await analysis_service.save_analysis(db, data)
    return result

@router.post("/shoe-comparison")
async def run_shoe_comparison(
    project_id: int, metric_path: str, metric_name: str = "", unit: str = "",
    db: AsyncSession = Depends(get_db)
):
    result = await analysis_service.run_shoe_comparison(db, project_id, metric_path, metric_name, unit)
    data = AnalysisCreate(
        project_id=project_id,
        analysis_name=f"Shoe Comparison: {metric_name or metric_path}",
        analysis_type="shoe_comparison",
        parameters={"metric_path": metric_path, "metric_name": metric_name, "unit": unit},
        result_data=result,
    )
    await analysis_service.save_analysis(db, data)
    return result

@router.get("/history/{project_id}", response_model=list)
async def list_analyses(project_id: int, db: AsyncSession = Depends(get_db)):
    return await analysis_service.get_analyses(db, project_id)

@router.get("/{aid}", response_model=AnalysisResponse)
async def get_analysis(aid: int, db: AsyncSession = Depends(get_db)):
    a = await analysis_service.get_analysis(db, aid)
    if not a: raise HTTPException(404)
    return a

@router.delete("/{aid}")
async def delete_analysis(aid: int, db: AsyncSession = Depends(get_db)):
    ok = await analysis_service.delete_analysis(db, aid)
    if not ok: raise HTTPException(404)
    return {"message": "Deleted"}
