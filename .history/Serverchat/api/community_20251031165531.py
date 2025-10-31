from flask import Blueprint, request, jsonify
from supabaseclient import supabase
import uuid

community_bp = Blueprint("community", __name__)

# Fetch all communities
@community_bp.route("/communities", methods=["GET"])
def get_communities():
    try:
        result = supabase.table("communities").select("*").execute()
        communities = result.data or []
        return jsonify({"communities": communities})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


# Create a new community
@community_bp.route("/communities", methods=["POST"])
def create_community():
    data = request.get_json()
    name = data.get("name")
    user_id = data.get("user_id")  # creator ID

    if not name or not user_id:
        return jsonify({"success": False, "message": "Missing fields"}), 400

    try:
        new_id = str(uuid.uuid4())
        supabase.table("communities").insert({
            "id": new_id,
            "name": name,
            "created_by": user_id
        }).execute()

        return jsonify({"success": True, "community": {"id": new_id, "name": name}})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


# Send join request
@community_bp.route("/communities/<community_id>/join", methods=["POST"])
def join_request(community_id):
    data = request.get_json()
    user_id = data.get("user_id")

    if not user_id:
        return jsonify({"success": False, "message": "Missing user ID"}), 400

    try:
        # Check if request already exists
        existing = supabase.table("community_requests").select("*")\
            .eq("community_id", community_id).eq("user_id", user_id).execute()

        if existing.data:
            return jsonify({"success": False, "message": "Request already sent"}), 400

        new_request = {
            "id": str(uuid.uuid4()),
            "community_id": community_id,
            "user_id": user_id,
            "status": "pending"
        }

        supabase.table("community_requests").insert(new_request).execute()
        return jsonify({"success": True, "message": "Request sent"})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


