# Flower Shop Backend

This document provides instructions for setting up, running, and interacting with the Flower Shop backend API.

## Setup and Running

Follow these steps to get the backend server operational on your local machine.

**1. Create and Activate a Virtual Environment:**

It's highly recommended to use a virtual environment to manage project dependencies.

*   For macOS/Linux:
    ```bash
    python3 -m venv venv
    source venv/bin/activate
    ```
*   For Windows:
    ```bash
    python -m venv venv
    venv\Scripts\activate
    ```

**2. Install Dependencies:**

Once the virtual environment is activated, install the required Python packages:
```bash
pip install -r requirements.txt
```

**3. Configure Flask Environment Variables:**

The application uses a `.flaskenv` file to load environment variables. Ensure this file exists in the `backend` directory with the following content:

```
FLASK_APP=app.py
FLASK_ENV=development
```
Flask will automatically pick these up. `FLASK_APP` tells Flask where your application instance is, and `FLASK_ENV=development` enables debug mode and other development features.

**4. Initialize the Database:**

Flask-Migrate is used for database schema management.

*   **First time setup only:** Initialize the migrations directory:
    ```bash
    flask db init
    ```
    (Note: If you are using `python -m flask` due to PATH issues, use `python -m flask db init`)

*   **Create and apply migrations:** Whenever models in `app.py` are changed, you need to generate a migration script and apply it:
    ```bash
    flask db migrate -m "Brief description of changes"
    flask db upgrade
    ```
    For the very first setup after `init`, you'll run `migrate` and `upgrade` to create the initial tables (e.g., User, Flower).

**5. Create an Initial Admin User:**

The application includes a CLI command to create an admin user.
```bash
flask create_admin <your_admin_username> <your_admin_password>
```
Replace `<your_admin_username>` and `<your_admin_password>` with your desired credentials. This user will have access to admin-only endpoints.

**6. Run the Development Server:**

Once everything is set up, you can start the Flask development server:
```bash
flask run
```
The server will typically start on `http://127.0.0.1:5000/`.

(Again, if you have PATH issues, you might need to use `python -m flask run`)

## API Endpoints

All API endpoints are prefixed with `/api`.

### Authentication

*   **Register User**
    *   `POST /api/register`
    *   Description: Registers a new user.
    *   Request Body: `{ "username": "newuser", "password": "password123" }`
    *   Response: `{ "message": "User registered successfully" }` (201) or error message.

*   **Login User**
    *   `POST /api/login`
    *   Description: Logs in an existing user and starts a session.
    *   Request Body: `{ "username": "user", "password": "password123" }`
    *   Response: `{ "message": "Login successful", "user": {"username": "user", "role": "user"} }` (200) or error message.

*   **Logout User**
    *   `POST /api/logout`
    *   Description: Logs out the currently authenticated user. Requires active session.
    *   Response: `{ "message": "Logout successful" }` (200).

*   **Check Session**
    *   `GET /api/check_session`
    *   Description: Checks if a user is currently logged in via an active session. Requires active session.
    *   Response: `{ "logged_in": true, "user": {"username": "user", "role": "user"} }` (200) or `{"logged_in": false}` (401 if not authenticated).

### Flowers (Public Access)

*   **List All Flowers**
    *   `GET /api/flowers`
    *   Description: Retrieves a list of all available flowers.
    *   Response: `[{"id": 1, "name": "Rose", ...}, ...]` (200).

*   **Get Specific Flower**
    *   `GET /api/flowers/<flower_id>`
    *   Description: Retrieves details for a specific flower by its ID.
    *   Response: `{"id": 1, "name": "Rose", ...}` (200) or 404 if not found.

### Flowers (Admin-Only)

These endpoints require the user to be authenticated and have an 'admin' role.

*   **Add New Flower**
    *   `POST /api/admin/flowers`
    *   Description: Adds a new flower to the shop.
    *   Request Body: `{ "name": "Tulip", "price": 2.99, "description": "Beautiful spring flower", "image_url": "..." }`
    *   Response: The newly created flower object `{"id": 3, "name": "Tulip", ...}` (201) or error message (400, 403).

*   **List All Flowers (Admin View)**
    *   `GET /api/admin/flowers`
    *   Description: Retrieves a list of all flowers (intended for admin panel, currently same as public but secured).
    *   Response: `[{"id": 1, "name": "Rose", ...}, ...]` (200) or error message (403).
---

This README should help developers get started with the Flower Shop backend.
```
