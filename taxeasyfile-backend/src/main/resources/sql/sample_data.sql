USE taxeasyfile_db;

INSERT INTO cpas (cpa_username, cpa_password, cpa_email) VALUES
('johncpa', 'pass123', 'john.cpa@example.com'),
('sarahcpa', 'secure456', 'sarah.cpa@example.com');

INSERT INTO clients (client_name, client_tin, client_email, cpa_id) VALUES
('Alice Johnson', '123-45-6789', 'alice@example.com', 1),     
('Bob Smith', '987-65-4321', 'bob@example.com', 1),          
('Carol White', '456-78-9123', 'carol@example.com', 2);       

INSERT INTO categories (category_name, max_capacity, cpa_id) VALUES
('Corporate', 150, 1),  
('Military', 100, 1),    
('Education', 200, 2);     

INSERT INTO tax_returns (client_id, tax_year, tax_return_status, filing_date, total_income, category_id, cpa_id) VALUES
(1, 2022, 'COMPLETED', '2023-04-15', 75000.00, 1, 1),   
(1, 2023, 'PENDING', NULL, 80000.00, 2, 1),             
(2, 2022, 'IN_PROGRESS', NULL, 65000.00, NULL, 1),      
(3, 2022, 'COMPLETED', '2023-04-10', 90000.00, 3, 2);  