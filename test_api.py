import requests

response = requests.post(
    "http://<.......>:5000/predict",
    files={"image": open("banana.jpg", "rb")}
)

print(response.json())
