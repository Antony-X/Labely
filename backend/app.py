import os
import flask
import flask_cors
import dotenv

dotenv.load_dotenv(dotenv_path=".env")

app = flask.Flask(__name__)
flask_cors.CORS(app, origins=["*"])

@app.route("/", methods=["GET"])
def root():
    return flask.Response(f"<pre>{open("docs.txt", "r").read()}</pre>", status=200)

if __name__ == "__main__":
    app.run(
        host=os.getenv("HOSTNAME"),
        port=os.getenv("PORT"),
        debug=bool(int(os.getenv("DEBUG")))
    )
