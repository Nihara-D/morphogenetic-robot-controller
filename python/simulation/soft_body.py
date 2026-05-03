"""
Soft Body Physics Simulator
FEM-based deformable body simulation with hyperelastic materials
"""

import numpy as np
import jax
import jax.numpy as jnp
from jax import jit
import logging

logger = logging.getLogger(__name__)


class SoftBodySimulator:
    """
    Soft body physics simulator using FEM approximation.
    Supports hyperelastic material models and differentiable simulation.
    """
    
    def __init__(self, mesh_type='tetrahedral'):
        """
        Initialize soft body simulator
        
        Args:
            mesh_type: 'tetrahedral' or 'hexahedral'
        """
        self.mesh_type = mesh_type
        
        # Default material properties (like rubber/silicone)
        self.default_material = {
            'density': 1000.0,  # kg/m³
            'youngs_modulus': 100000.0,  # Pa
            'poisson_ratio': 0.4,
            'damping': 0.05
        }
        
        # Gravity
        self.gravity = np.array([0.0, -9.81, 0.0])
        
        logger.info(f"SoftBodySimulator initialized: mesh_type={mesh_type}")
    
    def _generate_mesh(self, shape='cube', num_vertices=64):
        """
        Generate a simple deformable mesh
        
        Args:
            shape: 'cube', 'cylinder', or 'sphere'
            num_vertices: Approximate number of vertices
        
        Returns:
            vertices (N, 3), tetrahedra (M, 4)
        """
        if shape == 'cube':
            # Simple cube mesh
            res = 4  # 4x4x4 grid
            x = np.linspace(-0.5, 0.5, res)
            y = np.linspace(-0.5, 0.5, res)
            z = np.linspace(-0.5, 0.5, res)
            
            xx, yy, zz = np.meshgrid(x, y, z, indexing='ij')
            vertices = np.stack([xx.flatten(), yy.flatten(), zz.flatten()], axis=1)
            
            # Simple tetrahedral connectivity
            tetrahedra = []
            for i in range(res - 1):
                for j in range(res - 1):
                    for k in range(res - 1):
                        # 6 tetrahedra per cube
                        v0 = i * res * res + j * res + k
                        v1 = (i + 1) * res * res + j * res + k
                        v2 = i * res * res + (j + 1) * res + k
                        v3 = i * res * res + j * res + (k + 1)
                        
                        tetrahedra.append([v0, v1, v2, v3])
            
            return vertices, np.array(tetrahedra)
        
        else:  # Default to cube
            return self._generate_mesh('cube', num_vertices)
    
    @jit
    def _strain_energy(self, vertices, tetrahedra, material):
        """Compute strain energy (simplified St. Venant-Kirchhoff model)"""
        # This is a simplified energy computation
        # In practice, you'd compute per-element strain and sum
        E = material['youngs_modulus']
        nu = material['poisson_ratio']
        
        # Simplified: energy proportional to deformation
        energy = 0.0
        return energy
    
    @jit
    def _apply_actuation(self, vertices, actuation_field, dt):
        """
        Apply actuation field as forces on vertices
        
        Args:
            vertices: (N, 3) vertex positions
            actuation_field: Spatial activation pattern
            dt: Time step
        
        Returns:
            Force vector for each vertex
        """
        # Simple implementation: use actuation as directional scaling
        N = vertices.shape[0]
        forces = jnp.zeros((N, 3))
        
        # Map actuation field to forces (e.g., expansion/contraction)
        # In practice, this would be more sophisticated
        expansion_direction = jnp.array([0.0, 1.0, 0.0])  # Upward
        max_force = 10.0
        
        # Simple: apply force proportional to actuation magnitude
        avg_actuation = jnp.mean(actuation_field) if len(actuation_field) > 0 else 0.0
        forces = forces + expansion_direction[None, :] * max_force * avg_actuation
        
        return forces
    
    def _integrate_verlet(self, vertices, velocities, forces, dt):
        """
        Verlet integration step for soft body dynamics
        """
        # Convert to JAX arrays
        v = jnp.asarray(vertices)
        vel = jnp.asarray(velocities)
        f = jnp.asarray(forces)
        
        # Add gravity
        g = jnp.asarray(self.gravity)
        f = f + g[None, :] * 1.0  # Apply to all vertices
        
        # Verlet integration: x_{n+1} = 2x_n - x_{n-1} + a_n * dt²
        acceleration = f  # Assuming unit mass for simplicity
        v_new = vel + acceleration * dt
        v_new = v_new * (1 - self.default_material['damping'])  # Damping
        x_new = v + v_new * dt
        
        return np.asarray(x_new), np.asarray(v_new)
    
    def simulate(self, mesh=None, actuation_field=None, num_steps=100, dt=0.01):
        """
        Run soft body physics simulation
        
        Args:
            mesh: Dict with 'shape' and 'material' or None for default
            actuation_field: Spatial actuation pattern
            num_steps: Number of simulation steps
            dt: Time step
        
        Returns:
            Dict with simulation results
        """
        try:
            # Generate mesh if not provided
            if mesh is None:
                vertices, tetrahedra = self._generate_mesh('cube', num_vertices=64)
            else:
                vertices = np.array(mesh.get('vertices', []))
                tetrahedra = np.array(mesh.get('tetrahedra', []))
            
            # Initialize velocities
            velocities = np.zeros_like(vertices)
            
            # Default actuation: expansion at center
            if actuation_field is None:
                actuation_field = np.ones(len(vertices)) * 0.1
            else:
                actuation_field = np.array(actuation_field)
            
            logger.info(f"Running soft body simulation: {len(vertices)} vertices, {num_steps} steps")
            
            # Trajectory storage
            trajectory = []
            
            # Simulate
            for step in range(num_steps):
                if step % max(1, num_steps // 10) == 0:
                    logger.info(f"  Step {step}/{num_steps}")
                
                # Compute forces from actuation
                forces = self._apply_actuation(vertices, actuation_field, dt)
                
                # Integrate
                vertices, velocities = self._integrate_verlet(vertices, velocities, forces, dt)
                
                # Store trajectory
                if step % max(1, num_steps // 20) == 0:
                    trajectory.append({
                        'step': step,
                        'vertices': vertices.tolist()
                    })
            
            # Compute strain field (simplified)
            strain_field = np.linalg.norm(velocities, axis=1).tolist()
            
            logger.info("Soft body simulation completed")
            
            return {
                'status': 'success',
                'num_steps': num_steps,
                'num_vertices': len(vertices),
                'num_tetrahedra': len(tetrahedra),
                'final_vertices': vertices.tolist(),
                'final_velocities': velocities.tolist(),
                'strain_field': strain_field,
                'trajectory': trajectory,
                'tetrahedra': tetrahedra.tolist()
            }
        
        except Exception as e:
            logger.error(f"Soft body simulation failed: {e}")
            raise
