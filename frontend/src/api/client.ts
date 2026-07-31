// localStorage-backed API client for static deployment.
// Replaces the FastAPI backend with browser-local persistence.

const PREFIX = 'biolab_v1_';

const seedData: Record<string, any[]> = {
  tasks: [
    { id: 1, user_id: 1, title: '足底压力测试准备', task_type: '测试准备', priority: '高', status: '进行中', created_at: now(), updated_at: now() },
    { id: 2, user_id: 1, title: 'A品牌静态站立数据采集', task_type: '实验执行', priority: '高', status: '进行中', created_at: now(), updated_at: now() },
    { id: 3, user_id: 1, title: 'B品牌坡跟鞋数据分析', task_type: '数据分析', priority: '中', status: '未开始', created_at: now(), updated_at: now() },
  ],
  projects: [
    { id: 1, project_no: 'HP-2026-001', project_name: 'A品牌细跟高跟鞋稳定性评估', brand_name: 'A品牌', shoe_name: '优雅系列细跟高跟鞋', shoe_type: '细跟鞋', heel_height_mm: 80, status: '测试进行', created_at: now(), updated_at: now() },
  ],
  samples: [
    { id: 1, sample_no: 'SH-H01', brand: 'A品牌', shoe_name: '细跟80mm', shoe_type: '细跟鞋', heel_height_mm: 80, shoe_size: 38, quantity: 2, status: '库存', created_at: now(), updated_at: now() },
    { id: 2, sample_no: 'SH-H02', brand: 'A品牌', shoe_name: '细跟60mm', shoe_type: '细跟鞋', heel_height_mm: 60, shoe_size: 38, quantity: 2, status: '库存', created_at: now(), updated_at: now() },
    { id: 3, sample_no: 'SH-H03', brand: 'B品牌', shoe_name: '坡跟50mm', shoe_type: '坡跟鞋', heel_height_mm: 50, shoe_size: 38, quantity: 3, status: '库存', created_at: now(), updated_at: now() },
  ],
  participants: [
    { id: 1, participant_no: 'P-001', gender: '女', age: 25, height_cm: 165, weight_kg: 55, shoe_size: 38, created_at: now(), updated_at: now() },
    { id: 2, participant_no: 'P-002', gender: '女', age: 30, height_cm: 170, weight_kg: 60, shoe_size: 39, created_at: now(), updated_at: now() },
  ],
  equipment: [
    { id: 1, name: 'FootScan足底压力系统', equipment_no: 'EQ-001', brand: 'RSScan', model: '3D 2.0', sampling_frequency: 500, status: '正常', created_at: now(), updated_at: now() },
    { id: 2, name: 'AMTI三维力台', equipment_no: 'EQ-002', brand: 'AMTI', model: 'BP400600', sampling_frequency: 1000, status: '正常', created_at: now(), updated_at: now() },
    { id: 3, name: 'Vicon动态捕捉系统', equipment_no: 'EQ-003', brand: 'Vicon', model: 'T160', sampling_frequency: 200, status: '正常', created_at: now(), updated_at: now() },
  ],
  metrics: [
    { id: 1, metric_no: 'PR-001', metric_name: 'peak pressure', metric_name_cn: '峰值压力', unit: 'kPa', test_type: '足底压力测试', created_at: now() },
    { id: 2, metric_no: 'PR-002', metric_name: 'contact area', metric_name_cn: '接触面积', unit: 'cm2', test_type: '足底压力测试', created_at: now() },
    { id: 3, metric_no: 'FP-001', metric_name: 'vertical GRF', metric_name_cn: '垂直地面反作用力', unit: 'N', test_type: '三维力台测试', created_at: now() },
    { id: 4, metric_no: 'FP-002', metric_name: 'loading rate', metric_name_cn: '加载率', unit: 'N/s', test_type: '三维力台测试', created_at: now() },
    { id: 5, metric_no: 'MC-001', metric_name: 'ankle ROM', metric_name_cn: '踝关节活动范围', unit: 'degree', test_type: '动态捕捉测试', created_at: now() },
  ],
  testData: [
    { id: 1, data_no: 'BD-001', project_id: 1, sample_id: 1, participant_id: 1, test_type: '足底压力测试', device_name: 'FootScan', pressure_data: { peak_pressure: { heel: 32.5, metatarsal: 26.8, hallux: 18.2 } }, created_at: now(), updated_at: now() },
    { id: 2, data_no: 'BD-002', project_id: 1, sample_id: 1, participant_id: 1, test_type: '足底压力测试', pressure_data: { peak_pressure: { heel: 35.2, metatarsal: 28.1, hallux: 19.5 } }, created_at: now(), updated_at: now() },
    { id: 3, data_no: 'BD-003', project_id: 1, sample_id: 3, participant_id: 2, test_type: '足底压力测试', pressure_data: { peak_pressure: { heel: 28.1, metatarsal: 24.5, hallux: 16.8 } }, created_at: now(), updated_at: now() },
    { id: 4, data_no: 'BD-004', project_id: 1, sample_id: 3, participant_id: 2, test_type: '足底压力测试', pressure_data: { peak_pressure: { heel: 27.5, metatarsal: 23.8, hallux: 16.0 } }, created_at: now(), updated_at: now() },
    { id: 5, data_no: 'FP-001', project_id: 1, sample_id: 1, participant_id: 1, test_type: '三维力台测试', force_plate_data: { vgrf_peak: 1.82, loading_rate: 15.2 }, created_at: now(), updated_at: now() },
    { id: 6, data_no: 'MC-001', project_id: 1, sample_id: 1, participant_id: 1, test_type: '动态捕捉测试', motion_capture_data: { ankle_angle: { dorsiflexion: 15.2, plantarflexion: -25.1 } }, created_at: now(), updated_at: now() },
  ],
  protocols: [],
  analyses: [],
  reports: [],
  files: [],
  transactions: [
    { id: 1, sample_id: 1, operation_type: '入库', operator: 'system', operation_date: '2026-07-30', created_at: now() },
  ],
};

