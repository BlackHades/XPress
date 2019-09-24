#!/bin/bash

PORT=8000 pm2 start bin/www --name="8000"
PORT=8001 pm2 start bin/www --name="8001"
#PORT=8002 pm2 start bin/www --name="8002"
