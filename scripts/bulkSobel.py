import os
import cv2
import numpy as np

# directorio de imágenes
folder = 'dataset/testing/color'

# recorre todas las imágenes en el directorio
for filename in os.listdir(folder):
    # carga la imagen
    img = cv2.imread(os.path.join(folder, filename))

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    #Apply the Sobel filter
    sobel_x = cv2.Sobel(gray, cv2.CV_64F, 1, 0, ksize=3)
    sobel_y = cv2.Sobel(gray, cv2.CV_64F, 0, 1, ksize=3)
    sobel = np.sqrt(sobel_x**2 + sobel_y**2)
    scaled_sobel = np.uint8(255*sobel/np.max(sobel))
    # aplica el filtro de Sobel


    # guarda la imagen con el filtro de Sobel aplicado
    cv2.imwrite(os.path.join(folder, 'sobel_' + filename), sobel)