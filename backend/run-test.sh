#!/bin/bash
node index.js &
SERVER_PID=$!

sleep 3

echo "🧪 Testing..."
if curl -s http://localhost:8080 > /dev/null; then
	echo "✅ Successfully responsed from server"
else
	echo "❌ No response from server"
fi

if ps -p $SERVER_PID > /dev/null; then
	kill $SERVER_PID
	echo "🛑 Stop server process"
else
	echo "❌ Server process has already stopped"
fi
