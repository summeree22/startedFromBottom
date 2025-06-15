#!/bin/bash
node index.js &

SEVER_PID=$!

sleep 5

kill $SERVER_PID
