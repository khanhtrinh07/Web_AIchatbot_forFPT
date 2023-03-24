from flask import Flask, render_template, jsonify, request
from chatbot import getResponses

app = Flask(__name__)

@app.get('/')
def index_get():
    return render_template('index.html')

@app.post("/predict")
def predict():
    text = request.get_json().get("message")
    response = getResponses(text)
    message = {"response": response}
    return jsonify(message)

if __name__ == "__main__":
    app.run(debug=True)