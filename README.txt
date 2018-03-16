1) Run elastic search server
2) Add dummy.json to elastic search

curl -XPOST 'http://localhost:9200/tweets/_bulk?pretty' -H "Content-Type:application/x-ndjson" --data-binary @dummy.json

3) open graph.html


To delete index

curl -XDELETE localhost:9200/tweets