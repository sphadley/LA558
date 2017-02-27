from flask import Flask, render_template, request, Response
from flask_cors import cross_origin
 
import requests

application = Flask(__name__)

brewhost = "https://api.brewerydb.com"
#@application.route("/")
#def main():
#    return render_template('index.html')

@application.route('/bdb/')
@cross_origin(origins="sphadley.github.io/*")
def proxy_root():
    r = requests.get(brewhost + '/')
    return Response(r.content, mimetype='text/json')

@application.route('/bdb/<path:other>')
@cross_origin(origins="sphadley.github.io/*")
def proxy_other(other):
    print("URL:::::" + request.remote_addr)
    try:
        with open("brewery.pass", 'r') as file:
            apikey = file.readline()
            #print(brewhost +'/'+ other + '?key=' + apikey  + "&" + request.query_string.decode('utf-8'))
            r = requests.get(brewhost +'/'+ other + '?key=' + apikey  + "&" + request.query_string.decode('utf-8'))
            return Response(r.content, mimetype='text/json')
    except IOError:
        print("IOError")
if __name__ == "__main__":
    application.run()


