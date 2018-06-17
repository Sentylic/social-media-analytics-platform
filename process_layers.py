from __future__ import print_function
import numpy as np
import json
import random
import os
import time
import datetime
import argparse

parser = argparse.ArgumentParser()
parser.add_argument('--dataset', type=str)

args = parser.parse_args()
dataset = args.dataset

# dataset = 'delete_facebook'
#data_path = dataset + '/results/daily_9'
# data_path = "serialised results/#obama_weekly"

data_path = '/media/supun/New Volume/FYP/Discussion Pathways/IKASL Java Implementation/datasets/' + dataset + '/results/daily_9'
# user should specify these accordingly

# fidn the layer_count by examining the data_path directory (BEWARE!! - Only corresponding layer files should be there in the directory)
layer_count = len(os.listdir(data_path))

timestamps = []

# get the timestamps
#raw_data_path = 'datasets/' + dataset + '/daily'
# raw_data_path = 'datasets/#obama/daily'
raw_data_path = '/media/supun/New Volume/FYP/Discussion Pathways/IKASL Java Implementation/datasets/' + dataset + '/daily'

for date in os.listdir(raw_data_path):
    timestamps.append(int(time.mktime(datetime.datetime.strptime(date, "%Y-%m-%d").timetuple())))

emotions = ['sad', 'happy', 'angry', 'excited', 'fear']

id2id = {}

for layer in xrange(layer_count):
    data = json.loads(open(data_path + "/layer_" + str(layer)).read())
    clusters = data['clusters']
    vocab = data['vocabulary']
    top_k = 10 # number of top words to show as the topic

    for cluster in clusters:
        id = cluster['id']

        if id in id2id:
            continue

        id2id[id] = len(id2id)
        id = id2id[id]
        if cluster['parentIDs'][0] == 'root':
            parent_id = id
        else:
            parent_id = id2id[cluster['parentIDs'][0]]

        hit_count = np.array(cluster['hitWordCount'])
        top_words = (-hit_count).argsort()[:top_k + 1]
        topic = ""

        for word in top_words:
            topic += vocab[word] + " "

        result = {}
        result['id'] = id
        result['parent'] = parent_id
        result['text'] = topic
        result['sentiment'] = random.randint(-2, 2)
        result['emotion'] = emotions[random.randint(0, len(emotions)-1)]
        result['time'] = timestamps[layer]
        result['location'] = "dummy"
        result = json.dumps(result)

        other_json = {}
        index = {}
        index['_id'] = str(id)
        index['_type'] = 'tweet'
        other_json['index'] = index
        other_json = json.dumps(other_json)

        print(other_json)
        print(result)
