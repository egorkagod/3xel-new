APP := online_shop
VENV := .venv
PYTHON := $(VENV)/bin/python
GUNICORN := $(VENV)/bin/gunicorn

.PHONY: run install-requirements makemigrations migrate gun-start frontend celery redis redis-docker redis-down

run:
	$(PYTHON) manage.py runserver

install-requirements:
	uv pip install -r requirements.txt

migrate:
	$(PYTHON) manage.py migrate

gun-start:
	$(GUNICORN) $(APP).wsgi:application --bind localhost:8000 --daemon

frontend:
	cd $(CURDIR)/frontend/3xel_frontend/3xel && npm run dev

build:
	cd $(CURDIR)/frontend/3xel_frontend/3xel && npm run build

npm-install:
	cd $(CURDIR)/frontend/3xel_frontend/3xel && npm install

push:
	git add . && git commit -m "update" && git push

celery:
	$(VENV)/bin/celery -A $(APP) worker -l info

celery-daemon:
	$(VENV)/bin/celery -A $(APP) worker -l info --detach

# Start a local Redis via Docker (recommended if redis-server not installed)
redis-docker:
	docker run -d --name redis-3xel -p 6379:6379 redis:7-alpine

# Stop and remove dockerized Redis
redis-down:
	-docker rm -f redis-3xel

# Try to start system redis-server in background (if installed)
redis:
	redis-server --daemonize yes || true
