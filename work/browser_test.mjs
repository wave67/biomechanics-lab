import { chromium } from "playwright";

const browser = await chromium.launch({
  headless: true,
  executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"
});
const page = await browser.newPage();
const errors = [];
page.on("console", m => { if (m.type() === "error") errors.push(m.text()); });
page.on("pageerror", e => errors.push("PAGE ERROR: " + e.message));

console.log("=== Test 1: Open Tasks page ===");
await page.goto("http://localhost:8080/#/tasks", { waitUntil: "networkidle" });
await page.waitForTimeout(2000);
let text = await page.locator("body").innerText();
console.log("Page text sample:", text.substring(0, 300).replace(/\n+/g, " | "));

console.log("\n=== Test 2: Create a task ===");
// Click the New Task button
const newBtn = page.getByRole("button", { name: /新建任务/ });
if (await newBtn.isVisible().catch(() => false)) {
  await newBtn.click();
  await page.waitForTimeout(500);
  // Fill form
  const titleInput = page.locator("#title").first();
  if (await titleInput.isVisible().catch(() => false)) {
    await titleInput.fill("测试任务-浏览器验证");
    // Select task type
    await page.locator("#task_type").first().click();
    await page.waitForTimeout(300);
    await page.locator(".ant-select-item-option", { hasText: "日常事务" }).first().click();
    await page.waitForTimeout(300);
    // Priority should default to 中 - set 高
    await page.locator("#priority").first().click();
    await page.waitForTimeout(300);
    await page.locator(".ant-select-item-option", { hasText: "高" }).first().click();
    await page.waitForTimeout(300);
    // Submit
    await page.locator(".ant-modal-footer .ant-btn-primary").click();
    await page.waitForTimeout(1500);
    text = await page.locator("body").innerText();
    console.log("After submit, page contains test task:", text.includes("测试任务-浏览器验证"));
  } else {
    console.log("Form title input not visible");
  }
} else {
  console.log("New Task button not found");
}

console.log("\nConsole errors:", JSON.stringify(errors.slice(0, 8)));

await browser.close();
console.log("\n=== Test complete ===");
