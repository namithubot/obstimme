import pytest
import json
from datetime import datetime, timedelta
from unittest.mock import MagicMock
import sys
from main import app, db  

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

@pytest.fixture
def mock_db():
    db.metrics.aggregate = MagicMock(return_value=[
        {'_id': {'name': 'metric1', 'year': 2022, 'month': 1, 'day': 1, 'hour': 0, 'minute': 0}, 'average': 1.0},
        {'_id': {'name': 'metric2', 'year': 2022, 'month': 1, 'day': 1, 'hour': 0, 'minute': 0}, 'average': 2.0}
    ])
    yield db

def test_add_metrics(client, mock_db):
    metrics = [{'name': 'metric1', 'value': 1}, {'name': 'metric2', 'value': 2}]
    response = client.post('/metrics', json=metrics)
    assert response.status_code == 201
    assert json.loads(response.data) == {'message': 'Metrics added successfully'}
    mock_db.metrics.insert_many.assert_called_once()

def test_get_average(client, mock_db):
    start = datetime.utcnow() - timedelta(days=1)
    end = datetime.utcnow()
    response = client.get(f'/metrics/average?start={start.isoformat()}&end={end.isoformat()}&name=metric1&name=metric2')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert 'averages' in data
    assert isinstance(data['averages'], list)
    for average in data['averages']:
        assert 'name' in average
        assert 'timestamp' in average
        assert 'average' in average
        assert isinstance(average['name'], str)
        assert isinstance(datetime.fromisoformat(average['timestamp']), datetime)
        assert isinstance(average['average'], float)
    mock_db.metrics.aggregate.assert_called_once()
