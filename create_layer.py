import os
import sys
sys.path.insert(0, os.path.abspath('..'))

import json
import numpy as np
import warnings

from database import SpectralProfiler

# import gsconfig stuff
import geoserver
import geoserver.util
from geoserver.catalog import Catalog

import hashlib
warnings.filterwarnings('ignore')

def create_hash(query, projection):
    return hashlib.sha224((json.dumps(query) + json.dumps(projection)).encode()).hexdigest()


read_in = sys.stdin.readline()
type    = int(read_in[0])
query   = {}
if type == 1:
    query = json.loads(read_in[1])
# Create Connection
conn = SpectralProfiler("localhost", 27017)
# connect to the catalog
cat = Catalog("http://localhost:8080/geoserver/rest/")

# Create some Queries with a projection
query, projection = {}, {"loc" : True, "ref2": True}
layer_name = create_hash(query, projection)

found = cat.get_layer(layer_name)
print found
if found:
    print(layer_name)
    sys.exit(0)
else:
    # Generate a dataframe from the query
    data = conn.compute_dataframe(query, projection, field = "ref2")

    img = conn.compute_image(600, 300, "bone", bg=None)
    conn.save_image("test.tif")



    workspace = cat.get_workspace("selene")

    cat.create_coveragestore(layer_name, "test.tif", workspace, overwrite=True)

    print(layer_name)
    sys.exit(0)
