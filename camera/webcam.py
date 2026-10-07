import cv2
import requests

cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()
    if not ret:
        break

    cv2.imshow("Camera", frame)

    if cv2.waitKey(1) & 0xFF == ord('c'):
        cv2.imwrite("capture.jpg", frame)

        response = requests.post(
            "http://192.168.1.5/predict",     #your IPv4 address
            files={"image": open("capture.jpg", "rb")}
        )

        print(response.json())

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
    