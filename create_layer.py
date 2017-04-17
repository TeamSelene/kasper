
# PyMongo for MongoDB queries
from pymongo import MongoClient
from collections import OrderedDict

import os
import sys
sys.path.insert(0, os.path.abspath('..'))

# Bokeh + Datashader
import datashader as ds
import datashader.transfer_functions as tf
from datashader.utils import export_image

# Import pandas for dataframe support
import pandas as pd
import json

# MatPlotLib for colors and basic plotting
import matplotlib.pyplot as plt
import matplotlib.colors as colors
import numpy as np
import warnings

from database import SpectralProfiler

import hashlib
warnings.filterwarnings('ignore')

def create_hash(query, projection):
    return hashlib.sha224((json.dumps(query) + json.dumps(projection)).encode()).hexdigest()

# Create Connection
conn = SpectralProfiler("localhost", 27017)

# Create some Queries with a projection
query, projection = {}, {"loc" : True, "ref2": True}
query2, projection2 = { "loc": { "$geoWithin": { "$center": [[160, -73], 50] }    } }, {"loc" : True, "ref2": True}

# Generate a dataframe from the query
data = conn.compute_dataframe(query, projection, field = "ref2")

img = conn.compute_image(600, 300, "bone", bg=None)
conn.save_image("test.tif")

# import gsconfig stuff
import geoserver
import geoserver.util
from geoserver.catalog import Catalog

# connect to the catalog
cat = Catalog("http://localhost:8080/geoserver/rest/")

workspace = cat.get_workspace("selene")
layer_name = create_hash(query, projection)
cat.create_coveragestore(layer_name, "test.tif", workspace, overwrite=True)

print(layer_name)
