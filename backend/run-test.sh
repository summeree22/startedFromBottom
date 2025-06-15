#!/bin/bash
node index.js &
SERVER_PID=$!

sleep 3

echo "🧪 테스트 중..."
if curl -s http://localhost:8080 > /dev/null; then
	echo "✅ 서버 응답 성공"
else
	echo "❌ 서버 응답 없음"
fi

if ps -p $SERVER_PID > /dev/null; then
	kill $SERVER_PID
	echo "🛑 서버 프로세스 종료"
else
	echo "❌ 서버 프로세스가 이미 종료됨"
fi