function now(): string {
  return new Date().toISOString();
}

function loadCollection(name: string): any[] {
  const key = PREFIX + name;
  const raw = localStorage.getItem(key);
  if (raw) {
    try { return JSON.parse(raw); } catch { /* ignore */ }
  }
  const seed = seedData[name];
  if (seed) {
    localStorage.setItem(key, JSON.stringify(seed));
    return [...seed];
  }
  return [];
}

function saveCollection(name: string, items: any[]) {
  localStorage.setItem(PREFIX + name, JSON.stringify(items));
}

function nextId(items: any[]): number {
  return items.length ? Math.max(...items.map(i => i.id || 0)) + 1 : 1;
}

function makeResponse(data: any, status = 200) {
  return Promise.resolve({ data, status, headers: {} });
}

function paginate(items: any[], params: Record<string, any>) {
  const page = Number(params?.skip || 0);
  const pageSize = Number(params?.limit || 50);
  return {
    items: items.slice(page, page + pageSize),
    total: items.length,
    page: Math.floor(page / pageSize) + 1,
    page_size: pageSize,
  };
}

function extractValues(td: any, path: string): number[] {
  const parts = path.split('.');
  for (const key of ['pressure_data', 'force_plate_data', 'motion_capture_data']) {
    let val = td[key];
    if (!val || typeof val !== 'object') continue;
    let ok = true;
    for (const p of parts) {
      if (val && typeof val === 'object' && p in val) val = val[p];
      else { ok = false; break; }
    }
    if (ok && typeof val === 'number') return [val];
    if (ok && val && typeof val === 'object') return Object.values(val).filter(v => typeof v === 'number');
  }
  return [];
}

