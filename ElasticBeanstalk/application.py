from flask import Flask, render_template, request, Response
 
import requests

application = Flask(__name__)

brewhost = "https://api.brewerydb.com"
@application.route("/Assignment9")
def main():
    return render_template('Assignment9.html')

@application.route('/bdb/')
def proxy_root():
    r = requests.get(brewhost + '/')
    return Response(r.content, mimetype='text/json')

@application.route('/bdb/<path:other>')
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


