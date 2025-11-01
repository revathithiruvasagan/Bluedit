from flask import Flask
from flask_cors import CORS
from api.auth import auth_bp
from routes.community import community_bp
from flask_socketio import SocketIO

app = Flask(__name__)
CORS(app)

socketio = SocketIO(app, cors_allowed_origins="*")

# Register routes
app.register_blueprint(auth_bp)
app.register_blueprint(community_bp)

if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5000, debug=True)
