export interface Task {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  task_type: string;
  priority: string;
  status: string;
  start_time?: string;
  due_time?: string;
  estimated_hours?: number;
  actual_hours?: number;
  project_id?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: number;
  project_no: string;
  project_name: string;
  brand_name?: string;
  shoe_name?: string;
  shoe_type?: string;
  heel_height_mm?: number;
  heel_type?: string;
  shoe_size?: number;
  test_purpose?: string;
  responsible_person?: string;
  status: string;
  test_equipment?: string[];
  test_events?: string[];
  test_environment?: Record<string, string>;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ShoeSample {
  id: number;
  sample_no: string;
  brand?: string;
  shoe_name?: string;
  shoe_type?: string;
  shoe_size?: number;
  size_label?: string;
  heel_height_mm?: number;
  heel_structure?: string;
  color?: string;
  material_info?: string;
  quantity: number;
  storage_date?: string;
  source?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface SampleTransaction {
  id: number;
  sample_id: number;
  operation_type: string;
  operator?: string;
  operation_date: string;
  notes?: string;
  created_at: string;
}

export interface Participant {
  id: number;
  participant_no: string;
  gender?: string;
  age?: number;
  height_cm?: number;
  weight_kg?: number;
  shoe_size?: number;
  foot_type_info?: string;
  exercise_habits?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface TestData {
  id: number;
  data_no: string;
  project_id: number;
  sample_id?: number;
  participant_id?: number;
  test_date?: string;
  test_type: string;
  pressure_data?: Record<string, unknown>;
  force_plate_data?: Record<string, unknown>;
  motion_capture_data?: Record<string, unknown>;
  device_name?: string;
  device_model?: string;
  sampling_frequency?: number;
  test_action?: string;
  test_speed?: string;
  test_trials?: number;
  raw_data_path?: string;
  analysis_result_path?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface TestFile {
  id: number;
  file_no: string;
  file_name: string;
  file_type: string;
  storage_path: string;
  file_size_bytes?: number;
  project_id?: number;
  sample_id?: number;
  participant_id?: number;
  test_data_id?: number;
  uploader?: string;
  upload_time?: string;
  description?: string;
  created_at: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
}

export interface DashboardData {
  today_tasks: Task[];
  current_projects: Project[];
  recent_test_data: TestData[];
  recent_files: TestFile[];
}
