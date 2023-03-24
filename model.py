import tflearn


def call_model(training, output):
    net = tflearn.input_data(shape=[None, len(training[0])])
    net = tflearn.fully_connected(net, 8)
    net = tflearn.fully_connected(net, len(output[0]), activation='softmax')
    net = tflearn.regression(net)

    model = tflearn.DNN(net, tensorboard_dir='D:\Code\Project\log')
    
    try:
        model.load("model.tflearn")
    except:
        model = tflearn.DNN(net, tensorboard_dir='D:\Code\Project\log')
        model.fit(training, output,validation_set=0.1, n_epoch=150, batch_size=8, show_metric=True)
        model.save("model.tflearn")
    
    return model

