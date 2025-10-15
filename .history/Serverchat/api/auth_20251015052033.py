from flask import Blueprint, request, jsonify
from supabase_client import supabase

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    result = supabase.table("users").select("*").eq("email", email).execute()
    users = result.data
    if not users:
        return jsonify({"success": False, "message": "User not found"}), 404

    user = users[0]
    if user["password"] != password:
        return jsonify({"success": False, "message": "Incorrect password"}), 401

    # Return user id and username for frontend tracking
    return jsonify({"success": True, "user": {"id": user["id"], "username": user["username"], "email": user["email"]}})
