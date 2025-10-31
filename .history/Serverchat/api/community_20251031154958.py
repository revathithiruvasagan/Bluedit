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


# Fetch pending requests (admin only)
@community_bp.route("/communities/<community_id>/requests", methods=["GET"])
def get_requests(community_id):
    admin_id = request.args.get("admin_id")
    try:
        # Verify admin
        community = supabase.table("communities").select("*").eq("id", community_id).execute().data[0]
        if community["created_by"] != admin_id:
            return jsonify({"success": False, "message": "Unauthorized"}), 403

        # Fetch pending requests
        requests = supabase.table("community_requests").select("*")\
            .eq("community_id", community_id).eq("status", "pending").execute().data
        return jsonify({"success": True, "requests": requests})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


# Approve or reject request (admin only)
@community_bp.route("/communities/<community_id>/requests/<request_id>", methods=["POST"])
def handle_request(community_id, request_id):
    data = request.get_json()
    admin_id = data.get("admin_id")
    action = data.get("action")  # "approve" or "reject"

    if action not in ["approve", "reject"]:
        return jsonify({"success": False, "message": "Invalid action"}), 400

    try:
        # Verify admin
        community = supabase.table("communities").select("*").eq("id", community_id).execute().data[0]
        if community["created_by"] != admin_id:
            return jsonify({"success": False, "message": "Unauthorized"}), 403

        # Update request status
        supabase.table("community_requests").update({"status": action}).eq("id", request_id).execute()
        return jsonify({"success": True, "message": f"Request {action}d"})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


# Admin can immediately join the community (join chat) — verifies admin and inserts into community_members
@community_bp.route("/communities/<community_id>/join-as-admin", methods=["POST"])
def join_as_admin(community_id):
    """Allow the community creator (admin) to join the community directly.

    Expected JSON body: { "admin_id": "...", "user_id": "..." }
    """
    data = request.get_json() or {}
    admin_id = data.get("admin_id")
    user_id = data.get("user_id")

    if not admin_id or not user_id:
        return jsonify({"success": False, "message": "Missing admin_id or user_id"}), 400

    try:
        # Verify admin
        community_resp = supabase.table("communities").select("*").eq("id", community_id).execute()
        community_data = community_resp.data or []
        if not community_data:
            return jsonify({"success": False, "message": "Community not found"}), 404

        community = community_data[0]
        if community.get("created_by") != admin_id:
            return jsonify({"success": False, "message": "Unauthorized - not admin"}), 403

        # Check if user is already a member
        existing = supabase.table("community_members").select("*")\
            .eq("community_id", community_id).eq("user_id", user_id).execute()

        if existing.data:
            return jsonify({"success": True, "message": "Already a member"})

        # Insert member record
        member = {"id": str(uuid.uuid4()), "community_id": community_id, "user_id": user_id}
        supabase.table("community_members").insert(member).execute()

        return jsonify({"success": True, "message": "Admin added to community and joined chat", "member": member})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
