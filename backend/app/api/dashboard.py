from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from ..core.dependencies import get_db
from ..schemas.dashboard import DashboardResponse
from ..services import dashboard_service

router = APIRouter()


@router.get("/", response_model=DashboardResponse)
async def get_dashboard(db: AsyncSession = Depends(get_db)):
    return await dashboard_service.get_dashboard(db)
