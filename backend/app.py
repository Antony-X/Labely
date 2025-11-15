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
def dataset_get():
    dataset_name = flask.request.args.get("name")
    dataset_path = os.path.join(os.getenv("DATASET_ROOT"), dataset_name+".json")

    if os.path.exists(dataset_path):
        indexation = json.load(open(dataset_path, "r"))
        return flask.jsonify(indexation), 200
    else:
        return flask.jsonify({"error": f"Dataset \"{dataset_name}\" not found."}), 404
    
@app.route("/dataset/getimg", methods=["GET"])
def dataset_getimg():
    dataset_name = flask.request.args.get("name")
    item_id = flask.request.args.get("id", type=int)
    root = os.getenv("DATASET_ROOT")
    json_path = os.path.join(root, dataset_name + ".json")

    if not os.path.exists(json_path):
        return flask.jsonify({"error": "Dataset not found"}), 404

    indexation = json.load(open(json_path, "r"))
    if item_id < 0 or item_id >= len(indexation["data"]):
        return flask.jsonify({"error": "Invalid id"}), 400

    filename = indexation["data"][item_id]["filename"]
    image_path = os.path.join(root, dataset_name, filename)

    if not os.path.isfile(image_path):
        return flask.jsonify({"error": "Image not found"}), 404

    return flask.send_file(image_path, mimetype="image/jpeg")

@app.route("/dataset/setcat", methods=["POST"])
def dataset_setcat():
    payload = flask.request.get_json(force=True)
    dataset_name = payload.get("name")
    item_id = payload.get("id")
    label = payload.get("label")

    root = os.getenv("DATASET_ROOT")
    json_path = os.path.join(root, dataset_name + ".json")

    if not os.path.exists(json_path):
        return flask.jsonify({"error": "Dataset not found"}), 404

    indexation = json.load(open(json_path, "r"))
    mapping = {c["label"]: c["value"] for c in indexation["categories"]}

    if label not in mapping:
        return flask.jsonify({"error": "Unknown label"}), 400
    if item_id < 0 or item_id >= len(indexation["data"]):
        return flask.jsonify({"error": "Invalid id"}), 400

    indexation["data"][item_id]["category"] = mapping[label]
    json.dump(indexation, open(json_path, "w"), indent=4)

    return flask.jsonify({"status": "ok", "assigned": mapping[label]}), 200

if __name__ == "__main__":
    app.run(
        host=os.getenv("HOSTNAME"),
        port=os.getenv("PORT"),
        debug=bool(int(os.getenv("DEBUG")))
    )
