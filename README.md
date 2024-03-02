# Forum API Project with Clean Architecture and Automated TEsting

Forum API project is a simple backend forum application implement RESTful API using Hapi.js, provide a way to access and interact to some discussions. This project can be used to retrieve or post/delete some information, such as threads, comments, replies, and total likes. The project is built with clean architecture and boasts 100% test coverage using Jest for automated testing.

## Key Feature
- **RESTful API**: Implements a RESTful API architecture for easy integration and communication.
- **User Authentication**: Provides endpoints for user login, logout, and token refresh.
- **User Registration**: Allows users to register with username, password, and full name.
- **Thread Management**: Supports adding threads, getting threads by ID, and adding comments to threads.
- **Comment Interactions**: Enables deleting comments, adding replies to comments, and liking/unliking comments.
- **Automated Testing**: Achieves 100% test coverage using Jest for automated testing, ensuring the reliability of the application.
- **CI/CD Pipeline**: Implements a CI/CD pipeline for automated build, test, and deployment processes.

## Endpoints

### User Authentication
- POST /authentications
  - Login with username and password.
  -Payload: { "username": "your_username", "password": "your_password" }
- PUT /authentications
  - Refresh authentication with a valid refresh token.
  - Payload: { "refreshToken": "your_refresh_token" }
- DELETE /authentications
  - Logout with a valid refresh token.
  - Payload: { "refreshToken": "your_refresh_token" }

### User Registration
- POST /users
  - Register a new user.
  - Payload: { "username": "new_username", "password": "new_password", "fullname": "Full Name" }

### Threads
- POST /threads
  - Add a new thread.
  - Payload: { "title": "Thread Title", "body": "Thread Body" }
- GET /threads/{threadId}
  - Get a thread by ID.

### Comments
- POST /threads/{threadId}/comments
  - Add a comment to a thread.
  - Payload: { "content": "Comment Content" }
- DELETE /threads/{threadId}/comments/{commentId}
  - Delete a comment in a thread.

### Replies
- POST /threads/{threadId}/comments/{commentId}/replies
  - Add a reply to a comment.
  - Payload: { "content": "Reply Content" }
- DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}
  - Delete a reply in a comment.

## Likes
- PUT /threads/{threadId}/comments/{commentId}/likes
  - Like or unlike a comment in a thread.

## Installation

1. Clone the repository to your local machine:

```bash
git clone https://github.com/your-username/hapijs-project.git
cd hapijs-project
```

2. Install dependencies
```bash
npm install
```

Don't forget to set your .env

## Running the Application
To start the server, use the following command:
```bash
npm start
```

## Testing the Application
Run the following command to execute the tests:
```bash
npm test
```
## CI / CD Pipelines
The repository includes a CI/CD pipeline implemented with GitHub Actions. The pipeline automates the following processes:

- Build: Automatically builds the application whenever changes are pushed to the main branch or there's a pull request.
- Test: Runs automated tests using Jest if there's a pull request.
- Deploy: Deploys the application to the production after merging to main branch.

To view or modify the CI/CD workflow configuration, navigate to the .github/workflows directory in the repository.

## That's all
If you have any suggestions, please feel free to reach out to us at akhmaliswara@gmail.com .


