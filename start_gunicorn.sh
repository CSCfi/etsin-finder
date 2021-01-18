#!/bin/sh
gunicorn --bind unix:/socket --access-logfile - --error-logfile - --config ./gunicorn_conf.py --reload etsin_finder.finder:app -b 0.0.0.0:5000 

