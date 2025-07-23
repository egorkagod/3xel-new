APP := online_shop
VENV := .venv
PYTHON := $(VENV)/bin/python
GUNICORN := $(VENV)/bin/gunicorn

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
