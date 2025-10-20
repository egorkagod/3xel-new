import pytest
from ..services import user_service


class TestEmailCode:
    # Успешный кейс
    @pytest.mark.skip 
    @pytest.mark.django_db
    def test_get(self, client):
        response = client.get('/api-root/code/', {'email': 'test@mail.ru'})
        assert response.status_code == 200
        assert client.session.get('email_code')
        assert client.session.get('email')

    # Если не передается email, то возвращается код 400
    def test_get_without_email(self, client):
        response = client.get('/api-root/code/')
        assert response.status_code == 400


class TestUserAuth:
    @pytest.mark.django_db
    @pytest.mark.parametrize(
        'client_with_session',
        [
            {'email_code': 1111, 'email': 'test@mail.ru'},
        ],
        indirect=["client_with_session"]
    )
    @pytest.mark.parametrize(
        ('data', 'status_code'),
        [
            ({'email': 'test@mail.ru', 'password': 'test', 'email_code': '1111', 'name': 'Петя',}, 200),
            ({'email': 'bad@mail.ru', 'password': 'test', 'email_code': '1111', 'name': 'Петя',}, 400),
            ({'email': 'test@mail.ru', 'password': 'test', 'email_code': '0000', 'name': 'Петя',}, 400),
            ({'password': 'test', 'email_code': '1111', 'name': 'Петя',}, 400),
            ({'email': 'test@mail.ru', 'password': 'test', 'name': 'Петя',}, 400),
        ]
    )
    def test_register(self, client_with_session, data, status_code):
        response = client_with_session.post('/api-root/register/', data, format='json')
        assert response.status_code == status_code

    # Успешный кейс
    @pytest.mark.django_db
    def test_login(self, client):
        user_service.create(
            username='test@mail.ru',
            email='test@mail.ru',
            password='test_password',
            first_name='Петя'
        )
        data = {
            'email': 'test@mail.ru',
            'password': 'test_password',
        }
        
        response = client.post('/api-root/login/', data, format='json')

        assert response.status_code == 200