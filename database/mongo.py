from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["ayurveda"]
collection = db["plants"]

def get_plant_by_label(label):
    plant = collection.find_one(
        {"label": label.lower()},
        {"_id": 0}
    )
    return plant
