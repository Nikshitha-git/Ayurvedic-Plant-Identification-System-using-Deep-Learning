from ultralytics import YOLO

# Load local YOLO weights
model = YOLO("best.pt")   # <-- exact filename

def detect_leaf(image_path):
    results = model(image_path, conf=0.7)

    detections = []

    for r in results:
        for box in r.boxes:
            label_id = int(box.cls[0])
            label = model.names[label_id]
            confidence = round(float(box.conf[0]), 2)
            bbox = box.xyxy[0].tolist()

            detections.append({
                "label": label,
                "confidence": confidence,
                "box": bbox
            })

    return detections
