--  Manara-Nexus — MySQL Database Schema

CREATE DATABASE IF NOT EXISTS manara_nexus
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE manara_nexus;

-- ── USERS (base table for all roles) ──────────────
CREATE TABLE IF NOT EXISTS users (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(100)        NOT NULL,
  email         VARCHAR(150)        NOT NULL UNIQUE,
  password      VARCHAR(255)        NOT NULL,
  phone         VARCHAR(15)         NOT NULL,
  role          ENUM('admin','donor','volunteer') NOT NULL,
  city          ENUM('Bengaluru','Hyderabad','Chennai','Mumbai') NOT NULL,
  is_active     TINYINT(1)          NOT NULL DEFAULT 1,
  created_at    TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role  (role)
) ENGINE=InnoDB;

-- ── ADMINS ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admins (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id    INT UNSIGNED NOT NULL UNIQUE,
  username   VARCHAR(80)  NOT NULL UNIQUE,
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ── DONORS ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS donors (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id         INT UNSIGNED  NOT NULL UNIQUE,
  address         TEXT,
  bank_name       VARCHAR(100),
  ifsc_code       VARCHAR(20),
  account_number  VARCHAR(30),
  total_donated   DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  created_at      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ── VOLUNTEERS ────────────────────────────────────
CREATE TABLE IF NOT EXISTS volunteers (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id     INT UNSIGNED NOT NULL UNIQUE,
  interests   TEXT,
  dob         DATE,
  tasks_done  INT UNSIGNED NOT NULL DEFAULT 0,
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ── CAMPAIGNS ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS campaigns (
  id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  admin_id         INT UNSIGNED   NOT NULL,
  title            VARCHAR(200)   NOT NULL,
  description      TEXT           NOT NULL,
  target_amount    DECIMAL(14,2)  NOT NULL DEFAULT 0.00,
  collected_amount DECIMAL(14,2)  NOT NULL DEFAULT 0.00,
  start_date       DATE           NOT NULL,
  end_date         DATE           NOT NULL,
  status           ENUM('active','inactive','completed','cancelled') NOT NULL DEFAULT 'active',
  banner_image     VARCHAR(255),
  city             ENUM('Bengaluru','Hyderabad','Chennai','Mumbai','All'),
  created_at       TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_id) REFERENCES users(id),
  INDEX idx_status (status)
) ENGINE=InnoDB;

-- ── DONATIONS ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS donations (
  id                  INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  donor_id            INT UNSIGNED   NOT NULL,
  campaign_id         INT UNSIGNED,
  amount              DECIMAL(12,2)  NOT NULL,
  payment_mode        ENUM('cash','upi','bank_transfer','cheque','online') NOT NULL,
  status              ENUM('pending','verified','rejected') NOT NULL DEFAULT 'pending',
  receipt_number      VARCHAR(50)    NOT NULL UNIQUE,
  transaction_ref     VARCHAR(100),
  razorpay_order_id   VARCHAR(100),
  razorpay_payment_id VARCHAR(100),
  razorpay_signature  VARCHAR(255),
  verified_by         INT UNSIGNED,
  verified_at         TIMESTAMP      NULL,
  notes               TEXT,
  created_at          TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (donor_id)    REFERENCES users(id),
  FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE SET NULL,
  FOREIGN KEY (verified_by) REFERENCES users(id)     ON DELETE SET NULL,
  INDEX idx_donor    (donor_id),
  INDEX idx_campaign (campaign_id),
  INDEX idx_status   (status)
) ENGINE=InnoDB;

-- ── DONATED ITEMS ─────────────────────────────────
CREATE TABLE IF NOT EXISTS donated_items (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  donor_id        INT UNSIGNED NOT NULL,
  item_name       VARCHAR(150) NOT NULL,
  category        VARCHAR(100),
  quantity        INT UNSIGNED NOT NULL DEFAULT 1,
  item_condition  ENUM('new','good','fair','poor') NOT NULL DEFAULT 'good',
  pickup_required TINYINT(1)   NOT NULL DEFAULT 0,
  status          ENUM('pending','received','distributed') NOT NULL DEFAULT 'pending',
  notes           TEXT,
  created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (donor_id) REFERENCES users(id),
  INDEX idx_donor  (donor_id),
  INDEX idx_status (status)
) ENGINE=InnoDB;

-- ── TRANSACTIONS ──────────────────────────────────
CREATE TABLE IF NOT EXISTS transactions (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  donation_id  INT UNSIGNED   NOT NULL UNIQUE,
  donor_id     INT UNSIGNED   NOT NULL,
  amount       DECIMAL(12,2)  NOT NULL,
  type         ENUM('credit','debit') NOT NULL DEFAULT 'credit',
  description  VARCHAR(255),
  created_at   TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (donation_id) REFERENCES donations(id) ON DELETE CASCADE,
  FOREIGN KEY (donor_id)    REFERENCES users(id),
  INDEX idx_donor (donor_id)
) ENGINE=InnoDB;

-- ── TASKS ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tasks (
  id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  campaign_id    INT UNSIGNED,
  assigned_by    INT UNSIGNED NOT NULL,
  assigned_to    INT UNSIGNED,
  title          VARCHAR(200) NOT NULL,
  description    TEXT,
  priority       ENUM('low','medium','high','urgent') NOT NULL DEFAULT 'medium',
  status         ENUM('open','accepted','in_progress','completed','cancelled') NOT NULL DEFAULT 'open',
  due_date       DATE,
  completed_at   TIMESTAMP NULL,
  created_at     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE SET NULL,
  FOREIGN KEY (assigned_by) REFERENCES users(id),
  FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_assigned_to (assigned_to),
  INDEX idx_status      (status)
) ENGINE=InnoDB;

-- ── CONTACT MESSAGES ──────────────────────────────
CREATE TABLE IF NOT EXISTS contact_messages (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(150) NOT NULL,
  subject    VARCHAR(200),
  message    TEXT         NOT NULL,
  is_read    TINYINT(1)   NOT NULL DEFAULT 0,
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_is_read (is_read)
) ENGINE=InnoDB;

-- ── NOTIFICATIONS ─────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id    INT UNSIGNED NOT NULL,
  type       VARCHAR(50)  NOT NULL,
  title      VARCHAR(200) NOT NULL,
  message    TEXT         NOT NULL,
  is_read    TINYINT(1)   NOT NULL DEFAULT 0,
  ref_id     INT UNSIGNED,
  ref_type   VARCHAR(50),
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user   (user_id),
  INDEX idx_is_read(is_read)
) ENGINE=InnoDB;
