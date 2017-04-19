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
    return hashlib.sha224((json.dumps(query).lower() + json.dumps(projection)).encode()).hexdigest()

def main():
    read_in = sys.stdin.readlines()
    type    = int(read_in[0])

    if type == 0:
        query = {}
    else:
        query = json.loads(read_in[1])

    projection  = {"loc" : True, "ref2": True}
    layer_name  = create_hash(query, projection)

    # connect to the catalog
    cat         = Catalog("http://localhost:8080/geoserver/rest/")
    workspace   = cat.get_workspace("selene")
    found       = cat.get_layer(layer_name)

    if found:
        print(layer_name)
        sys.exit(0)

    # Create Connection
    conn = SpectralProfiler("localhost", 27017)

    # Generate a dataframe from the query
    data = conn.compute_dataframe(query, projection, field = "ref2")

    img = conn.compute_image(600, 300, "bone", bg=None)
    conn.save_image("test.tif")

    cat.create_coveragestore(layer_name, "test.tif", workspace, overwrite=True)

    print(layer_name)



if __name__ == '__main__':
    main()
