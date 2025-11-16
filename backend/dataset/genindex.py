import os
import sys
import json

dataset_name = sys.argv[1]

print("* Dataset name:", dataset_name)

index = {
    "dataset_name": dataset_name,
    "categories": [
        {
            "label": "first",
            "value": 0
        },
        {
            "label": "second",
            "value": 1
        }
    ],
    "data": []
}

for file in os.listdir(dataset_name):
    index["data"].append({
        "id": len(index["data"]),
        "filename": file,
        "category": -1
    })

json.dump(index, open("index.json", "w"), indent=4)
