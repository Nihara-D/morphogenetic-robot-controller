# Morphogenetic Soft Robot Controller - Python Backend

## Overview

This is the Python backend for the morphogenetic soft robot controller research platform. It provides:

- **Morphogen PDE Solver**: Gray-Scott reaction-diffusion pattern generation using JAX
- **Soft Body Simulator**: FEM-based deformable body physics with hyperelastic materials
- **Neural Controller**: Lyapunov-stable networks and spiking neural networks for actuation control
- **Optimization Engine**: Evolutionary algorithms for controller parameter search

## Setup

### Prerequisites
- Python 3.9+
- pip or conda

### Installation

```bash
cd python
pip install -r requirements.txt
```

### Running the Backend

```bash
python app.py
```

The API will be available at `http://localhost:5000`

## API Endpoints

### Health Check
```
GET /api/health
```

### Morphogen Field Simulation
```
POST /api/morphogen/simulate
Content-Type: application/json

{
  "initial_conditions": {
    "pattern": "spot"  // "spot", "stripes", "random", "uniform"
  },
  "parameters": {
    "f": 0.055,
    "k": 0.062,
    "D_u": 1.0,
    "D_v": 0.5
  },
  "num_steps": 100,
  "dt": 0.01
}
```

### Soft Body Physics Simulation
```
POST /api/physics/simulate
Content-Type: application/json

{
  "mesh": {
    "shape": "cube"  // "cube", "cylinder", "sphere"
  },
  "actuation_field": [0.1, 0.2, ...],
  "num_steps": 100,
  "dt": 0.01
}
```

### Controller Optimization
```
POST /api/controller/optimize
Content-Type: application/json

{
  "objective": "locomotion_speed",  // "locomotion_speed", "energy_efficiency", "stability"
  "initial_params": {...},
  "num_iterations": 100
}
```

### Full End-to-End Simulation
```
POST /api/simulation/run
Content-Type: application/json

{
  "morphogen_params": {
    "f": 0.055,
    "k": 0.062,
    "D_u": 1.0,
    "D_v": 0.5
  },
  "mesh": {
    "shape": "cube"
  },
  "controller_params": {},
  "num_steps": 100,
  "dt": 0.01
}
```

### List Available Experiments
```
GET /api/experiments
```

## Architecture

### Module Structure

```
python/
├── app.py                 # Flask API server
├── simulation/
│   ├── __init__.py
│   ├── morphogen_pde.py   # Gray-Scott PDE solver
│   ├── soft_body.py       # FEM physics simulator
│   └── controller.py      # Neural controller
├── requirements.txt
└── README.md
```

### Morphogen PDE Module

Implements reaction-diffusion pattern generation using the Gray-Scott model:

```
∂u/∂t = D_u∇²u - uv² + f(1-u)
∂v/∂t = D_v∇²v + uv² - (f+k)v
```

Key parameters:
- `f`: Feed rate (0.01 - 0.1)
- `k`: Kill rate (0.01 - 0.1)
- `D_u`, `D_v`: Diffusion coefficients

### Soft Body Simulator Module

FEM-based deformable body with:
- Hyperelastic material properties (Young's modulus, Poisson's ratio)
- Verlet integration for dynamics
- Damping and gravity
- Support for custom mesh initialization

### Neural Controller Module

- **Lyapunov-stable layers**: Ensures energy dissipation for stability
- **Spiking neural networks**: Integrate-and-fire neurons with threshold-based spikes
- **Morphogen integration**: Direct processing of reaction-diffusion fields
- **Proprioceptive feedback**: Strain and velocity feedback from soft body

## Configuration

Environment variables (in `.env`):

```
PYTHON_PORT=5000
FLASK_DEBUG=False
```

## Development

To extend the simulator:

1. Add new PDEs in `morphogen_pde.py`
2. Implement new physics models in `soft_body.py`
3. Add neural architectures in `controller.py`
4. Register new API endpoints in `app.py`

## Performance Notes

- JAX computations are JIT-compiled for speed
- Simulations run on CPU by default (can be extended to GPU)
- Typical simulation times: 
  - Morphogen field: ~100 steps in 2-5 seconds
  - Soft body: ~100 steps in 1-3 seconds

## References

- Gray-Scott model: https://www.karlsims.com/rd.html
- Soft robotics FEM: Recent literature on differentiable physics simulation
- SNNs: Maass, W. (1997). "Networks of Spiking Neurons..."
