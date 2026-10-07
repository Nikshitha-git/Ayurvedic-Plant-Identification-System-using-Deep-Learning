from ultralytics import YOLO

model = YOLO("best.pt")

results = model.predict(source="guava.jpg", save=True, conf=0.25)
print(results)