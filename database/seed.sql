-- Seed data for development
-- Users
INSERT INTO users (username, display_name, hashed_password, role)
VALUES ('admin', '管理员', 'placeholder_hash', 'admin');

-- Sample projects
INSERT INTO biomechanical_test_projects (project_no, project_name, brand_name, shoe_name, shoe_type, heel_height_mm, heel_type, status, responsible_person)
VALUES
('HP-2026-001', 'A品牌细跟鞋稳定性评估', 'A品牌', '优雅系列细跟高跟鞋', '细跟鞋', 80, '细跟', '待准备', '张三'),
('HP-2026-002', 'B品牌坡跟鞋舒适度测试', 'B品牌', '舒适系列坡跟鞋', '坡跟鞋', 50, '坡跟', '样品确认', '李四');

-- Sample participants
INSERT INTO participants (participant_no, gender, age, height_cm, weight_kg, shoe_size)
VALUES
('P-2026-001', '女', 25, 165.0, 55.0, 38),
('P-2026-002', '女', 30, 170.0, 60.0, 39),
('P-2026-003', '女', 28, 158.0, 50.0, 36);

-- Sample shoes
INSERT INTO shoe_samples (sample_no, brand, shoe_name, shoe_type, shoe_size, heel_height_mm, heel_structure, color, quantity, status)
VALUES
('SH-2026-001', 'A品牌', '优雅系列细跟高跟鞋', '细跟鞋', 38, 80, '金属细跟', '黑色', 2, '库存'),
('SH-2026-002', 'A品牌', '优雅系列细跟高跟鞋', '细跟鞋', 39, 80, '金属细跟', '黑色', 2, '库存'),
('SH-2026-003', 'B品牌', '舒适系列坡跟鞋', '坡跟鞋', 38, 50, 'EVA坡跟', '米色', 3, '库存');
