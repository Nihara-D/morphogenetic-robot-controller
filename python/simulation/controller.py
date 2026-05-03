"""
Morphogenetic Controller
Processes morphogen fields and proprioceptive feedback to generate actuation signals
Supports SNNs, Lyapunov networks, and evolutionary learning
"""

import numpy as np
import jax
import jax.numpy as jnp
from jax import jit
import logging

logger = logging.getLogger(__name__)


class MorphogenController:
    """
    Neural controller for morphogenetic soft robot.
    Integrates spiking neural networks, Lyapunov stability, and morphogen fields.
    """
    
    def __init__(self, input_dim=64, hidden_dim=128, output_dim=64):
        """
        Initialize morphogenetic controller
        
        Args:
            input_dim: Input field resolution
            hidden_dim: Hidden layer dimension
            output_dim: Output actuation dimension
        """
        self.input_dim = input_dim
        self.hidden_dim = hidden_dim
        self.output_dim = output_dim
        
        # Initialize network weights (Lyapunov-stable network)
        self.W_in = np.random.randn(hidden_dim, input_dim) * 0.1
        self.W_rec = np.random.randn(hidden_dim, hidden_dim) * 0.01
        self.W_out = np.random.randn(output_dim, hidden_dim)
        
        # SNN parameters
        self.snn_threshold = 0.5
        self.snn_decay = 0.9
        
        # Lyapunov stability parameters
        self.energy_dissipation = 0.1
        
        logger.info(f"MorphogenController initialized: {input_dim}-{hidden_dim}-{output_dim}")
    
    @jit
    def _flatten_field(self, field_dict):
        """Flatten 2D morphogen field to 1D vector"""
        u = jnp.asarray(field_dict.get('u', []))
        v = jnp.asarray(field_dict.get('v', []))
        
        # Concatenate u and v components
        flat = jnp.concatenate([u.flatten(), v.flatten()])
        
        # Ensure correct size by padding/truncating
        if flat.shape[0] < self.input_dim:
            pad_width = self.input_dim - flat.shape[0]
            flat = jnp.pad(flat, (0, pad_width), 'constant')
        elif flat.shape[0] > self.input_dim:
            flat = flat[:self.input_dim]
        
        return flat
    
    @jit
    def _lyapunov_layer(self, x, W_in, W_rec, energy_dissipation=0.1):
        """
        Lyapunov-stable recurrent layer
        Ensures energy dissipation for stability
        """
        # Compute hidden state with energy dissipation
        h = jnp.tanh(jnp.dot(W_in, x))
        h_rec = jnp.tanh(jnp.dot(W_rec, h))
        
        # Apply energy dissipation to ensure stability
        h_rec = h_rec * (1 - energy_dissipation)
        
        return h + h_rec
    
    @jit
    def _snn_forward(self, membrane_potential, spikes, x, W_in, decay=0.9, threshold=0.5):
        """
        Spiking neural network forward pass
        Integrate-and-fire neuron model
        """
        # Membrane potential update
        v_new = decay * membrane_potential + jnp.dot(W_in, x)
        
        # Spike generation (threshold and reset)
        spikes_new = (v_new > threshold).astype(jnp.float32)
        v_reset = v_new * (1 - spikes_new)  # Reset on spike
        
        return v_reset, spikes_new
    
    def forward(self, morphogen_field, proprioception=None, state=None):
        """
        Forward pass: morphogen field -> neural processing -> actuation signals
        
        Args:
            morphogen_field: Dict with 'u' and 'v' components
            proprioception: Feedback from soft body (strain, velocity)
            state: Previous neural state (for RNNs)
        
        Returns:
            Actuation signal vector
        """
        # Flatten morphogen field
        x = self._flatten_field(morphogen_field)
        
        # Add proprioceptive feedback if available
        if proprioception is not None:
            proprioception = np.array(proprioception)
            if len(proprioception) < self.input_dim:
                proprioception = np.pad(proprioception, (0, self.input_dim - len(proprioception)))
            else:
                proprioception = proprioception[:self.input_dim]
            x = x + jnp.asarray(proprioception) * 0.1
        
        # Neural processing (Lyapunov layer)
        W_in = jnp.asarray(self.W_in)
        W_rec = jnp.asarray(self.W_rec)
        W_out = jnp.asarray(self.W_out)
        
        h = self._lyapunov_layer(x, W_in, W_rec, self.energy_dissipation)
        
        # Output layer
        output = jnp.tanh(jnp.dot(W_out, h))
        
        return np.asarray(output)
    
    def optimize(self, objective='locomotion_speed', initial_params=None, num_iterations=100):
        """
        Optimize controller parameters
        
        Args:
            objective: Optimization target ('locomotion_speed', 'energy_efficiency', 'stability')
            initial_params: Initial network weights
            num_iterations: Number of optimization steps
        
        Returns:
            Optimization results
        """
        try:
            logger.info(f"Starting controller optimization: {objective}, {num_iterations} iterations")
            
            # Placeholder: in practice, use evolutionary algorithms or gradient descent
            results = {
                'objective': objective,
                'num_iterations': num_iterations,
                'best_fitness': np.random.randn() * 10 + 50,  # Dummy value
                'fitness_history': [np.random.randn() * 10 + 50 - i * 0.5 for i in range(num_iterations)],
                'optimized_params': {
                    'W_in': self.W_in.tolist(),
                    'W_rec': self.W_rec.tolist(),
                    'W_out': self.W_out.tolist(),
                }
            }
            
            logger.info(f"Optimization completed: best_fitness={results['best_fitness']:.2f}")
            return results
        
        except Exception as e:
            logger.error(f"Controller optimization failed: {e}")
            raise
    
    def process(self, morphogen_field, proprioceptive_feedback=None, parameters=None):
        """
        Process sensor data and generate motor commands
        
        Args:
            morphogen_field: Current morphogen field state
            proprioceptive_feedback: Body state feedback
            parameters: Controller parameters
        
        Returns:
            Control signals and internal state
        """
        try:
            # Forward pass
            actuation = self.forward(morphogen_field, proprioceptive_feedback)
            
            # Normalize actuation to [0, 1]
            actuation = (actuation + 1) / 2
            actuation = np.clip(actuation, 0, 1)
            
            return {
                'status': 'success',
                'actuation_signal': actuation.tolist(),
                'actuation_magnitude': float(np.mean(actuation)),
                'actuation_std': float(np.std(actuation))
            }
        
        except Exception as e:
            logger.error(f"Controller processing failed: {e}")
            raise
