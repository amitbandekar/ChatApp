import socket
import threading

HOST = '192.168.0.102'
PORT = 1234

active_clients = []

def listen_for_messages(client, username):
    while True:
        try:
            message = client.recv(2048).decode('utf-8')
            if message:
                final_msg = username + '~' + message
                send_messages_to_all(final_msg)
            else:
                remove_client(client)
        except:
            continue

def send_messages_to_all(message):
    for user in active_clients:
        try:
            user[1].sendall(message.encode())
        except:
            remove_client(user[1])

def remove_client(client):
    for user in active_clients:
        if user[1] == client:
            active_clients.remove(user)
            break

def client_handler(client):
    while True:
        username = client.recv(2048).decode('utf-8')
        if username:
            active_clients.append((username, client))
            prompt_message = "SERVER~" + f"{username} joined the chat"
            send_messages_to_all(prompt_message)
            break
        else:
            print("Client username is empty")
    threading.Thread(target=listen_for_messages, args=(client, username)).start()

def main():
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.bind((HOST, PORT))
    server.listen()

    print(f"Server started on {HOST}:{PORT}")

    while True:
        client, address = server.accept()
        print(f"Connection established with {address}")
        threading.Thread(target=client_handler, args=(client,)).start()

if __name__ == "__main__":
    main()
