from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO, emit, join_room
from api.auth import auth_bp
from api.community import community_bp
from supabaseclient import supabase

app = Flask(__name__)
CORS(app)

socketio = SocketIO(app, cors_allowed_origins="*")

# Register Blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(community_bp)

# ✅ Socket.IO: Join Room
@socketio.on("join_room")
def handle_join_room(data):
    room = data.get("room")
    join_room(room)
    emit("user_joined", data, room=room)

# ✅ Socket.IO: Send Message + Store in DB
@socketio.on("send_message")
def handle_send_message(data):
    room = data.get("room")
    user_id = data.get("user_id")
    message = data.get("message")

    if not room or not user_id or not message:
        return

    # ✅ Store in DB
    res = supabase.table("community_messages").insert({
        "community_id": room,
        "sender_id": user_id,
        "message": message
    }).execute()

    msg = res.data[0]
    emit("receive_message", msg, room=room)

if __name__ == "__main__":
    socketio.run(app, port=5000, debug=True, allow_unsafe_werkzeug=True)
