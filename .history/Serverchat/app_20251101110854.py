from flask import Flask
from flask_cors import CORS
from api.auth import auth_bp
from api.community import community_bp, socketio  # ✅ use the same socketio instance

app = Flask(__name__)
CORS(app)

# Register routes
app.register_blueprint(auth_bp)
app.register_blueprint(community_bp)

if __name__ == "__main__":
    # ✅ Must use socketio.run for WebSocket support
    socketio.run(app, host="0.0.0.0", port=5000, debug=True)
