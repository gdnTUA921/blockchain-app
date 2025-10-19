# 🪙 Blockchain Web Application  
_A simple blockchain simulation built using React (frontend), Laravel (backend), and PostgreSQL (database)._

---

## 🚀 Overview
This project demonstrates the core principles of blockchain technology — block creation, transaction mining, and chain validation — implemented through a modern full-stack web architecture.

Users can:
- Add transactions (sender, receiver, amount)
- Mine pending transactions into new blocks
- Validate the blockchain’s integrity
- View all blocks and transactions in a sleek, responsive dashboard

---

## 🧰 Tech Stack

| Layer | Technology | Description |
|-------|-------------|-------------|
| **Frontend** | React + Vite + TailwindCSS | Responsive UI with gradient dark theme |
| **Backend** | Laravel 12 (PHP 8.3) | API server handling blockchain logic |
| **Database** | PostgreSQL 15 | Stores blocks, transactions, and links |
| **Containerization** | Docker & Docker Compose | Unified environment for backend, frontend, and DB |

---

## 📁 Project Structure

```

BlockchainApp/
├── backend/            # Laravel backend
│   ├── app/Models/
│   │   ├── Block.php
│   │   ├── Transaction.php
│   ├── app/Services/BlockchainService.php
│   ├── app/Http/Controllers/
│   │   ├── BlockController.php
│   │   ├── TransactionController.php
│   │   └── BlockchainController.php
│   ├── routes/api.php
│   ├── database/migrations/
│   └── database/seeders/BlockchainSeeder.php
│
├── frontend/           # React + Tailwind + Vite
│   ├── src/pages/
│   │   ├── Dashboard.jsx
│   │   ├── Transactions.jsx
│   │   └── Blocks.jsx
│   ├── src/components/Navbar.jsx
│   ├── src/services/api.js
│   └── src/index.css
│
├── docker-compose.yml
├── .env
└── README.md

```

---

## 🧱 Backend Architecture

### 🔗 BlockchainService Logic (Laravel)

Located in: `app/Services/BlockchainService.php`

This class handles the blockchain’s core processes:

1. **Block Hashing**
   - Combines the block’s data (`index_no`, `timestamp`, `transactions`, `previous_hash`, `nonce`) into a JSON payload.
   - Hashes it with SHA-256.
   - Each block’s hash depends on its content and previous block’s hash.

2. **Mining Algorithm**
   - Implements a proof-of-work system by incrementing `nonce` until a hash begins with a set number of zeros (`difficulty = 2`).
   - When a valid hash is found, the block is created and transactions are linked.

3. **Validation**
   - Recomputes the hash of every block in order.
   - Checks that:
     - Each recomputed hash matches the stored one.
     - Each block’s `previous_hash` matches the actual hash of the block before it.
   - Returns `true` only if the entire chain is valid.

4. **Mining Pending Transactions**
   - Gathers all transactions marked as “pending”.
   - Mines them into a new block.
   - Updates their status to “mined”.
   - Saves the mined block in the database.

**Simplified Flow:**
```

Transactions → Pending Pool → Mine Block → Add Block → Validate Chain

````

---

## 🧮 Database Schema

| Table | Columns | Description |
|--------|----------|-------------|
| **blocks** | id, index_no, previous_hash, current_hash, nonce, timestamp | Stores all mined blocks |
| **transactions** | id, sender, receiver, amount, status, timestamp | Stores all blockchain transactions |
| **block_transaction** | block_id, transaction_id | Pivot table linking transactions to blocks |

---

## ⚙️ API Endpoints

| Endpoint | Method | Description |
|-----------|--------|-------------|
| `/api/transactions/pending` | GET | Get all pending transactions |
| `/api/transaction` | POST | Add a new transaction |
| `/api/block/mine` | POST | Mine pending transactions into a block |
| `/api/blockchain/validate` | GET | Validate blockchain integrity |
| `/api/blocks` | GET | Retrieve all mined blocks |

Example Response:
```json
{
  "id": 1,
  "index_no": 0,
  "current_hash": "00f5cd5...",
  "previous_hash": null,
  "nonce": 218,
  "timestamp": "2025-10-18T12:15:40Z",
  "transactions": []
}
````

---

## 🖥️ Frontend Features

| Page             | Description                                                              |
| ---------------- | ------------------------------------------------------------------------ |
| **Dashboard**    | Shows pending transaction count, blockchain validity, and mining actions |
| **Transactions** | Add and list pending transactions                                        |
| **Blocks**       | View all mined blocks with readable hashes                               |
| **Navbar**       | Quick navigation between modules                                         |

### 🎨 Theme

* Dark indigo-purple gradient background
* Frosted-glass cards
* Neon-style glowing hover effects

---

## 🐳 Docker Setup

### 1️⃣ Build & Run All Services

```bash
docker compose up --build
```

* Backend API → [http://localhost:8000](http://localhost:8000)
* Frontend UI → [http://localhost:5173](http://localhost:5173)
* PostgreSQL → Port 5432 (user/pass from `.env`)

### 2️⃣ Stop Containers

```bash
docker compose down
```

### 3️⃣ Useful Commands

```bash
# Run migrations manually
docker exec -it blockchain-backend php artisan migrate

# Enter backend shell
docker exec -it blockchain-backend bash

# View logs
docker compose logs -f
```

---

## ⚙️ Manual Setup (Without Docker)

1. **Backend**

   ```bash
   cd backend
   composer install
   cp .env.example .env
   php artisan key:generate
   php artisan migrate --seed
   php artisan serve
   ```

   > Runs at [http://localhost:8000](http://localhost:8000)

2. **Frontend**

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

   > Runs at [http://localhost:5173](http://localhost:5173)

---

## 🧩 Example Flow

1. Add new transactions via the UI or Postman
2. Mine pending transactions → creates a new block
3. Validate blockchain → checks hash consistency
4. View results in the Blocks page

---

## 🧠 How the Blockchain Logic Works

1. Each transaction is first **pending** and stored in the DB.
2. When mining starts:

   * The system forms a new block with all pending transactions.
   * The block’s hash is calculated using SHA-256.
   * Proof-of-work ensures the hash starts with two leading zeros (`00`).
   * Once mined, the block and its transactions are marked as complete.
3. The **chain integrity** depends on the `previous_hash` linking each block to its predecessor.
   Any change in one block’s data invalidates all blocks after it.

This demonstrates the core blockchain concept of **immutability**.

---

## 🧾 Credits

Developed by: **Giancarlo D. Nonato -- (4ITSE01)**
Trinity University of Asia – Individual Project 2
Course: **Information Assurance and Security 2**

---
