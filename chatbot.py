from nltk.stem.lancaster import LancasterStemmer
stemmer = LancasterStemmer()
import numpy
import random
from bagOfWord import bag_of_words
from testContinueLearning import saveNoRe
from model import call_model
from preProcessEnglish import preprocess_data
from tensorflow.python.framework import ops

words, labels, training, output, data = preprocess_data("D:\Code\Project\web\data.json")
ops.reset_default_graph()
callModel = call_model(training, output)

def getResponses(inp):
    results = callModel.predict([bag_of_words(inp, words)])
    results_index = numpy.argmax(results)
    if results[0][results_index] < 0.6:
        saveNoRe(inp)
        return "Xin lỗi, tôi không hiểu ý của bạn, bạn có thể diễn đạt bằng cách khác!"
    else:
        tag = labels[results_index]
        for tg in data["intents"]:
            if tg['tag'] == tag:
                responses = tg['responses']
        return random.choice(responses)

if __name__ == "__main__":
    while True:
        inp = input()
        responses = getResponses(inp)
        print (responses)
