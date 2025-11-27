APP := online_shop
VENV := .venv
PYTHON := $(VENV)/bin/python
GUNICORN := $(VENV)/bin/gunicorn

LOG_DIR := /projects/3xel-new/logging
PID_DIR := /projects/3xel-new/pids

GUNICORN_PID := $(PID_DIR)/gunicorn.pid
CELERY_PID := $(PID_DIR)/celery.pid
REDIS_PID := /var/run/redis/redis-server.pid

.PHONY: gun-start gun-stop gun-restart \
        celery-start celery-stop celery-restart \
        redis-start redis-stop redis-restart \
        restart-site npm-install build migrate

# Ensure directories exist
prepare-dirs:
	mkdir -p $(LOG_DIR)
	mkdir -p $(PID_DIR)

#######################################
#               GUNICORN
#######################################

gun-start: prepare-dirs
	@echo "Starting Gunicorn..."
	$(GUNICORN) $(APP).wsgi:application \
	    --bind 127.0.0.1:8000 \
	    --workers 5 \
	    --threads 2 \
	    --timeout 120 \
	    --max-requests 1000 \
	    --max-requests-jitter 100 \
	    --pid $(GUNICORN_PID) \
	    --access-logfile $(LOG_DIR)/gunicorn.access.log \
	    --error-logfile $(LOG_DIR)/gunicorn.error.log \
	    --daemon

gun-stop:
	@if [ -f $(GUNICORN_PID) ]; then \
		echo "Stopping Gunicorn..."; \
		kill -TERM `cat $(GUNICORN_PID)`; \
		rm -f $(GUNICORN_PID); \
	else \
		echo "Gunicorn not running."; \
	fi

gun-restart: gun-stop gun-start
	@echo "Gunicorn restarted."


#######################################
#               CELERY
#######################################

celery-start: prepare-dirs
	@echo "Starting Celery..."
	$(VENV)/bin/celery -A $(APP) worker \
		-l info \
		--pidfile=$(CELERY_PID) \
		--logfile=$(LOG_DIR)/celery.log \
		--detach

celery-stop:
	@if [ -f $(CELERY_PID) ]; then \
		echo "Stopping Celery..."; \
		kill -TERM `cat $(CELERY_PID)`; \
		rm -f $(CELERY_PID); \
	else \
		echo "Celery not running."; \
	fi

celery-restart: celery-stop celery-start
	@echo "Celery restarted."


#######################################
#               REDIS
#######################################

redis-start:
	@if ! pgrep redis-server > /dev/null; then \
		echo "Starting Redis..."; \
		redis-server --daemonize yes; \
	else \
		echo "Redis already running."; \
	fi

redis-stop:
	@if pgrep redis-server > /dev/null; then \
		echo "Stopping Redis..."; \
		redis-cli shutdown; \
	else \
		echo "Redis not running."; \
	fi

redis-restart: redis-stop redis-start
	@echo "Redis restarted."


#######################################
#           Restart whole site
#######################################

restart-site: gun-restart celery-restart redis-restart
	@echo "==============================="
	@echo "       SITE RESTARTED ✔"
	@echo "==============================="

#######################################
#           Frontend & Django
#######################################

npm-install:
	cd frontend/3xel_frontend/3xel && npm ci

build:
	cd frontend/3xel_frontend/3xel && npm run build

migrate:
	$(PYTHON) manage.py migrate --noinput

push:
	git add . && git commit -m "update" && git push
