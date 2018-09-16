# Social Media Analytics Platform for Tourism Domain
A comprehensive social media analytics platform which could perform tasks ranging from extracting data related to an entity/restaurant/place and perform a comprehensive analysis consisting of capturing topics, identifying emotions expressed and extracting sentiments expressed towards aspects. The project is a research oriented project where each sub component of the system was built using machine learning models built by ourselves.

## How To Run
You can run the node server on your localhost using the following command. Then you can access the tool using you web browser. (Since the system is in the deveopment phase some functionalities will not work propoerly)

<code>nodemon</code>

## Aspect Extraction
Aspect extraction is crucial when it comes to finding out what are the key topics people discuss realted an entity. You can use the complete tool to run a complete analysis or you could run the aspect extraction service in order to run some experiements.

### Running the aspect extraction server
<code>
cd aspect-extraction <br>
python aspect_flask_server.py
</code>

A server will start running and the port and the ipaddress will be displayed in stdout. Let's assume server address was <code> localhost:5001 </code>

Open up your browser and type in <code> localhost:5001/ </code> followed by the sentence/review you want to extract the aspects. Then when you press go (or press Enter) you'll see the extracted aspects.

Note - Current aspect extraction model has an accuracy of 67%. Hence it will not work for every review properly. Please let us know if you found any issues.

## Aspect Based Sentiment Analysis
Aspect based sentiment analysis is a fine grained version of general sentiment analysis. Here, expressed sentiment towards each identified aspect will be identified.

## Emotion Analysis
A general positive or negative sentiment won't be sufficient in some cases. In such scenarios deeper emotions expressed in sentences would be beneficial.

## Discussion Pathway Identification
Identifying what are the topics discussed in reviews and how the topics evolve over time is performed under this task.