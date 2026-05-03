"""
Morphogen Field PDE Solver
Reaction-diffusion patterns using Gray-Scott or similar models
"""

import numpy as np
import jax
import jax.numpy as jnp
from jax import jit
import logging

logger = logging.getLogger(__name__)


class MorphogenPDE:
    """
    Morphogen field controller using reaction-diffusion PDEs.
    Implements Gray-Scott model or custom reaction-diffusion dynamics.
    """
    
    def __init__(self, grid_size=64, dx=1.0):
        """
        Initialize morphogen PDE solver
        
        Args:
            grid_size: Resolution of morphogen field
            dx: Spatial discretization
        """
        self.grid_size = grid_size
        self.dx = dx
        
        # Default Gray-Scott parameters
        self.default_params = {
            'f': 0.055,  # Feed rate
            'k': 0.062,  # Kill rate
            'D_u': 1.0,  # Diffusion coefficient (U)
            'D_v': 0.5,  # Diffusion coefficient (V)
        }
        
        logger.info(f"MorphogenPDE initialized: grid_size={grid_size}, dx={dx}")
    
    @jit
    def _laplacian_2d(self, field):
        """Compute 2D Laplacian using finite differences (periodic boundary)"""
        # Shift operations for periodic boundaries
        rolled_up = jnp.roll(field, 1, axis=0)
        rolled_down = jnp.roll(field, -1, axis=0)
        rolled_left = jnp.roll(field, 1, axis=1)
        rolled_right = jnp.roll(field, -1, axis=1)
        
        laplacian = (rolled_up + rolled_down + rolled_left + rolled_right - 4 * field) / (self.dx ** 2)
        return laplacian
    
    @jit
    def _gray_scott_step(self, u, v, params, dt):
        """
        Single Gray-Scott reaction-diffusion step
        ∂u/∂t = D_u∇²u - uv² + f(1-u)
        ∂v/∂t = D_v∇²v + uv² - (f+k)v
        """
        f = params['f']
        k = params['k']
        D_u = params['D_u']
        D_v = params['D_v']
        
        # Compute Laplacians
        lap_u = self._laplacian_2d(u)
        lap_v = self._laplacian_2d(v)
        
        # Reaction terms
        reaction = u * v * v
        
        # Update equations
        u_new = u + dt * (D_u * lap_u - reaction + f * (1 - u))
        v_new = v + dt * (D_v * lap_v + reaction - (f + k) * v)
        
        # Clamp to [0, 1]
        u_new = jnp.clip(u_new, 0, 1)
        v_new = jnp.clip(v_new, 0, 1)
        
        return u_new, v_new
    
    def _initialize_field(self, grid_size, pattern='spot'):
        """
        Initialize morphogen field
        
        Args:
            grid_size: Grid resolution
            pattern: 'spot', 'stripes', 'random', or 'uniform'
        """
        if pattern == 'spot':
            u = np.ones((grid_size, grid_size))
            v = np.zeros((grid_size, grid_size))
            # Add small circular spot at center
            center = grid_size // 2
            radius = 5
            for i in range(grid_size):
                for j in range(grid_size):
                    if (i - center)**2 + (j - center)**2 < radius**2:
                        v[i, j] = 1.0
        
        elif pattern == 'stripes':
            u = np.ones((grid_size, grid_size))
            v = np.zeros((grid_size, grid_size))
            # Vertical stripes
            stripe_width = grid_size // 4
            for i in range(grid_size):
                if (i // stripe_width) % 2 == 0:
                    v[i, :] = 0.5
        
        elif pattern == 'random':
            u = np.random.rand(grid_size, grid_size)
            v = np.random.rand(grid_size, grid_size) * 0.5
        
        else:  # uniform
            u = np.ones((grid_size, grid_size))
            v = np.zeros((grid_size, grid_size))
        
        return u.astype(np.float32), v.astype(np.float32)
    
    def simulate(self, initial_conditions=None, parameters=None, num_steps=100, dt=0.01):
        """
        Run morphogen field simulation
        
        Args:
            initial_conditions: Dict with 'pattern' key or None for default
            parameters: Dict with Gray-Scott parameters
            num_steps: Number of simulation steps
            dt: Time step
        
        Returns:
            Dict with simulation results
        """
        try:
            # Use provided parameters or defaults
            params = {**self.default_params, **(parameters or {})}
            
            # Initialize field
            pattern = (initial_conditions or {}).get('pattern', 'spot')
            u, v = self._initialize_field(self.grid_size, pattern)
            
            # Convert to JAX arrays
            u = jnp.asarray(u)
            v = jnp.asarray(v)
            
            # Storage for trajectory
            trajectory = []
            
            logger.info(f"Running morphogen simulation: {num_steps} steps, dt={dt}")
            
            # Simulate
            for step in range(num_steps):
                if step % max(1, num_steps // 10) == 0:
                    logger.info(f"  Step {step}/{num_steps}")
                
                u, v = self._gray_scott_step(u, v, params, dt)
                
                # Store every n steps to reduce memory
                if step % max(1, num_steps // 20) == 0:
                    trajectory.append({
                        'step': step,
                        'u': np.asarray(u).tolist(),
                        'v': np.asarray(v).tolist()
                    })
            
            logger.info("Morphogen simulation completed")
            
            return {
                'status': 'success',
                'num_steps': num_steps,
                'parameters': params,
                'initial_field': {
                    'u': np.asarray(u).tolist(),
                    'v': np.asarray(v).tolist()
                },
                'final_field': {
                    'u': np.asarray(u).tolist(),
                    'v': np.asarray(v).tolist()
                },
                'trajectory': trajectory,
                'grid_size': self.grid_size
            }
        
        except Exception as e:
            logger.error(f"Morphogen simulation failed: {e}")
            raise
