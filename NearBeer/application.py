from flask import Flask, render_template, request, Response
 
import requests

application = Flask(__name__)

brewhost = "http://api.brewerydb.com"
@application.route("/")
def final():
    return render_template('NearBeer.html')

@application.route('/bdb/')
def proxy_root():
    r = requests.get(brewhost + '/')
    return Response(r.content, mimetype='text/json')

@application.route('/bdb/<path:other>')
def proxy_other(other):
    print("URL:::::" + request.remote_addr)
    try:
        with open("brewery.pass", 'r') as file:
            apikey = file.readline().rstrip()
            options={}
            options.update({"key":apikey});
            optionString = request.query_string.decode('utf-8').replace('%2C', ',').replace('%20', ' ')
            if optionString != "":
                opts = optionString.split('&')
                for o in opts :
                    kv = o.split('=')
                    options.update({kv[0]:kv[1]})
            print(options)
            url = brewhost +'/'+ other
            print(url)
            r = requests.get(url, params=options)
            return Response(r.content, mimetype='text/json') 
    except IOError:
        print("IOError")
if __name__ == "__main__":
    application.run()


