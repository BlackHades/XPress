#!/bin/bash

PORT=8000 pm2 start bin/www --name="8000"
PORT=8001 pm2 start bin/www --name="8001"
PORT=8002 pm2 start bin/www --name="8002"
PORT=8003 pm2 start bin/www --name="8003"
PORT=8004 pm2 start bin/www --name="8004"
PORT=8005 pm2 start bin/www --name="8005"