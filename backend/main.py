from quart import Quart, request, jsonify
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
import logging
from quart_cors import cors

# Load environment variables from .env file
load_dotenv()

app = Quart(__name__)
app = cors(app, allow_origin="*")

# Configure MongoDB Atlas
client = AsyncIOMotorClient(f"mongodb+srv://{os.getenv('MONGO_USERNAME')}:{os.getenv('MONGO_PASSWORD')}@cluster0.tnmlf87.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client.myDatabase

'''
	POST endpoint for metric
	Takes metrics in form [{ 'name': metric_name, 'value': metric_value }]
	Stores it in the database
'''
@app.route('/metrics', methods=['POST'])
async def add_metrics():
    try:
        metrics = await request.get_json()
        
        # Ensure metrics is a list
        if not isinstance(metrics, list):
            return jsonify({'error': 'Expected a list of metrics'}), 400
        
        # Validate each metric
        for metric in metrics:
            if 'name' not in metric or 'value' not in metric:
                return jsonify({'error': 'Each metric must contain name and value'}), 400
            metric['timestamp'] = datetime.utcnow()
        
        # Insert all metrics at once
        await db.metrics.insert_many(metrics)
        return jsonify({'message': 'Metrics added successfully'}), 201
    except Exception as e:
        logging.error(f"Error adding metrics: {e}")
        return jsonify({'error': 'Bad Request'}), 400



'''
	Metrics average endpoint
	Arguments required: start date, end date and granularity
	Returns: An array of averages based on the granularity and available data.
'''
@app.route('/metrics/average', methods=['GET'])
async def get_average():
    start_str = request.args.get('start')
    end_str = request.args.get('end')
    granularity = request.args.get('granularity', 'days')
    metric_names = request.args.getlist('name')

    if not start_str or not end_str:
        return jsonify({'error': 'Missing start or end parameter'}), 400

    if not metric_names:
        return jsonify({'error': 'Missing metric names'}), 400

    try:
        start = datetime.fromisoformat(start_str)
        end = datetime.fromisoformat(end_str)
    except ValueError:
        return jsonify({'error': 'Invalid start or end parameter'}), 400

    # Determine the format string for granularity
    if granularity == 'minutes':
        group_id = {
            'year': {'$year': '$timestamp'},
            'month': {'$month': '$timestamp'},
            'day': {'$dayOfMonth': '$timestamp'},
            'hour': {'$hour': '$timestamp'},
            'minute': {'$minute': '$timestamp'},
            'name': '$name'
        }
    elif granularity == 'hours':
        group_id = {
            'year': {'$year': '$timestamp'},
            'month': {'$month': '$timestamp'},
            'day': {'$dayOfMonth': '$timestamp'},
            'hour': {'$hour': '$timestamp'},
            'name': '$name'
        }
    elif granularity == 'days':
        group_id = {
            'year': {'$year': '$timestamp'},
            'month': {'$month': '$timestamp'},
            'day': {'$dayOfMonth': '$timestamp'},
            'name': '$name'
        }
    else:
        return jsonify({'error': 'Invalid granularity parameter'}), 400

    pipeline = [
        {'$match': {'timestamp': {'$gte': start, '$lt': end}, 'name': {'$in': metric_names}}},
        {'$group': {'_id': group_id, 'average': {'$avg': '$value'}}},
        {'$sort': {'_id': 1}}  # Sort by the group_id to maintain chronological order
    ]

    result = await db.metrics.aggregate(pipeline).to_list(length=None)

    averages = [
        {
            'name': group['_id']['name'],
            'timestamp': datetime(
                group['_id']['year'],
                group['_id'].get('month', 1),
                group['_id'].get('day', 1),
                group['_id'].get('hour', 0),
                group['_id'].get('minute', 0)
            ).isoformat(),
            'average': group['average']
        }
        for group in result
    ]

    return jsonify({'averages': averages})

'''
	Metrics average endpoint
	Arguments required: start date, end date and granularity
	Returns: An array of averages based on the granularity and available data.
'''
@app.route('/metrics/list', methods=['GET'])
async def list_metrics():
    try:
        metrics = await db.metrics.distinct('name')
        return jsonify({'metrics': metrics}), 200
    except Exception as e:
        logging.error(f"Error listing metrics: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500


if __name__ == '__main__':
    app.run(debug=True)
