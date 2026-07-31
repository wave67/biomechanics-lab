from enum import Enum as PyEnum


class TaskType(str, PyEnum):
    DAILY = "日常事务"
    PREP = "测试准备"
    EXPERIMENT = "实验执行"
    ANALYSIS = "数据分析"
    REPORT = "报告整理"
    LITERATURE = "文献学习"


class Priority(str, PyEnum):
    HIGH = "高"
    MEDIUM = "中"
    LOW = "低"


class TaskStatus(str, PyEnum):
    NOT_STARTED = "未开始"
    IN_PROGRESS = "进行中"
    COMPLETED = "完成"
    DELAYED = "延期"


class ProjectStatus(str, PyEnum):
    PENDING = "待准备"
    SAMPLE_CONFIRM = "样品确认"
    TESTING = "测试进行"
    PROCESSING = "数据处理中"
    REPORTING = "报告整理"
    COMPLETED = "完成"
    ARCHIVED = "归档"


class ShoeType(str, PyEnum):
    HEEL = "高跟鞋"
    EXTRA_HIGH_HEEL = "超高跟鞋"
    BLOCK_HEEL = "粗跟鞋"
    STILETTO = "细跟鞋"
    WEDGE = "坡跟鞋"
    FLAT = "平底鞋"
    OTHER = "其他"


class HeelType(str, PyEnum):
    STILETTO = "细跟"
    BLOCK = "粗跟"
    SQUARE = "方跟"
    WEDGE = "坡跟"


class SampleStatus(str, PyEnum):
    IN_STOCK = "库存"
    TESTING = "测试中"
    RETURNED = "归还"
    DAMAGED = "损耗"
    DISPOSED = "报废"


class TransactionType(str, PyEnum):
    IN = "入库"
    ISSUE = "领用"
    TEST = "测试"
    RETURN = "归还"
    DISPOSE = "报废"


class TestType(str, PyEnum):
    PRESSURE = "足底压力测试"
    FORCE_PLATE = "三维力台测试"
    MOTION_CAPTURE = "动态捕捉测试"


class FileType(str, PyEnum):
    IMAGE = "图片"
    VIDEO = "视频"
    PRESSURE_MAP = "压力图"
    MOTION_VIDEO = "运动捕捉视频"
    EXCEL = "Excel"
    CSV = "CSV"
    MAT = "MAT文件"
    PPT = "PPT"
    PDF = "PDF"
    OTHER = "其他"
