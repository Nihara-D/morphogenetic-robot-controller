"""
Morphogenetic Soft Robot Controller - Backend API
Main Flask application for PDE solving, physics simulation, and control
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
import os
import logging

# Import simulation modules (will be created)
from simulation.morphogen_pde import MorphogenPDE
from simulation.soft_body import SoftBodySimulator
from simulation.controller import MorphogenController

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize simulation engines
morphogen_engine = None
physics_engine = None
controller = None


def init_engines():
    """Initialize simulation engines"""
    global morphogen_engine, physics_engine, controller
    try:
        logger.info("Initializing simulation engines...")
        morphogen_engine = MorphogenPDE()
        physics_engine = SoftBodySimulator()
        controller = MorphogenController()
        logger.info("Engines initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize engines: {e}")
        raise


# Health check
@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'ok',
        'service': 'morphogenetic-robot-controller',
        'version': '0.1.0'
    })


# Morphogen field simulation
@app.route('/api/morphogen/simulate', methods=['POST'])
def simulate_morphogen():
    """
    Run morphogen field simulation
    
    Request body:
    {
        "initial_conditions": {...},
        "parameters": {...},
        "num_steps": 100,
        "dt": 0.01
    }
    """
    try:
        data = request.get_json()
        
        # Run simulation
        result = morphogen_engine.simulate(
            initial_conditions=data.get('initial_conditions'),
            parameters=data.get('parameters'),
            num_steps=data.get('num_steps', 100),
            dt=data.get('dt', 0.01)
        )
        
        return jsonify({
            'status': 'success',
            'data': result
        })
    except Exception as e:
        logger.error(f"Morphogen simulation error: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 400


# Soft body physics simulation
@app.route('/api/physics/simulate', methods=['POST'])
def simulate_physics():
    """
    Run soft body physics simulation
    
    Request body:
    {
        "mesh": {...},
        "actuation_field": {...},
        "num_steps": 100,
        "dt": 0.01
    }
    """
    try:
        data = request.get_json()
        
        # Run simulation
        result = physics_engine.simulate(
            mesh=data.get('mesh'),
            actuation_field=data.get('actuation_field'),
            num_steps=data.get('num_steps', 100),
            dt=data.get('dt', 0.01)
        )
        
        return jsonify({
            'status': 'success',
            'data': result
        })
    except Exception as e:
        logger.error(f"Physics simulation error: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 400


# Controller optimization
@app.route('/api/controller/optimize', methods=['POST'])
def optimize_controller():
    """
    Optimize morphogen controller parameters
    
    Request body:
    {
        "objective": "locomotion_speed",
        "initial_params": {...},
        "num_iterations": 100
    }
    """
    try:
        data = request.get_json()
        
        # Run optimization
        result = controller.optimize(
            objective=data.get('objective'),
            initial_params=data.get('initial_params'),
            num_iterations=data.get('num_iterations', 100)
        )
        
        return jsonify({
            'status': 'success',
            'data': result
        })
    except Exception as e:
        logger.error(f"Controller optimization error: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 400


# Combined end-to-end simulation
@app.route('/api/simulation/run', methods=['POST'])
def run_full_simulation():
    """
    Run full morphogenetic robot simulation:
    morphogen field -> soft body physics -> controller output
    
    Request body:
    {
        "morphogen_params": {...},
        "mesh": {...},
        "controller_params": {...},
        "num_steps": 100,
        "dt": 0.01
    }
    """
    try:
        data = request.get_json()
        
        results = {
            'morphogen_trajectory': None,
            'physics_trajectory': None,
            'controller_outputs': None
        }
        
        # Step 1: Run morphogen field simulation
        morphogen_result = morphogen_engine.simulate(
            parameters=data.get('morphogen_params'),
            num_steps=data.get('num_steps', 100),
            dt=data.get('dt', 0.01)
        )
        results['morphogen_trajectory'] = morphogen_result
        
        # Step 2: Run physics simulation with morphogen outputs as actuation
        physics_result = physics_engine.simulate(
            mesh=data.get('mesh'),
            actuation_field=morphogen_result.get('final_field'),
            num_steps=data.get('num_steps', 100),
            dt=data.get('dt', 0.01)
        )
        results['physics_trajectory'] = physics_result
        
        # Step 3: Get controller outputs
        controller_result = controller.process(
            morphogen_field=morphogen_result.get('final_field'),
            proprioceptive_feedback=physics_result.get('strain_field'),
            parameters=data.get('controller_params')
        )
        results['controller_outputs'] = controller_result
        
        return jsonify({
            'status': 'success',
            'data': results
        })
    except Exception as e:
        logger.error(f"Full simulation error: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 400


# List available experiments
@app.route('/api/experiments', methods=['GET'])
def list_experiments():
    """List available experiment configurations"""
    experiments = {
        'locomotion': {
            'name': 'Locomotion Gait Optimization',
            'description': 'Evolve morphogen controller for forward locomotion',
            'parameters': ['wavelength', 'frequency', 'amplitude']
        },
        'morphogenesis': {
            'name': 'Morphogenetic Development',
            'description': 'Simulate shape development from reaction-diffusion',
            'parameters': ['diffusion_rate', 'reaction_rate', 'threshold']
        },
        'adaptation': {
            'name': 'Environmental Adaptation',
            'description': 'Adaptive control under changing conditions',
            'parameters': ['gradient_strength', 'noise_level']
        }
    }
    return jsonify(experiments)


if __name__ == '__main__':
    # Initialize engines
    try:
        init_engines()
    except Exception as e:
        logger.error(f"Failed to start app: {e}")
        exit(1)
    
    # Run Flask app
    port = int(os.getenv('PYTHON_PORT', 5000))
    debug = os.getenv('FLASK_DEBUG', 'False') == 'True'
    app.run(host='0.0.0.0', port=port, debug=debug)
