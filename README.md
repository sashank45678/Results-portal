Results Portal
This project is a results portal designed using Node.js, Express.js, and MongoDB. The portal facilitates administrators to manage students and teachers, allowing them to add new users to the system. Only users added by the admin can log in to the portal. Teachers have the capability to filter students by sections, update their marks, and view challenges raised by students. Students can view their marks and raise challenges, while teachers can respond to challenges and update student marks accordingly. Additionally, teachers can upload documents in PDF format as responses.

Features
Admin Dashboard: Administrators have access to a dashboard for managing users, including adding students and teachers to the system.
Authentication: Users need to be added by the admin before they can log in to the portal, ensuring secure access control.
User Management: Admins can add, update, and delete students and teachers from the portal.
Student Marks: Students can view their marks for various subjects.
Challenges: Students can raise challenges regarding their marks, which are then viewed and responded to by teachers.
Teacher Response: Teachers can view challenges raised by students and provide responses, updating student marks accordingly.
File Upload: Teachers can upload documents in PDF format as responses to challenges or for other purposes.
Technologies Used
Node.js: Backend server environment built using Node.js for handling server-side logic.
Express.js: Express.js is used as the web application framework for Node.js, providing robust routing and middleware capabilities.
MongoDB: MongoDB is used as the database management system for storing user data, marks, challenges, and responses.
Passport.js: Passport.js is used for authentication middleware in Node.js applications, facilitating secure user authentication.
Multer: Multer middleware is used for handling file uploads, allowing teachers to upload PDF documents.
Getting Started
To get started with the project, follow these steps:

Clone this repository to your local machine.
Install dependencies using npm install.
Set up MongoDB and configure database connection settings in the application.
Start the server by running npm start.
Access the portal in your browser at http://localhost:3000.
Contributing
Contributions are welcome! If you have any suggestions, feature requests, or bug reports, please feel free to open an issue or submit a pull request.
