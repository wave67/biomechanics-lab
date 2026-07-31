from pydantic import BaseModel
from typing import List
from .task import TaskResponse
from .project import ProjectResponse
from .test_data import TestDataResponse
from .file import FileResponse


class DashboardResponse(BaseModel):
    today_tasks: List[TaskResponse] = []
    current_projects: List[ProjectResponse] = []
    recent_test_data: List[TestDataResponse] = []
    recent_files: List[FileResponse] = []
