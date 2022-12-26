import cv2
import numpy as np

# Load the image
image = cv2.imread('training/color/3/5.png')

# Convert the image to grayscale
gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

# Apply the Sobel filter
sobel_x = cv2.Sobel(gray, cv2.CV_64F, 1, 0, ksize=3)
sobel_y = cv2.Sobel(gray, cv2.CV_64F, 0, 1, ksize=3)

# Calculate the gradient magnitude
sobel = np.sqrt(sobel_x**2 + sobel_y**2)

# Normalize the gradient magnitude to the range [0, 255]
scaled_sobel = np.uint8(255*sobel/np.max(sobel))

# Display the filtered image
cv2.imshow('Sobel Filter', scaled_sobel)
cv2.waitKey(0)

cv2.imwrite('sobel.png', scaled_sobel)