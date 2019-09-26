# We use this to get unsplash image so we can later use in unsplash.js
import requests
key = '47acdc9dae0972d7945d74951b4474c231a9108a821f9fd923e474188798634b'
url = 'https://api.unsplash.com/photos/?client_id='+key+'&page={}'
pages_end = 800
page_start = 600
for index in range(page_start, pages_end):
    r = requests.get(url.format(index))
    for image in r.json():
        print("'"+image.get('id')+"',")
