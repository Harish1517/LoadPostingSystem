# 🚛 Load Posting System

## 📌 Project Description

The **Load Posting System** is a web platform that connects **shippers** and **truckers** for efficient load transportation. Shippers can post loads, truckers can search and bid on available loads, and shippers can confirm truckers based on bids. The system enforces trucker eligibility criteria and supports real-time bidding and load management.

---

## 🛠️ Setup & Installation

### **1. Clone the Repository**

```sh
 git clone https://github.com/Harish1517/LoadPostingSystem.git
 cd LoadPostingSystem
```

### **2. Backend Setup** (Node.js + Express + MongoDB)

#### **Install Dependencies**

```sh
 cd server
 npm install
```

#### **Create a `.env` file**

```sh
PORT=5000
MONGO_URI=mongodb://localhost:27017/your_db_name
```

#### **Run the Backend**

```sh
 npm start
```

Backend will be running at **`http://localhost:5000`**

### **3. Frontend Setup** (Next.js + React Bootstrap)

#### **Install Dependencies**

```sh
 cd client
 npm install
```

#### **Run the Frontend**

```sh
 npm run dev
```

Frontend will be running at **`http://localhost:3000`**

---

## 📊 Models & Datasets Used

### **1. User Model (Shipper & Trucker)**

- Stores user authentication details.
- Roles: `Shipper`, `Trucker`.

### **2. Trucker Model (Eligibility Criteria)**

- `No accidents`
- `No theft complaints`
- `Truck age <= 5 years`
- `License age >= 5 years`

### **3. Load Model (Posted by Shippers)**

- Includes load details, origin, destination, weight, price, and status (`Pending`, `Booked`, `Completed`).

### **4. Offer Model (Truckers Bidding on Loads)**

- Stores bids placed by truckers on available loads.

### **5. Transaction Model (Payments & Ledger)**

- Manages financial transactions between shippers and truckers.

---

## ⚙️ Architecture & Key Components

### **1. Backend (Node.js, Express, MongoDB)**

- **REST API** endpoints handle CRUD operations.
- **MongoDB** for data persistence.
- **JWT Authentication** for secure login & role-based access control.
- **WebSockets** for real-time load tracking (future scope).

### **2. Frontend (Next.js, React Bootstrap)**

- **Context API** for global user state management.
- **Dynamic Routing** for truckers & shippers.
- **Bootstrap Components** for UI consistency.
- **Axios** for API communication.

### **3. Key Functionalities**

✅ **User Authentication** (Login, Register)
✅ **Shippers Post Loads**
✅ **Truckers Search & Bid**
✅ **Confirm Truckers for Loads**
✅ **Filter Loads by Status (`Pending`, `Booked`, `Completed`)

---

## 🎥 Demonstration Video

Watch the full demo here: [Demo Video](https://www.loom.com/share/4ec60451453d4c5f9acd062b08c47c35?sid=3632bbcb-4608-4e13-bed9-695473509d40)

---

## 🚧 Feature Completion Status

| Feature                   | Status                      |
| ------------------------- | --------------------------- |
| User Authentication       | ✅ Completed                 |
| Shippers Post Loads       | ✅ Completed                 |
| Truckers Search & Bid     | ✅ Completed                 |
| Trucker Eligibility Check | ✅ Completed                 |
| Shippers Confirm Truckers | ✅ Completed                 |
| Real-Time Load Tracking   | 🚧 Partial (Planned)        |
| Payments Integration      | ❌ Unfinished (Future Scope) |

## 📝 Notes

- Future updates may include **real-time load tracking**, **automated payments**, and **notification systems**.
- If you encounter any issues, open a GitHub issue or contact **Harish1517**.

---

## 🏆 Credits

Developed by **Harish** for the Full Stack Competition 2024.

