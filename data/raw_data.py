import json


def load_data(filename):
    with open(filename) as json_file:
        data = json.load(json_file)
        return data
