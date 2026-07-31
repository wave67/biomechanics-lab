// localStorage mock
globalThis.localStorage = {
  _store: {},
  getItem(k) { return this._store[k] ?? null; },
  setItem(k, v) { this._store[k] = String(v); },
  removeItem(k) { delete this._store[k]; },
  clear() { this._store = {}; },
};

// Import the real client.ts (Node 24 strips TS types)
const mod = await import("../frontend/src/api/client.ts");
const apiClient = mod.default;

const results = [];
async function test(name, fn) {
  try { const r = await fn(); results.push(`PASS: ${name} -> ${r}`); }
  catch (e) { results.push(`FAIL: ${name} -> ${e.message}`); }
}

await test("GET /tasks/", async () => { const r = await apiClient.get("/tasks/"); return `total=${r.data.total}`; });
await test("POST /tasks/", async () => { const r = await apiClient.post("/tasks/", { user_id: 1, title: "验证任务", task_type: "实验执行", priority: "高" }); return `id=${r.data.id}`; });
await test("GET /tasks/ after create", async () => { const r = await apiClient.get("/tasks/"); return `total=${r.data.total}`; });
await test("POST /samples/", async () => { const r = await apiClient.post("/samples/", { sample_no: "SH-T", quantity: 1 }); return `id=${r.data.id}`; });
await test("GET /projects/", async () => { const r = await apiClient.get("/projects/"); return `total=${r.data.total}`; });
await test("POST /projects/", async () => { const r = await apiClient.post("/projects/", { project_no: "HP-T", project_name: "项目", status: "待准备" }); return `id=${r.data.id}`; });
await test("POST /analysis/descriptive", async () => { const r = await apiClient.post("/analysis/descriptive", null, { params: { project_id: 1, metric_path: "peak_pressure.heel" } }); return `N=${r.data.stats.n}`; });
await test("GET /analysis/history/1", async () => { const r = await apiClient.get("/analysis/history/1"); return `count=${r.data.length}`; });
await test("POST /reports/", async () => { const r = await apiClient.post("/reports/", { project_id: 1, report_name: "R", report_type: "PPTX" }); return `id=${r.data.id}`; });
await test("POST /reports/1/generate", async () => { const r = await apiClient.post("/reports/1/generate"); return `status=${r.data.status}`; });
await test("GET /dashboard", async () => { const r = await apiClient.get("/dashboard"); return `projects=${r.data.current_projects.length}`; });
await test("GET /metrics/", async () => { const r = await apiClient.get("/metrics/"); return `total=${r.data.total}`; });
await test("GET /equipment/", async () => { const r = await apiClient.get("/equipment/"); return `total=${r.data.total}`; });
await test("GET /protocols/", async () => { const r = await apiClient.get("/protocols/"); return `total=${r.data.total}`; });
await test("GET /participants/", async () => { const r = await apiClient.get("/participants/"); return `total=${r.data.total}`; });
await test("GET /files/", async () => { const r = await apiClient.get("/files/"); return `total=${r.data.total}`; });

console.log(results.join("\n"));
const fails = results.filter(r => r.startsWith("FAIL"));
console.log(`\n${results.length - fails.length}/${results.length} passed`);
if (fails.length) process.exit(1);
