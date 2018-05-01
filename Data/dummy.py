from random import *
import datetime, time 

emotion = ["sad", "happy", "angry", "excited", "fear"]

timestamp = -2;
prevTime = -1

for i in range(50):
#.strftime("%d/%m/%y %H:%M")
	#while timestamp <= prevTime:
	timestamp = datetime.datetime(2017, randint(1,12), randint(1,28), randint(0,23), randint(0,59))
	timestamp = time.mktime(timestamp.timetuple()) * 1000
	#prevTime = timestamp
	print '{"index" : {"_id" : "%d", "_type" : "tweet"}}' %i
	print '{"id": %d, "parent": %d, "text": "dummyText%d", "sentiment": %d, "emotion": "%s", "time": %d, "location": "place%d"}' % (i, randint(0, i), i, randint(-2,2), emotion[randint(0, len(emotion) - 1)], timestamp,randint(0,5)) 
