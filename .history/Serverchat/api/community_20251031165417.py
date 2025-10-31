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

        # Add the creator as a member with role 'admin'
        try:
            member = {
                "id": str(uuid.uuid4()),
                "community_id": new_id,
                "user_id": user_id,
                "role": "admin"
            }
            supabase.table("community_members").insert(member).execute()
        except Exception as me:
            # If member insertion fails, return community created but warn about membership
            return jsonify({"success": True, "community": {"id": new_id, "name": name},
                            "warning": f"Community created but failed to add creator as member: {str(me)}"}), 201

        return jsonify({"success": True, "community": {"id": new_id, "name": name}, "member": member}), 201
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


