# 💸 FinWin – Financial Tracker App

**FinWin** is a modern financial wellness app built using **React Native (Expo)** with a **Node.js JSON backend**. It helps users track income, expenses, and financial health & goal tracker features.



## 🧑‍💻 Prerequisites

- Node.js >= 18.x
- Expo CLI: `npm install -g expo-cli`
- Git

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/finwin.git
cd finwin
```

### 2. Set Up the Backend

```bash
cd backend
npm install

```

### 3. Start Backend

```bash
npx ts-node index.ts
```

### 4. Set Up the Frontend

```bash
cd ../frontend
npm install
```


### 4. Set Up the Frontend

```bash
cd ../frontend
npm install
```


### 5. Configure Environment Variables

To allow the mobile app to communicate with your local backend server, you need to configure the API base URL. 
- Create a .env file inside the frontend directory.
- Add the following line to frontend/.env, replacing <YOUR_SYSTEM_IP> with your computer's local IP address: 

```bash
API_BASE_URL=http://<YOUR_SYSTEM_IP>:3000
LOCAL_API_URL=http://localhost:3000
```

Note: LOCAL_API_URL is required to run the mobile app as web.

### 6. Start the React Native App

```bash
npx expo start
```

Scan the QR code using **Expo Go** (Install from PlayStore / AppleStore) on your device. Make sure your devide and system both are connected to same wifi.

---

📝 License

MIT License