import requests

response = requests.post(
    "http://192.168.1.5:5000/predict",
    files={"image": open("banana.jpg", "rb")}
)

print(response.json())
