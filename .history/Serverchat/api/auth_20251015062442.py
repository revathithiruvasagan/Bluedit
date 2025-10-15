from flask import Blueprint, request, jsonify
from supabaseclient import supabase

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"success": False, "message": "Missing email or password"}), 400

    try:
        new_user = {
            
            "email": email,
            "password": password,
            "username": username
        }

        res = supabase.table("users").insert(new_user).execute()
        print("Insert result:", res.data)

        return jsonify({"success": True, "user": new_user})
    except Exception as e:
        print("Insert error:", e)
        return jsonify({"success": False, "message": str(e)}), 500

    