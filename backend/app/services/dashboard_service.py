from sqlalchemy.ext.asyncio import AsyncSession

from .task_service import get_tasks
from .project_service import get_current_projects
from .test_data_service import get_recent_test_data
from .file_service import get_recent_files

from ..schemas.dashboard import DashboardResponse


async def get_dashboard(db: AsyncSession) -> DashboardResponse:
    from datetime import date
    today = date.today().isoformat()

    today_tasks, _ = await get_tasks(db, due_date=today)
    current_projects = await get_current_projects(db)
    recent_test_data = await get_recent_test_data(db)
    recent_files = await get_recent_files(db)

    return DashboardResponse(
        today_tasks=today_tasks,
        current_projects=current_projects,
        recent_test_data=recent_test_data,
        recent_files=recent_files,
    )
