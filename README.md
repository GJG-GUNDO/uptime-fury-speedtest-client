# ⚡ SpeedRunner Metrics

SpeedRunner is a professional-grade, **client-side network diagnostic tool** built with **React** and the **Cloudflare Speedtest Engine**.

Unlike standard speed tests that only show averages, SpeedRunner focuses on **real-world performance**, visualizing:

- Bufferbloat (Latency under load)
- Packet Loss
- 90th Percentile sustained speed

This gives you a **true picture of your network stability** and performance quality.

---

## 🚀 Features

### ✔ 90th Percentile Scoring  
Filters out spikes to highlight **sustained throughput**.

### ✔ Bufferbloat Analysis  
A detailed **Latency Matrix** comparing **Idle vs Active latency** to detect congestion.

### ✔ Packet Loss Detection  
High-precision detection with increased sample sizes.

### ✔ Application Scoring  
Automatic classification for:
- 🎮 Gaming
- 🎥 Streaming
- 💬 RTC (Video Calls)

### ✔ Detailed Metrics Breakdown  
Collapsible sections analyzing speeds for payloads between **100 kB to 50 MB**.

### ✔ Network Ops Dashboard  
Responsive **dark-mode Glassmorphism UI** powered by **Tailwind CSS**.

---

## 🐳 Quick Start with Docker

The easiest way to run SpeedRunner is using the pre-built Docker image.

### Run from Docker Hub
```bash
docker run -d -p 80:80 gjggundo/speed-test:latest
````

Then open your browser:
👉 [http://localhost](http://localhost)

### Update the Image

```bash
docker pull gjggundo/speed-test:latest
```

---

## 🛠️ Local Development Setup

Requires **Node.js v18+**.

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/GJG-GUNDO/uptime-fury-speedtest-client.git
cd uptime-fury-speedtest-client
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Start Development Server

```bash
npm run dev
```

Access the app → [http://localhost:5173](http://localhost:5173)

### 4️⃣ Build for Production

```bash
npm run build
```

---

## 🏗️ Tech Stack

| Category               | Technology                   |
| ---------------------- | ---------------------------- |
| Frontend Framework     | React 18                     |
| Styling                | Tailwind CSS                 |
| Icons                  | Lucide React                 |
| Speed Test Engine      | @cloudflare/speedtest        |
| Charts & Visualization | HTML5 Canvas (Custom Engine) |

---

## 📦 Dockerfile Reference

```dockerfile
# -----------------------------------------------------------------------------
# STAGE 1: Build
# -----------------------------------------------------------------------------
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files to leverage cache
COPY package*.json ./

# Install dependencies (use 'npm ci' for deterministic builds)
RUN npm ci

# Copy source code
COPY . .

# Pass build-time environment variables
# (Vite embeds these during the build process)
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build the app (outputs to /app/dist)
RUN npm run build

# -----------------------------------------------------------------------------
# STAGE 2: Serve (Nginx)
# -----------------------------------------------------------------------------
FROM nginx:alpine AS production

# Copy the built static files from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx config (crucial for SPA routing)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```


## 📝 License

This project is licensed under the **MIT License**.
See the **LICENSE** file for more details.

---

## 🙌 Acknowledgements

Powered by the **Cloudflare Speedtest Engine**.
