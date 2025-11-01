from flask import Flask
from flask_cors import CORS
from api.auth import auth_bp
from api.community import community_bp
from flask_socketio import SocketIO, emit, join_room

app = Flask(__name__)
CORS(app)


# Register API routes
app.register_blueprint(auth_bp)
app.register_blueprint(community_bp)

# ✅ SocketIO Events here
@socketio.on("join_room")
def handle_join_room(data):
    room = data.get("room")
    join_room(room)
    emit("room_joined", {"room": room}, to=room)

@socketio.on("send_message")
def handle_send_message(data):
    room = data.get("room")
    emit("receive_message", data, to=room)

if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5000, debug=True)
