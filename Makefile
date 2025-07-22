PYTHON := .venv/bin/python

run:
	$(PYTHON) manage.py runserver

install-requirements:
	uv pip install -r requirements.txt

makemigrations:
	$(PYTHON) manage.py makemigrations

migrate:
	$(PYTHON) manage.py migrate