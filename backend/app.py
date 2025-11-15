import os
import flask
import flask_cors
import json
import dotenv

dotenv.load_dotenv(dotenv_path=".env")

app = flask.Flask(__name__)
flask_cors.CORS(app, origins=["*"])

@app.route("/", methods=["GET"])
def root():
    return flask.Response(f"<pre>{open("docs.txt", "r").read()}</pre>", status=200)

@app.route("/dataset/get", methods=["GET"])
def get_data():
    dataset_name = flask.request.args.get("name")
    dataset_path = os.path.join(os.getenv("DATASET_ROOT"), dataset_name+".json")

    if os.path.exists(dataset_path):
        indexation = json.load(open(dataset_path, "r"))
        return flask.jsonify(indexation), 200
    else:
        return flask.jsonify({"error": f"Dataset \"{dataset_name}\" not found."}), 404

if __name__ == "__main__":
    app.run(
        host=os.getenv("HOSTNAME"),
        port=os.getenv("PORT"),
        debug=bool(int(os.getenv("DEBUG")))
    )
