import pytest
from rest_framework.test import APIClient
from django.contrib.sessions.backends.db import SessionStore


@pytest.fixture()
def client():
    return APIClient()

# Фикстура для добавления аргументов в сессию
@pytest.fixture()
def client_with_session(request, client):
    session = SessionStore()
    data = request.param
    for key, value in data.items():
        session[key] = value
    session.save()
    client.cookies['sessionid'] = session.session_key
    return client