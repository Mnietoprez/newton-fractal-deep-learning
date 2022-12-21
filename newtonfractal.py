import numpy as np
import matplotlib.pyplot as plt

def newton_fractal(polynomial, roots, x_range=(-4, 4), y_range=(-4, 4), resolution=1200, max_iter=256):
    # Create a grid of complex numbers
    x = np.linspace(*x_range, resolution)
    y = np.linspace(*y_range, resolution)
    x, y = np.meshgrid(x, y)
    c = x + y * 1j
    
    # Set up the Newton iteration
    z = c
    for i in range(max_iter):
      z = z - polynomial(z) / polynomial(z, derivative=True) # Newton's method
      for root in roots:
          if np.any(np.isclose(z, root, rtol=1e-6, atol=1e-6)): # Converged
            break
          else:
            continue
          break
    
    # Color the points according to which root they converge to
    colors = np.empty(z.shape, dtype=int)
    colors[:] = max_iter # Did not converge
    for i, root in enumerate(roots):
        mask = np.isclose(z, root, rtol=1e-6, atol=1e-6)
        colors[mask] = i + 1 # Converged to root i
    plt.imshow(colors, cmap='jet', extent=(*x_range, *y_range))

# Example usage: plot the Newton fractal for the polynomial x^3 - 1
def polynomial(z, derivative=False):
    if derivative:
        return 4*z**3
    return z**4 + 2

roots = np.roots([1, 0, 0, 0, 2])
newton_fractal(polynomial, roots)
plt.show()
