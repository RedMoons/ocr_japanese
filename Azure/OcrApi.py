# -*- coding: utf-8 -*- 
import os
import sys
import requests
# If you are using a Jupyter notebook, uncomment the following line.
# %matplotlib inline
import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle
from PIL import Image
from io import BytesIO
import io

# Add your Computer Vision subscription key and endpoint to your environment variables.
if 'COMPUTER_VISION_SUBSCRIPTION_KEY' in os.environ:
    subscription_key = os.environ['COMPUTER_VISION_SUBSCRIPTION_KEY']
else:
    subscription_key = "b9e4a29688b34ad3a41a72eb7498bfe8"
    # print("\nSet the COMPUTER_VISION_SUBSCRIPTION_KEY environment variable.\n**Restart your shell or IDE for changes to take effect.**")
    # sys.exit()


if 'COMPUTER_VISION_ENDPOINT' in os.environ:
    endpoint = os.environ['COMPUTER_VISION_ENDPOINT']

endpoint = "https://optical-character-recognition.cognitiveservices.azure.com/"
ocr_url = endpoint + "vision/v3.0/ocr"

# Set image_url to the URL of an image that you want to analyze.
# image_url = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/" + \
#    "Atomist_quote_from_Democritus.png/338px-Atomist_quote_from_Democritus.png"

# headers = {'Ocp-Apim-Subscription-Key': subscription_key}
params = {'language': 'ja', 'detectOrientation': 'true'}
# data = {'url': image_url}
# response = requests.post(ocr_url, headers=headers, params=params, json=data)


image_path = "./fuku2.jpg"
# Read the image into a byte array
image_data = open(image_path, "rb").read()
# Set Content-Type to octet-stream
headers = {'Ocp-Apim-Subscription-Key': subscription_key, 'Content-Type': 'application/octet-stream'}
# put the byte array into your post request
response = requests.post(ocr_url, headers=headers, params=params, data = image_data)
# print("=== response === : ", response)

response.raise_for_status()

analysis = response.json()
# print("=== analysis === : ", analysis)

# Extract the word bounding boxes and text.
line_infos = [region["lines"] for region in analysis["regions"]]
# print("===line_infos=== : ",line_infos)

word_infos = []
res = ""
f = open("./text.txt", "w")
for line in line_infos:
    for word_metadata in line:
        for word_info in word_metadata["words"]:
            # print("info : ", word_info["text"] )
            # print(type(word_info["text"]))
            # print(word_info["text"])
            string = word_info["text"].encode('utf-8', 'ignore')
            # print(type(string))
            # print(string)
            
            f.write(string)            
            res += string
            # res += str(word_info["text"])
            # print( unicode(word_info["text"], errors='ignore'))
            word_infos.append(word_info)
word_infos
# print(type(res))
# print("===res=== : ", res)

# res_conv = res.decode('utf-8')
# print("===res_conv=== : ", res_conv)
f.close()
f = open("./text.txt", "r")
print(f.read())

with open('text.txt') as f:
    fuku = '福島'
    if fuku in f.read():
        print("Fukishima exist")
    else:
        print("Does not exist")

# Display the image and overlay it with the extracted text.
#plt.figure(figsize=(5, 5))
#image = Image.open(BytesIO(requests.get(image_data).content))
#ax = plt.imshow(image, alpha=0.5)
#for word in word_infos:
#    bbox = [int(num) for num in word["boundingBox"].split(",")]
#    text = word["text"]
#    origin = (bbox[0], bbox[1])
#    patch = Rectangle(origin, bbox[2], bbox[3],
#                      fill=False, linewidth=2, color='y')
#    ax.axes.add_patch(patch)
#    plt.text(origin[0], origin[1], text, fontsize=20, weight="bold", va="top")
#plt.show()
#plt.axis("off")