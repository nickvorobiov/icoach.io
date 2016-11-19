#!/bin/bash

jekyll build --config _config.yml
htmlproofer ./_site --url-ignore www.youtube.com --file-ignore /vendor/ --empty-alt-ignore --alt-ignore "//"
