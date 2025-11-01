# from flask import Blueprint, request, jsonify
# from supabaseclient import supabase
# import uuid

# community_bp = Blueprint("community", __name__)

# # Fetch all communities
# @community_bp.route("/communities", methods=["GET"])
# def get_communities():
#     try:
#         result = supabase.table("communities").select("*").execute()
#         communities = result.data or []
#         return jsonify({"communities": communities})
#     except Exception as e:
#         return jsonify({"success": False, "message": str(e)}), 500


# # Create a new community
# @community_bp.route("/communities", methods=["POST"])
# def create_community():
#     data = request.get_json()
#     name = data.get("name")
#     user_id = data.get("user_id")  # creator ID

#     if not name or not user_id:
#         return jsonify({"success": False, "message": "Missing fields"}), 400

#     try:
#         new_id = str(uuid.uuid4())
#         supabase.table("communities").insert({
#             "id": new_id,
#             "name": name,
#             "created_by": user_id
#         }).execute()

#         # Best-effort: add the creator as a member with role 'admin' and update their global role
#         warnings = []
#         member = None
#         try:
#             member = {
#                 "id": str(uuid.uuid4()),
#                 "community_id": new_id,
#                 "user_id": user_id,
#                 "role": "admin"
#             }
#             supabase.table("community_members").insert(member).execute()
#         except Exception as me:
#             warnings.append(f"Failed to add creator to community_members: {str(me)}")

#         # Update user's global role to 'admin' (non-fatal)
#         try:
#             supabase.table("users").update({"role": "admin"}).eq("id", user_id).execute()
#         except Exception as ure:
#             warnings.append(f"Failed to update user's role: {str(ure)}")

#         response = {"success": True, "community": {"id": new_id, "name": name}}
#         if member:
#             response["member"] = member
#         if warnings:
#             response["warnings"] = warnings

#         return jsonify(response), 201
#     except Exception as e:
#         return jsonify({"success": False, "message": str(e)}), 500


# # Send a message to a community (store in DB)
# @community_bp.route("/send_message", methods=["POST"])
# def send_message():
#     data = request.get_json() or {}
#     room = data.get("room")  # can be community id or name
#     username = data.get("username")
#     content = data.get("content")
#     user_id = data.get("user_id")

#     if not room or not content:
#         return jsonify({"success": False, "message": "Missing room or content"}), 400

#     try:
#         # Resolve community id by id first, then by name
#         community_resp = supabase.table("communities").select("*").eq("id", room).execute()
#         community = (community_resp.data or [])
#         if not community:
#             community_resp = supabase.table("communities").select("*").eq("name", room).execute()
#             community = (community_resp.data or [])

#         if not community:
#             return jsonify({"success": False, "message": "Community not found"}), 404

#         community_id = community[0]["id"]

#         # Resolve sender id if username provided and user_id not given
#         sender_id = None
#         if user_id:
#             sender_id = user_id
#         elif username:
#             uresp = supabase.table("users").select("*").eq("username", username).execute()
#             users = uresp.data or []
#             if users:
#                 sender_id = users[0].get("id")

#         new_id = str(uuid.uuid4())
#         record = {
#             "id": new_id,
#             "community_id": community_id,
#             "sender_id": sender_id,
#             "message": content
#         }

#         supabase.table("community_messages").insert(record).execute()

#         return jsonify({"success": True, "message": record}), 201
#     except Exception as e:
#         return jsonify({"success": False, "message": str(e)}), 500


# # Get messages for a community (by id or name)
# @community_bp.route("/get_messages/<room>", methods=["GET"])
# def get_messages(room):
#     try:
#         # Resolve community id
#         community_resp = supabase.table("communities").select("*").eq("id", room).execute()
#         community = (community_resp.data or [])
#         if not community:
#             community_resp = supabase.table("communities").select("*").eq("name", room).execute()
#             community = (community_resp.data or [])

#         if not community:
#             return jsonify({"success": False, "message": "Community not found"}), 404

#         community_id = community[0]["id"]

#         # Fetch messages ordered by created_at asc
#         resp = supabase.table("community_messages").select("*")\
#             .eq("community_id", community_id).order("created_at", asc=True).execute()
#         msgs = resp.data or []

#         # Collect sender_ids and batch fetch usernames
#         sender_ids = list({m.get("sender_id") for m in msgs if m.get("sender_id")})
#         users_map = {}
#         if sender_ids:
#             uresp = supabase.table("users").select("id,username").in_("id", tuple(sender_ids)).execute()
#             users = uresp.data or []
#             users_map = {u["id"]: u.get("username") for u in users}