function stats(values: number[]) {
  if (!values.length) return { n: 0, mean: 0, std: 0, min: 0, max: 0, median: 0 };
  const n = values.length;
  const mean = values.reduce((a, b) => a + b, 0) / n;
  const variance = values.reduce((a, b) => a + (b - mean) ** 2, 0) / (n - 1 || 1);
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(n / 2);
  return {
    n,
    mean: Math.round(mean * 1000) / 1000,
    std: Math.round(Math.sqrt(variance) * 1000) / 1000,
    min: Math.round(Math.min(...values) * 1000) / 1000,
    max: Math.round(Math.max(...values) * 1000) / 1000,
    median: n % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2,
  };
}

async function route(method: string, url: string, data?: any, params?: Record<string, any>): Promise<any> {
  // Strip leading /api and trailing slash
  const clean = url.replace(/^\/?api\/?/, '').replace(/\/$/, '');

  // Health
  if (clean === 'health' && method === 'GET') return makeResponse({ status: 'ok', version: '2.0-static' });

  const segments = clean.split('/');

  // Tasks
  if (segments[0] === 'tasks') {
    const tasks = loadCollection('tasks');
    if (segments.length === 1) {
      if (method === 'GET') {
        let items = [...tasks];
        if (params?.status) items = items.filter(t => t.status === params.status);
        if (params?.task_type) items = items.filter(t => t.task_type === params.task_type);
        if (params?.priority) items = items.filter(t => t.priority === params.priority);
        if (params?.due_date) items = items.filter(t => t.due_time && String(t.due_time).startsWith(params.due_date));
        items.sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));
        return makeResponse(paginate(items, params));
      }
      if (method === 'POST') {
        const item = { ...data, id: nextId(tasks), created_at: now(), updated_at: now() };
        tasks.push(item); saveCollection('tasks', tasks);
        return makeResponse(item, 201);
      }
    }
    if (segments[1] === 'today' && method === 'GET') {
      const today = new Date().toISOString().slice(0, 10);
      return makeResponse(tasks.filter(t => t.due_time && String(t.due_time).startsWith(today)));
    }
    if (segments[1] === 'week' && method === 'GET') {
      const d = new Date(); const day = (d.getDay() + 6) % 7;
      const start = new Date(d); start.setDate(d.getDate() - day);
      const end = new Date(start); end.setDate(start.getDate() + 6);
      const items = tasks.filter(t => t.due_time) as any[];
      return makeResponse({ items, start: start.toISOString().slice(0, 10), end: end.toISOString().slice(0, 10) });
    }
    const id = Number(segments[1]);
    if (id) {
      const idx = tasks.findIndex(t => t.id === id);
      if (idx >= 0) {
        if (method === 'GET') return makeResponse(tasks[idx]);
        if (method === 'PUT') { tasks[idx] = { ...tasks[idx], ...data, updated_at: now() }; saveCollection('tasks', tasks); return makeResponse(tasks[idx]); }
        if (method === 'DELETE') { tasks.splice(idx, 1); saveCollection('tasks', tasks); return makeResponse({ message: 'Deleted' }); }
      }
    }
  }

  // Projects
  if (segments[0] === 'projects') {
    const projects = loadCollection('projects');
    if (segments.length === 1) {
      if (method === 'GET') {
        let items = [...projects];
        if (params?.status) items = items.filter(p => p.status === params.status);
        if (params?.brand_name) items = items.filter(p => String(p.brand_name || '').includes(params.brand_name));
        items.sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));
        return makeResponse(paginate(items, params));
      }
      if (method === 'POST') {
        const item = { ...data, id: nextId(projects), created_at: now(), updated_at: now() };
        projects.push(item); saveCollection('projects', projects);
        return makeResponse(item, 201);
      }
    }
    if (segments[1] === 'current' && method === 'GET') {
      const active = projects.filter(p => !['完成', '归档'].includes(p.status));
      return makeResponse(active.slice(0, 5));
    }
    const id = Number(segments[1]);
    if (id) {
      const idx = projects.findIndex(p => p.id === id);
      if (idx >= 0) {
        if (method === 'GET') return makeResponse(projects[idx]);
        if (method === 'PUT') { projects[idx] = { ...projects[idx], ...data, updated_at: now() }; saveCollection('projects', projects); return makeResponse(projects[idx]); }
        if (method === 'DELETE') { projects.splice(idx, 1); saveCollection('projects', projects); return makeResponse({ message: 'Deleted' }); }
        if (segments[2] === 'status' && method === 'PATCH') {
          projects[idx].status = data?.status || params?.status;
          projects[idx].updated_at = now();
          saveCollection('projects', projects);
          return makeResponse(projects[idx]);
        }
      }
    }
  }

  // Samples
  if (segments[0] === 'samples') {
    const samples = loadCollection('samples');
    if (segments.length === 1) {
      if (method === 'GET') {
        let items = [...samples];
        if (params?.status) items = items.filter(s => s.status === params.status);
        if (params?.brand) items = items.filter(s => String(s.brand || '').includes(params.brand));
        return makeResponse(paginate(items, params));
      }
      if (method === 'POST') {
        const item = { ...data, id: nextId(samples), created_at: now(), updated_at: now() };
        samples.push(item); saveCollection('samples', samples);
        const txns = loadCollection('transactions');
        txns.push({ id: nextId(txns), sample_id: item.id, operation_type: '入库', operator: 'system', operation_date: now().slice(0, 10), created_at: now() });
        saveCollection('transactions', txns);
        return makeResponse(item, 201);
      }
    }
    const id = Number(segments[1]);
    if (id) {
      const idx = samples.findIndex(s => s.id === id);
      if (idx >= 0) {
        if (method === 'GET') return makeResponse(samples[idx]);
        if (method === 'PUT') { samples[idx] = { ...samples[idx], ...data, updated_at: now() }; saveCollection('samples', samples); return makeResponse(samples[idx]); }
        if (method === 'DELETE') { samples.splice(idx, 1); saveCollection('samples', samples); return makeResponse({ message: 'Deleted' }); }
        if (segments[2] === 'transactions') {
          const txns = loadCollection('transactions').filter(t => t.sample_id === id);
          if (method === 'GET') return makeResponse(txns);
          if (method === 'POST') {
            const txn = { ...data, id: nextId(loadCollection('transactions')), sample_id: id, created_at: now(), operation_date: data?.operation_date || now().slice(0, 10) };
            const all = loadCollection('transactions'); all.push(txn); saveCollection('transactions', all);
            return makeResponse(txn, 201);
          }
        }
      }
    }
  }

  // Participants
  if (segments[0] === 'participants') {
    const items = loadCollection('participants');
    if (segments.length === 1) {
      if (method === 'GET') {
        let filtered = [...items];
        if (params?.gender) filtered = filtered.filter(p => p.gender === params.gender);
        return makeResponse(paginate(filtered, params));
      }
      if (method === 'POST') {
        const item = { ...data, id: nextId(items), created_at: now(), updated_at: now() };
        items.push(item); saveCollection('participants', items); return makeResponse(item, 201);
      }
    }
    const id = Number(segments[1]);
    const idx = items.findIndex(p => p.id === id);
    if (idx >= 0) {
      if (method === 'GET') return makeResponse(items[idx]);
      if (method === 'PUT') { items[idx] = { ...items[idx], ...data, updated_at: now() }; saveCollection('participants', items); return makeResponse(items[idx]); }
      if (method === 'DELETE') { items.splice(idx, 1); saveCollection('participants', items); return makeResponse({ message: 'Deleted' }); }
    }
  }

  // Equipment
  if (segments[0] === 'equipment') {
    const items = loadCollection('equipment');
    if (segments.length === 1) {
      if (method === 'GET') {
        let filtered = [...items];
        if (params?.status) filtered = filtered.filter(e => e.status === params.status);
        return makeResponse(paginate(filtered, params));
      }
      if (method === 'POST') {
        const item = { ...data, id: nextId(items), created_at: now(), updated_at: now() };
        items.push(item); saveCollection('equipment', items); return makeResponse(item, 201);
      }
    }
    const id = Number(segments[1]);
    const idx = items.findIndex(e => e.id === id);
    if (idx >= 0) {
      if (method === 'GET') return makeResponse(items[idx]);
      if (method === 'PUT') { items[idx] = { ...items[idx], ...data, updated_at: now() }; saveCollection('equipment', items); return makeResponse(items[idx]); }
      if (method === 'DELETE') { items.splice(idx, 1); saveCollection('equipment', items); return makeResponse({ message: 'Deleted' }); }
    }
  }

  // Metrics
  if (segments[0] === 'metrics') {
    const items = loadCollection('metrics');
    if (segments.length === 1) {
      if (method === 'GET') {
        let filtered = [...items];
        if (params?.test_type) filtered = filtered.filter(m => m.test_type === params.test_type);
        return makeResponse(paginate(filtered, params));
      }
      if (method === 'POST') {
        const item = { ...data, id: nextId(items), created_at: now() };
        items.push(item); saveCollection('metrics', items); return makeResponse(item, 201);
      }
    }
    const id = Number(segments[1]);
    const idx = items.findIndex(m => m.id === id);
    if (idx >= 0) {
      if (method === 'GET') return makeResponse(items[idx]);
      if (method === 'PUT') { items[idx] = { ...items[idx], ...data }; saveCollection('metrics', items); return makeResponse(items[idx]); }
      if (method === 'DELETE') { items.splice(idx, 1); saveCollection('metrics', items); return makeResponse({ message: 'Deleted' }); }
    }
  }

  // Protocols
  if (segments[0] === 'protocols') {
    const items = loadCollection('protocols');
    if (segments.length === 1) {
      if (method === 'GET') {
        let filtered = [...items];
        if (params?.is_active !== undefined) filtered = filtered.filter(p => p.is_active === params.is_active);
        return makeResponse(paginate(filtered, params));
      }
      if (method === 'POST') {
        const item = { ...data, id: nextId(items), created_at: now(), updated_at: now() };
        items.push(item); saveCollection('protocols', items); return makeResponse(item, 201);
      }
    }
    const id = Number(segments[1]);
    const idx = items.findIndex(p => p.id === id);
    if (idx >= 0) {
      if (method === 'GET') return makeResponse(items[idx]);
      if (method === 'PUT') { items[idx] = { ...items[idx], ...data, updated_at: now() }; saveCollection('protocols', items); return makeResponse(items[idx]); }
      if (method === 'DELETE') { items.splice(idx, 1); saveCollection('protocols', items); return makeResponse({ message: 'Deleted' }); }
    }
  }

  // Test Data
  if (segments[0] === 'test-data') {
    const items = loadCollection('testData');
    if (segments.length === 1) {
      if (method === 'GET') {
        let filtered = [...items];
        if (params?.project_id) filtered = filtered.filter(d => d.project_id === Number(params.project_id));
        if (params?.test_type) filtered = filtered.filter(d => d.test_type === params.test_type);
        return makeResponse(paginate(filtered, params));
      }
      if (method === 'POST') {
        const item = { ...data, id: nextId(items), created_at: now(), updated_at: now() };
        items.push(item); saveCollection('testData', items); return makeResponse(item, 201);
      }
    }
    if (segments[1] === 'recent' && method === 'GET') {
      return makeResponse([...items].sort((a, b) => (b.created_at || '').localeCompare(a.created_at || '')).slice(0, 10));
    }
    const id = Number(segments[1]);
    const idx = items.findIndex(d => d.id === id);
    if (idx >= 0) {
      if (method === 'GET') return makeResponse(items[idx]);
      if (method === 'PUT') { items[idx] = { ...items[idx], ...data, updated_at: now() }; saveCollection('testData', items); return makeResponse(items[idx]); }
      if (method === 'DELETE') { items.splice(idx, 1); saveCollection('testData', items); return makeResponse({ message: 'Deleted' }); }
    }
  }

  // Files
  if (segments[0] === 'files') {
    const items = loadCollection('files');
    if (segments.length === 1 && method === 'GET') {
      let filtered = [...items];
      if (params?.project_id) filtered = filtered.filter(f => f.project_id === Number(params.project_id));
      return makeResponse(paginate(filtered, params));
    }
    if (segments[1] === 'recent' && method === 'GET') {
      return makeResponse([...items].sort((a, b) => (b.created_at || '').localeCompare(a.created_at || '')).slice(0, 10));
    }
    if (segments[1] === 'upload' && method === 'POST') {
      const item = { id: nextId(items), file_no: `F-${Date.now()}`, file_name: data?.file_name || 'uploaded-file', file_type: data?.file_type || '其他', storage_path: 'local', file_size_bytes: data?.file_size_bytes || 0, uploader: data?.uploader || 'user', upload_time: now(), created_at: now(), description: data?.description || '' };
      items.push(item); saveCollection('files', items); return makeResponse(item, 201);
    }
    const id = Number(segments[1]);
    const idx = items.findIndex(f => f.id === id);
    if (idx >= 0 && method === 'DELETE') { items.splice(idx, 1); saveCollection('files', items); return makeResponse({ message: 'Deleted' }); }
  }

  // Reports
  if (segments[0] === 'reports') {
    const items = loadCollection('reports');
    if (segments.length === 1 && method === 'GET') {
      let filtered = [...items];
      if (params?.project_id) filtered = filtered.filter(r => r.project_id === Number(params.project_id));
      return makeResponse(filtered);
    }
    if (segments.length === 1 && method === 'POST') {
      const item = { ...data, id: nextId(items), status: '草稿', created_at: now() };
      items.push(item); saveCollection('reports', items); return makeResponse(item, 201);
    }
    if (segments[2] === 'generate' && method === 'POST') {
      const id = Number(segments[1]);
      const idx = items.findIndex(r => r.id === id);
      if (idx >= 0) {
        items[idx].status = 'Generated';
        items[idx].file_id = id;
        saveCollection('reports', items);
        // Also create a file record
        const files = loadCollection('files');
        files.push({ id: nextId(files), file_no: `RPT-${id}`, file_name: `${items[idx].report_name || 'report'}.txt`, file_type: '其他', storage_path: 'local', file_size_bytes: 1024, project_id: items[idx].project_id, uploader: 'system', upload_time: now(), created_at: now() });
        saveCollection('files', files);
        return makeResponse({ id, status: 'Generated', file_id: id });
      }
    }
    const id = Number(segments[1]);
    const idx = items.findIndex(r => r.id === id);
    if (idx >= 0 && method === 'DELETE') { items.splice(idx, 1); saveCollection('reports', items); return makeResponse({ message: 'Deleted' }); }
  }

  // Analysis
  if (segments[0] === 'analysis') {
    if (segments[1] === 'history' && method === 'GET') {
      const pid = Number(segments[2]);
      return makeResponse(loadCollection('analyses').filter(a => a.project_id === pid));
    }
    if (segments[1] === 'descriptive' && method === 'POST') {
      const projectId = Number(data?.project_id || params?.project_id);
      const path = data?.metric_path || params?.metric_path;
      const name = data?.metric_name || params?.metric_name || path;
      const unit = data?.unit || params?.unit || '';
      const tds = loadCollection('testData').filter(t => t.project_id === projectId);
      const values: number[] = [];
      tds.forEach(td => values.push(...extractValues(td, path)));
      const result = { metric_name: name, metric_path: path, unit, stats: stats(values), data_sample: values.slice(0, 50) };
      const analyses = loadCollection('analyses');
      analyses.push({ id: nextId(analyses), project_id: projectId, analysis_name: `Descriptive: ${name}`, analysis_type: 'descriptive', parameters: { metric_path: path }, result_data: result, created_at: now() });
      saveCollection('analyses', analyses);
      return makeResponse(result);
    }
    if (segments[1] === 'shoe-comparison' && method === 'POST') {
      const projectId = Number(data?.project_id || params?.project_id);
      const path = data?.metric_path || params?.metric_path;
      const name = data?.metric_name || params?.metric_name || path;
      const unit = data?.unit || params?.unit || '';
      const tds = loadCollection('testData').filter(t => t.project_id === projectId);
      const samples = loadCollection('samples');
      const groups: Record<string, number[]> = {};
      tds.forEach(td => {
        const sample = samples.find(s => s.id === td.sample_id);
        const label = sample ? `${sample.brand || '?'} ${sample.shoe_name || '?'}` : `Sample#${td.sample_id}`;
        const vals = extractValues(td, path);
        if (vals.length) {
          if (!groups[label]) groups[label] = [];
          groups[label].push(...vals);
        }
      });
      const comparison: Record<string, any> = {};
      Object.entries(groups).forEach(([label, vals]) => { comparison[label] = stats(vals); });
      const result = { metric_name: name, metric_path: path, unit, comparison };
      const analyses = loadCollection('analyses');
      analyses.push({ id: nextId(analyses), project_id: projectId, analysis_name: `Shoe Comparison: ${name}`, analysis_type: 'shoe_comparison', parameters: { metric_path: path }, result_data: result, created_at: now() });
      saveCollection('analyses', analyses);
      return makeResponse(result);
    }
  }

  // Dashboard
  if (segments[0] === 'dashboard' && method === 'GET') {
    const today = new Date().toISOString().slice(0, 10);
    const tasks = loadCollection('tasks');
    const projects = loadCollection('projects');
    const tds = loadCollection('testData');
    const files = loadCollection('files');
    return makeResponse({
      today_tasks: tasks.filter(t => t.due_time && String(t.due_time).startsWith(today)),
      current_projects: projects.filter(p => !['完成', '归档'].includes(p.status)).slice(0, 5),
      recent_test_data: [...tds].sort((a, b) => (b.created_at || '').localeCompare(a.created_at || '')).slice(0, 10),
      recent_files: [...files].sort((a, b) => (b.created_at || '').localeCompare(a.created_at || '')).slice(0, 10),
    });
  }

  return Promise.reject(new Error(`Unhandled route: ${method} /api/${clean}`));
}

// Export data backup / restore helpers
export const backupStore = {
  exportAll(): string {
    const collections: Record<string, any[]> = {};
    Object.keys(seedData).forEach(name => { collections[name] = loadCollection(name); });
    return JSON.stringify({ app: 'biomechanics-lab', version: 1, exportedAt: new Date().toISOString(), data: collections }, null, 2);
  },
  importAll(json: string): boolean {
    try {
      const parsed = JSON.parse(json);
      if (!parsed.data || typeof parsed.data !== 'object') return false;
      Object.entries(parsed.data).forEach(([name, items]) => {
        if (Array.isArray(items)) saveCollection(name, items);
      });
      return true;
    } catch { return false; }
  },
};

const apiClient = {
  get: (url: string, config?: any) => route('GET', url, undefined, config?.params),
  post: (url: string, data?: any, config?: any) => route('POST', url, data, config?.params),
  put: (url: string, data?: any, config?: any) => route('PUT', url, data, config?.params),
  patch: (url: string, data?: any, config?: any) => route('PATCH', url, data, config?.params),
  delete: (url: string, config?: any) => route('DELETE', url, undefined, config?.params),
};

export default apiClient;
