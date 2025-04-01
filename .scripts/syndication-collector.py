import feedparser
from pathlib import Path
import os
import json
import hashlib
import xml.etree.ElementTree as ET
import re

domain = "https://chapien.net"
rss_bsky = "https://bsky.app/profile/did:plc:rm76gmxw3bcqghndbzzscxzf/rss"

def clean_slug(slug: str):
    print("Slug:", slug)
    return hashlib.md5((slug.split("?")[0]).encode("utf-8"), usedforsecurity=False).hexdigest()

class SyndicationFinder:
    def find_urls(self, string):
        x = re.split(' |\n', string)
        res = []
        for i in x:
            if i.startswith("https:") or i.startswith("http:"):
                res.append(i)
        return res
    
    def run(self, rss_url: str, domain: str, output: dict):
        feed = feedparser.parse(rss_url)
        if feed.status == 200:
            for entry in feed.entries:
                link = entry.get("link")
                description = entry.get("description")
                print(link)
                print(description)
                for e in self.find_urls(description):
                    print("Finder")
                    if domain in e:
                        e = clean_slug(e)
                        if output.get(e, False):
                            output[e].append(link)
                            print(output[e])
                        else:
                            output[e] = [link.strip()]
        else:
            print("Failed to get RSS feed. Status code:", feed.status)

class WriterSyndication:
    def __init__(self, rss_bsky: str, domain: str):
        print('Init')
        self.output = {}
        self.rss_bsky = rss_bsky
        self.domain = domain
    
    def data_gathering(self):
        s = SyndicationFinder()
        s.run(self.rss_bsky, self.domain, self.output)
    
    def write(self):
        for key in self.output.keys():
            path_folder = os.path.join("data", "syndication")
            Path(path_folder).mkdir(parents=True, exist_ok=True)
            print('Created:', path_folder)
            path_file = os.path.join(path_folder, key)
            with open(path_file + ".json", "w") as fp:
                json.dump({"syndication": self.output[key][0]}, fp)
                
    def run(self):
        self.data_gathering()
        self.write()
        
w = WriterSyndication(rss_bsky, domain)
w.run()
