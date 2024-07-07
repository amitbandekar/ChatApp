
Chat Application

This is a simple chat application built using Python Socket.IO and Flask for the backend, and HTML, Tailwind CSS, and jQuery for the frontend. The application allows users to send text messages and GIFs (via the Tenor GIF API) in real-time.

Features

Real-time chat messaging
GIF support via Tenor GIF API
Responsive design for both PC and mobile
Notification for new users joining the chat
Screenshots
PC View

![alt text](/screenshots/3.png)
Mobile View

![alt text](/screenshots/2.jpeg) ![alt text](/screenshots/1.jpeg)

Installation
Clone the repository:

git clone 
cd chat-application
Create a virtual environment and activate it:


python3 -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
Install the required packages:


pip install -r requirements.txt
Run the TCP server:


python tcpserver.py
Run the web server:


python webserver.py

Usage
Open index.html in browser to start Connecting or Add this project into Xammp>htdocs directory to run using Appache 
Enter your username and start chatting.
Use the GIF button to search and send GIFs via the Tenor API.

Technologies Used
Backend: Python, Flask, Socket.IO
Frontend: HTML, Tailwind CSS, jQuery
APIs: Tenor GIF API
Contributing
Contributions are welcome! Please fork the repository and submit a pull request for any features, bug fixes, or enhancements.

License
This project is licensed under the MIT License. See the LICENSE file for more details.

Contact
For any inquiries, please contact [your-email@example.com].
ScreenShots 
