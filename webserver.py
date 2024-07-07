from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit
import socket
import threading

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")


HOST = '192.168.0.102'
PORT = 1234

def listen_for_messages(client, username):
    while True:
        try:
            message = client.recv(2048).decode('utf-8')
            if message:
                socketio.emit('new_message', {'message': message, 'UserName': username})
            else:
                break
        except:
            break

@app.route('/connect', methods=['POST'])
def connect():
    data = request.json
    username = data.get('username')
    client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    try:
        client.connect((HOST, PORT))
        if username:
            client.sendall(username.encode())
            threading.Thread(target=listen_for_messages, args=(client, username)).start()
            return jsonify({'success': True, 'message': 'Connected to server', 'username': username})
        else:
            return jsonify({'success': False, 'message': 'Invalid Username', 'username': username})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)})
    
@socketio.on('connect_user')
def handle_connect_user(data):
    username = data.get('username')
    client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    try:
        client.connect((HOST, PORT))
        if username:
            client.sendall(username.encode())
            threading.Thread(target=listen_for_messages, args=(client, username)).start()
            socketio.emit('new_message', {'message': '', 'UserName': username, 'Type': 0})       
    except Exception as e:
        socketio.emit('new_message', {'message': str(e), 'UserName': 'SERVER', 'Type': 3})
    

@socketio.on('send_message')
def handle_send_message(data):
    username = data.get('UserName')
    message = data.get('message')
    Type = data.get('Type')
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as client:
        client.connect((HOST, PORT))
        client.sendall(f"{username}~{message}".encode())
        socketio.emit('new_message', {'message': message, 'UserName': username, 'Type': Type})

if __name__ == '__main__':
    socketio.run(app, debug=True,host="192.168.0.102", port=8000,allow_unsafe_werkzeug=True)
