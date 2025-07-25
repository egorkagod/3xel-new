APP := online_shop
VENV := .venv
PYTHON := $(VENV)/bin/python
GUNICORN := $(VENV)/bin/gunicorn

.PHONY: run install-requirements makemigrations migrate gun-start frontend

run:
	$(PYTHON) manage.py runserver

install-requirements:
	uv pip install -r requirements.txt

makemigrations:
	$(PYTHON) manage.py makemigrations

migrate:
	$(PYTHON) manage.py migrate

gun-start:
	$(GUNICORN) $(APP).wsgi:application --bind localhost:8000 --daemon

frontend:
	cd $(CURDIR)/frontend/3xel_frontend/3xel && npm run dev

build:
	cd $(CURDIR)/frontend/3xel_frontend/3xel && npm run build