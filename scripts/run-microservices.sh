# Script to run all Node.js microservices
cd "$(dirname "$0")/.." || exit 1

echo "Starting API Gateway on Port 5050..."
(cd microservices/api-gateway && PORT=5050 npm run dev) &
GATEWAY_PID=$!

echo "Starting Auth Service on Port 5001..."
(cd microservices/auth-service && npm run dev) &
AUTH_PID=$!

echo "Starting CRM Core Service on Port 5002..."
(cd microservices/crm-core-service && npm run dev) &
CRM_PID=$!

echo "Starting Communications Service on Port 5003..."
(cd microservices/communications-service && npm run dev) &
COMM_PID=$!

echo "All services started! Press Ctrl+C to stop all."

# Trap SIGINT to kill all background processes
trap "kill $GATEWAY_PID $AUTH_PID $CRM_PID $COMM_PID; exit" INT

wait
