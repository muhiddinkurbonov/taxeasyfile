USE taxeasyfile_db;

INSERT INTO users (username, password, email, role) VALUES
('cpa1', 'pass1', 'cpa1@example.com', 'CPA'),
('cpa2', 'pass2', 'cpa2@example.com', 'CPA'),
('admin', 'pass3', 'admin@example.com', 'ADMIN');


INSERT INTO categories (name) VALUES
('Corporate'),
('Military'),
('Education');

INSERT INTO tax_year_limits (tax_year, max_capacity) VALUES
(2024, 100), 
(2025, 120); 

INSERT INTO clients (name, tin, email, cpa_id) VALUES
('John Doe', '123-45-6789', 'john.doe@example.com', 1),
('Jane Smith', '987-65-4321', 'jane.smith@example.com', 2);

INSERT INTO tax_returns (client_id, tax_year, tax_return_status, filing_date, total_income, category_id, cpa_id, file_attachment) VALUES
(1, 2024, 'PENDING', NULL, 75000.00, 1, 1, '/uploads/return_john_2024.pdf'), 
(2, 2024, 'IN_PROGRESS', '2025-03-15', 60000.00, 2, 2, '/uploads/return_jane_2024.pdf'); 


SELECT * FROM users;
SELECT * FROM categories;     
SELECT * FROM tax_year_limits;  
SELECT * FROM clients;          
SELECT * FROM tax_returns;      