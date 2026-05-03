"""
Morphogenetic Soft Robot Simulation Package
Core simulation engines for morphogen PDEs, soft body physics, and neural control
"""

from .morphogen_pde import MorphogenPDE
from .soft_body import SoftBodySimulator
from .controller import MorphogenController

__all__ = ['MorphogenPDE', 'SoftBodySimulator', 'MorphogenController']
__version__ = '0.1.0'
