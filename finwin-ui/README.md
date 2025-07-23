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
git clone https://github.com/choudharyabhinav15/finwin.git
```

### 2. Set Up the dependencies

```bash
cd finwin
npm install
```

### 3. Configure Environment Variables

To allow the mobile app to communicate with supabase, you need to configure the SUPABASE URL and KEY. 

```bash
EXPO_PUBLIC_SUPABASE_URL=<EXPO_PUBLIC_SUPABASE_URL>
EXPO_PUBLIC_SUPABASE_ANON_KEY=<EXPO_PUBLIC_SUPABASE_ANON_KEY>
```

Note: Supabase is an open source Firebase alternative with Postgres database, Realtime, Auth, Storage, Edge Functions and more. Find tutorials, APIs and platform resources to get started with Supabase.

### 4. Start the React Native App

```bash
npx expo start
```

Scan the QR code using **Expo Go** (Install from PlayStore / AppleStore) on your device. Make sure your devide and system both are connected to same wifi.