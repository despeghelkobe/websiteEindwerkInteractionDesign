from os import close
from flask import Flask, jsonify, request
from flask_cors import CORS
import json

from werkzeug.wrappers import response

#start app
app = Flask(__name__)
CORS(app)

#custom endpoint
endpoint = '/api/v1/'

#helperfunctions
def readJSONFile(fileloc):
    file = open(fileloc)
    data = json.load(file)
    file.close()
    return data 



#routes
@app.route(endpoint + 'solarsystem/<date>', methods=['GET'])
def getSolarSystem(date):
    if request.method == 'GET':
        data = readJSONFile("./solarsystem.json")
        for x in data:
            print(x["date"])
            if x["date"]==date:
                response = jsonify(x["planets"])
                response.headers.add('Access-Control-Allow-Origin', '*')
                return response, 200



#start app
if __name__ == '__main__':
    app.run(debug=True)
