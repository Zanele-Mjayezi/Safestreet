-- Test Users (password: 'password' encoded with BCrypt)
INSERT INTO users (id, username, email, password, phone, role, subscription_plan, subscription_active, full_name, created_at)
VALUES
    (1, 'admin', 'admin@safestreet.co.za', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EO', '0712345678', 'ADMIN', 'PREMIUM_SHIELD', true, 'System Administrator', NOW()),
    (2, 'guard1', 'guard1@safestreet.co.za', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EO', '0723456789', 'GUARD', 'ADVANCED_GUARD', true, 'Thabo Mokoena', NOW()),
    (3, 'guard2', 'guard2@safestreet.co.za', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EO', '0734567890', 'GUARD', 'ADVANCED_GUARD', true, 'Sarah Nkosi', NOW()),
    (4, 'resident1', 'resident1@gmail.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EO', '0745678901', 'RESIDENT', 'STANDARD_PROTECTION', true, 'Zanele Mashifane', NOW()),
    (5, 'resident2', 'resident2@gmail.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EO', '0756789012', 'RESIDENT', 'ADVANCED_GUARD', true, 'Result Mhlongo', NOW()),
    (6, 'trader1', 'trader1@gmail.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EO', '0767890123', 'RESIDENT', 'STANDARD_PROTECTION', true, 'Naledi Ngobeni', NOW());

-- Sample Incidents
INSERT INTO incidents (id, type, description, location, latitude, longitude, reporter_id, status, created_at)
VALUES
    (1, 'THEFT', 'Phone stolen near taxi rank', 'Site C Taxi Rank', -34.0423, 18.6765, 4, 'RESOLVED', DATE_SUB(NOW(), INTERVAL 2 DAY)),
    (2, 'SUSPICIOUS_PERSON', 'Unknown person lurking around backyard', 'Site B, Block 45', -34.0389, 18.6742, 5, 'ACTIVE', DATE_SUB(NOW(), INTERVAL 5 HOUR)),
    (3, 'TRAFFIC_INCIDENT', 'Car accident at main intersection', 'Mew Way & Spine Road', -34.0456, 18.6789, 4, 'ACTIVE', DATE_SUB(NOW(), INTERVAL 1 HOUR)),
    (4, 'VANDALISM', 'Street light damaged', 'Site C, Main Road', -34.0412, 18.6756, 6, 'PENDING', DATE_SUB(NOW(), INTERVAL 1 DAY));

-- Sample Subscriptions
INSERT INTO subscriptions (id, user_id, plan_type, amount, start_date, end_date, status, payment_method, created_at)
VALUES
    (1, 4, 'STANDARD_PROTECTION', 14.99, DATE_SUB(NOW(), INTERVAL 1 MONTH), DATE_ADD(NOW(), INTERVAL 1 MONTH), 'ACTIVE', 'VISA ****1234', NOW()),
    (2, 5, 'ADVANCED_GUARD', 29.99, DATE_SUB(NOW(), INTERVAL 2 MONTH), DATE_ADD(NOW(), INTERVAL 1 MONTH), 'ACTIVE', 'VISA ****5678', NOW()),
    (3, 6, 'STANDARD_PROTECTION', 14.99, DATE_SUB(NOW(), INTERVAL 15 DAY), DATE_ADD(NOW(), INTERVAL 15 DAY), 'ACTIVE', 'CASH', NOW()),
    (4, 1, 'PREMIUM_SHIELD', 49.99, DATE_SUB(NOW(), INTERVAL 3 MONTH), DATE_ADD(NOW(), INTERVAL 1 MONTH), 'ACTIVE', 'VISA ****9999', NOW());

-- Sample Patrols
INSERT INTO patrols (id, guard_id, status, start_time, current_lat, current_lng, patrol_area)
VALUES
    (1, 2, 'ACTIVE', DATE_SUB(NOW(), INTERVAL 2 HOUR), -34.0400, 18.6750, 'Site C Central'),
    (2, 3, 'ACTIVE', DATE_SUB(NOW(), INTERVAL 1 HOUR), -34.0380, 18.6740, 'Site B North');