#         out = []
#         for m in msgs:
#             out.append({
#                 "id": m.get("id"),
#                 "text": m.get("message"),
#                 "sender_id": m.get("sender_id"),
#                 "sender": users_map.get(m.get("sender_id")) if m.get("sender_id") else None,
#                 "timestamp": m.get("created_at")
#             })

#         return jsonify({"messages": out})
#     except Exception as e:
#         return jsonify({"success": False, "message": str(e)}), 500


from flask import Blueprint, request, jsonify
from supabaseclient import supabase

community_bp = Blueprint("community", __name__)

# ✅ Fetch all communities
@community_bp.route("/communities", methods=["GET"])
def get_communities():
    try:
        result = supabase.table("communities").select("*").execute()
        communities = result.data or []
        return jsonify({"communities": communities})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


# ✅ Create a new community + auto make creator admin member
@community_bp.route("/communities", methods=["POST"])
def create_community():
    data = request.get_json()
    name = data.get("name")
    user_id = data.get("user_id")

    if not name or not user_id:
        return jsonify({"success": False, "message": "Missing fields"}), 400

    try:
        # Insert & let Supabase auto-create UUID
        result = supabase.table("communities").insert({
            "name": name,
            "created_by": user_id
        }).execute()

        community = result.data[0]
        community_id = community["id"]

        # ✅ Create admin membership
        supabase.table("community_members").insert({
            "community_id": community_id,
            "user_id": user_id,
            "role": "admin"
        }).execute()

        return jsonify({
            "success": True,
            "community": community,
            "role": "admin"
        }), 201

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


# ✅ Send message to community
@community_bp.route("/send_message", methods=["POST"])
def send_message():
    data = request.get_json() or {}
    room = data.get("room")
    content = data.get("content")
    user_id = data.get("user_id")

    if not room or not content:
        return jsonify({"success": False, "message": "Missing fields"}), 400

    try:
        # Resolve community by id first, then name
        community_resp = supabase.table("communities").select("*").eq("id", room).execute()
        community = community_resp.data

        if not community:
            community_resp = supabase.table("communities").select("*").eq("name", room).execute()
            community = community_resp.data

        if not community:
            return jsonify({"success": False, "message": "Community not found"}), 404

        community_id = community[0]["id"]

        # ✅ Insert without manually creating ID — DB does it
        record = {
            "community_id": community_id,
            "sender_id": user_id,
            "message": content
        }

        inserted = supabase.table("community_messages").insert(record).execute()
        return jsonify({"success": True, "message": inserted.data[0]}), 201

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


# ✅ Get message history for community
@community_bp.route("/get_messages/<room>", methods=["GET"])
def get_messages(room):
    try:
        community_resp = supabase.table("communities").select("*").eq("id", room).execute()
        community = community_resp.data

        if not community:
            community_resp = supabase.table("communities").select("*").eq("name", room).execute()
            community = community_resp.data

        if not community:
            return jsonify({"success": False, "message": "Community not found"}), 404

        community_id = community[0]["id"]

        # ✅ Ordered messages
        resp = supabase.table("community_messages")\
            .select("*")\
            .eq("community_id", community_id)\
            .order("created_at")\
            .execute()

        msgs = resp.data or []

        # ✅ Map sender usernames
        sender_ids = list({m.get("sender_id") for m in msgs if m.get("sender_id")})

        users_map = {}
        if sender_ids:
            uresp = supabase.table("users").select("id,username").in_("id", sender_ids).execute()
            users_map = {u["id"]: u["username"] for u in (uresp.data or [])}

        out = []
        for m in msgs:
            out.append({
                "id": m.get("id"),
                "text": m.get("message"),
                "sender_id": m.get("sender_id"),
                "sender": users_map.get(m.get("sender_id")),
                "timestamp": m.get("created_at")
            })

        return jsonify({"messages": out}), 200

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

# ✅ Send Join Request
@community_bp.route("/communities/<community_id>/join_request", methods=["POST"])
def join_request(community_id):
    data = request.get_json()
    user_id = data.get("user_id")

    if not user_id:
        return jsonify({"success": False, "message": "User ID missing"}), 400

    try:
        # Check if already member
        member_check = supabase.table("community_members")\
            .select("*")\
            .eq("community_id", community_id)\
            .eq("user_id", user_id)\
            .execute()

        if member_check.data:
            return jsonify({"success": False, "message": "Already a member"}), 400

        # ✅ Add request row
        supabase.table("join_requests").insert({
            "community_id": community_id,
            "user_id": user_id,
            "status": "pending"
        }).execute()

        return jsonify({"success": True, "message": "Join request sent!"}), 201

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
