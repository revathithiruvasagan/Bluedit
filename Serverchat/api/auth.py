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
        

        return jsonify({"success": True, "user": new_user})
    except Exception as e:
        print("Insert error:", e)
        return jsonify({"success": False, "message": str(e)}), 500

@auth_bp.route("/login", methods=["POST"])
def login():    
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"success": False, "message": "Missing email or password"}), 400

    try:
        res = supabase.table("users").select("*").eq("email", email).eq("password", password).execute()
        print("Select result:", res.data)

        if res.data:
            user = res.data[0]
            return jsonify({"success": True, "user": user})
        else:
            return jsonify({"success": False, "message": "Invalid credentials"}), 401
    except Exception as e:
        print("Select error:", e)
        return jsonify({"success": False, "message": str(e)}), 500  