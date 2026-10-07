from flask import Flask, request, jsonify, render_template
from detector import detect_leaf
from database.mongo import get_plant_by_label
import os
from flask_cors import CORS

app = Flask(__name__, static_folder="static", template_folder="static")
CORS(app)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/predict", methods=["POST"])
def predict():
    image = request.files["image"]
    path = "temp.jpg"
    image.save(path)

    detections = detect_leaf(path)
    os.remove(path)

    if not detections:
        return jsonify({
            "success": False,
            "message": "No leaf detected"
        })

    best = max(detections, key=lambda x: x["confidence"])

    if best["confidence"] < 0.7:
        return jsonify({
            "success": False,
            "message": "Low confidence detection"
        })

    plant_data = get_plant_by_label(best["label"])

    if not plant_data:
        return jsonify({
            "success": False,
            "message": "Plant not found in database",
            "detected_label": best["label"]
        })

    return jsonify({
        "success": True,
        "prediction": {
            "label": best["label"],
            "confidence": best["confidence"]
        },
        "plant_info": plant_data
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
