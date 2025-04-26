#!/bin/sh
set -e

echo "Starting SonarQube health check..."

if wget -qO- http://localhost:9000/api/system/status | grep -q -e '"status":"UP"' -e '"status":"DB_MIGRATION_NEEDED"' -e '"status":"DB_MIGRATION_RUNNING"'; then
	exit 0
fi

exit 1