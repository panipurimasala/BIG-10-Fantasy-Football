from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit
from supabase import create_client, Client


supabase_url = "your_supabase_url"
supabase_key = "your_supabase_key"
supabase: Client = create_client(supabase_url, supabase_key)

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

response = supabase.table('newleague_user_teams').select('*').execute()



# Sample data structure (to be replaced with database queries)
draft_state = {
    "league": "league1",
    "order": [],  # Draft order, e.g., ["user1", "user2"]
    "current_index": 0,  # Tracks whose turn it is
}

@app.route('/start-drafting', methods=['POST'])
def start_drafting():
    data = request.json
    draft_state["order"] = data.get("order", [])
    draft_state["current_index"] = 0
    emit_to_all("draft_started", {"current_user": draft_state["order"][0]})
    return jsonify({"status": "Draft started!"})



@app.route('/make-pick', methods=['POST'])
def make_pick():
    data = request.json
    player = data["player"]
    user = data["user"]
    league = "league1"  # Example league; could be dynamic

    # Validate the pick
    if draft_state["order"][draft_state["current_index"]] != user:
        return jsonify({"error": "Not your turn"}), 400

    # Check if the player is available
    response = supabase.table("league_players").select("*").eq("name", player).execute()
    if response.data[0]["drafted"]:
        return jsonify({"error": "Player already drafted"}), 400

    # Update the database to mark the player as drafted
    supabase.table("league_players").update({"drafted": True}).eq("name", player).execute() #delete instead

    # Move to the next user
    draft_state["current_index"] = (draft_state["current_index"] + 1) % len(draft_state["order"])

    # Notify users
    emit_to_all("update_turn", {"current_user": draft_state["order"][draft_state["current_index"]]})
    return jsonify({"status": "Pick successful"})



def emit_to_all(event, data):
    socketio.emit(event, data)

if __name__ == "__main__":
    socketio.run(app, debug=True)
