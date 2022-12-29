This is a repository made to contain all the files needed for the paper 'Determining the number of roots of a given polynomial through its newton fractal and deep-learning techniques' by Roque Mula, Marco Nieto and Pablo Perez.

Files:
bulkSobel.py -> retrieves all the images in a specified folder and saves there a Sobel filtered copy.

nfractal.ipynb -> creates the fractals used as example images.

keras.ipynb -> contains the model XCeption, a variant of a convolutional neural network used for classifying the fractals.

graphs.ipynb -> graphs the results of the accuracy in every epoch for the three models


Folders:
dataset/training -> contains 360x360 png images used for training, classified by filtered and non-filtered, amd by each polynomial degree.

Images -> contains some images used in the latex paper.
