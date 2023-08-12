CREATE DATABASE blockchain
CREATE TABLE transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id VARCHAR(255) NOT NULL,
    amount VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    tx_hash VARCHAR(255) NOT NULL,
    create_time BIGINT NOT NULL,
    token_name VARCHAR(255) NOT NULL
);


CREATE TABLE creations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id VARCHAR(255) NOT NULL,
    contract_addr VARCHAR(80) NOT NULL
);