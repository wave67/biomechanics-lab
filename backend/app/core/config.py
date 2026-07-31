import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent
STORAGE_DIR = BASE_DIR.parent / "storage"

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    f"sqlite+aiosqlite:///{BASE_DIR}/biomechanics_lab.db"
)

API_V1_PREFIX = "/api"
PROJECT_NAME = "高跟鞋生物力学测试研发工作台"
VERSION = "0.1.0"

MAX_UPLOAD_SIZE = 100 * 1024 * 1024
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".bmp",
    ".mp4", ".avi", ".mov", ".mkv",
    ".xlsx", ".xls", ".csv", ".mat",
    ".pptx", ".ppt", ".pdf", ".c3d",
    ".txt", ".log"}
