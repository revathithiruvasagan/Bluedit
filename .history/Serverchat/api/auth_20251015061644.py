from flask import Blueprint, request, jsonify
from supabaseclient import supabase

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    # result = supabase.table("users").select("*").eq("email", email).execute()
    # users = result.data
    # print("Supabase result:", result.data)

    # result = supabase.table("users").select("*").execute()
    # all_users = result.data
    # print("Supabase all users:", all_users) 
    try:
        # Supabase doesn't allow raw SQL directly without a function
        # Instead, create a view in Supabase SQL editor:
        # CREATE VIEW public.all_tables AS
        # SELECT table_name
        # FROM information_schema.tables
        # WHERE table_schema='public';

        tables_result = supabase.table("all_tabs").select("*").execute()
        print("Supabase tables:", tables_result.data)
        return jsonify({"tables": tables_result.data})
    except Exception as e:
        print("An error occurred while fetching tables:", e)
        return jsonify({"error": str(e)}), 500

    # if not users:
    #     return jsonify({"success": False, "message": "User not found"}), 404

    # user = users[0]
    # if user["password"] != password:
    #     return jsonify({"success": False, "message": "Incorrect password"}), 401

    # # Return user id and username for frontend tracking
    # return jsonify({"success": True, "user": {"id": user["id"], "username": user["username"], "email": user["email"]}})
