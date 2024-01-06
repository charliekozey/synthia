#!/usr/bin/env bash

 if ! [ -d "./migrations" ]; then flask db init; fi
 flask db migrate
 flask db upgrade
 python3 seed.py
 flask run --host=0.0.0.0 --port=5000