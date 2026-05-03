# Quick Start Guide

**Morphogenetic Soft Robot Controller**  
**Author**: Nihara Dayarathne

---

## 🚀 Get Running in 5 Minutes

### Prerequisites Check

```bash
node --version    # Should be 18+
python --version  # Should be 3.9+
pnpm --version    # Should be 8+
```

### Step 1: Clone & Install (2 min)

```bash
git clone https://github.com/yourusername/morphogenetic-robot-controller.git
cd morphogenetic-robot-controller

pnpm install

cd python
python -m venv venv
source venv/bin/activate  # or: venv\Scripts\activate (Windows)
pip install -r requirements.txt
cd ..
```

### Step 2: Start Frontend (1 min)

```bash
pnpm dev
```

✅ Open **http://localhost:3000** in your browser

### Step 3: Start Backend (1 min, New Terminal)

```bash
cd python
source venv/bin/activate  # or: venv\Scripts\activate (Windows)
python app.py
```

✅ Backend running at **http://localhost:5000**

### Done! 🎉

Your morphogenetic robot controller is now running. Navigate to the **Dashboard** to:
- Run morphogen field simulations
- Simulate soft body physics
- View 3D mesh deformations
- Track experiments
- Read research documentation

---

## 📋 What You Get

| Feature | Location | Purpose |
|---------|----------|---------|
| Dashboard | http://localhost:3000/dashboard | Run simulations & control parameters |
| Visualizer | http://localhost:3000/visualizer | 3D mesh + 2D heatmap visualization |
| Experiments | http://localhost:3000/experiments | Log & compare simulation runs |
| Docs | http://localhost:3000/docs | Research methodology & theory |

---

## 🔧 Common Commands

### Development

```bash
# Frontend dev server (auto-reload)
pnpm dev

# Frontend build
pnpm build

# Backend server
cd python && python app.py

# Backend tests
cd python && pytest
```

### Production

```bash
# Build frontend
pnpm build

# Start production server
pnpm start

# Backend production
cd python && FLASK_ENV=production python app.py
```

---

## 🛠️ Troubleshooting

### Port Already in Use
```bash
# Kill process using port 3000
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9
# or just restart your terminal
```

### Python Dependencies Error
```bash
cd python
pip install --upgrade pip
pip install -r requirements.txt
```

### Frontend Won't Start
```bash
rm -rf .next node_modules
pnpm install
pnpm dev
```

---

## 📚 Next Steps

1. **Explore the Dashboard** - Run a morphogen field simulation
2. **Check the Visualizer** - See 3D mesh deformation in real-time
3. **Create an Experiment** - Log your first simulation
4. **Read the Docs** - Understand the theory and methodology

---

## 📞 Support

**Author**: Nihara Dayarathne  
**Email**: shniharard@gmail.com

Questions? Check the full README.md or DEPLOYMENT.md for detailed information.

---

**Ready to explore morphogenetic robotics? Start the servers above and visit http://localhost:3000!**
