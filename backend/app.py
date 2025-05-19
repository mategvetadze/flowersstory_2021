from flask import Flask, request, jsonify, redirect, url_for, render_template, session
from flask_cors import CORS
import sqlite3
import os

from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.secret_key = "9a$k29#jsl@0kd!02kdns@#329s"
app.config["UPLOAD_FOLDER"] = "static/uploads/"
app.config['DATABASE'] = 'database.db'
ADMIN_EMAIL = 'admin@flowers.com'
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
CORS(app)


def connect_db():
    with sqlite3.connect('database.db') as connection:
        cursor = connection.cursor()
        cursor.execute('''
                       CREATE TABLE IF NOT EXISTS users
                       (
                           id
                           INTEGER
                           PRIMARY
                           KEY
                           AUTOINCREMENT,
                           fullName
                           TEXTz
                           NOT
                           NULL,
                           email
                           TEXT
                           NOT
                           NULL
                           UNIQUE,
                           password
                           TEXT
                           NOT
                           NULL
                       )
                       ''')
        cursor.execute('''
                       CREATE TABLE IF NOT EXISTS flowers
                       (
                           id
                           INTEGER
                           PRIMARY
                           KEY
                           AUTOINCREMENT,
                           name
                           TEXT
                           NOT
                           NULL,
                           description
                           TEXT
                           NOT
                           NULL,
                           picture
                           TEXT
                           NOT
                           NULL,
                           price
                           integer
                           NOT
                           NULL
                       )
                       ''')


connect_db()


@app.route('/signup', methods=['POST'])
def signup():
    try:
        name = request.form['fullName']
        email = request.form['email']
        password = generate_password_hash(request.form['password'])

        with sqlite3.connect('database.db') as connection:
            cursor = connection.cursor()
            cursor.execute('''
                           INSERT INTO users (fullName, email, password)
                           VALUES (?, ?, ?)
                           ''', (name, email, password))
            connection.commit()

        return jsonify({"success": True, "message": "User registered successfully"}), 201

    except sqlite3.IntegrityError:
        return jsonify({"success": False, "error": "Email already registered"}), 400

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/login', methods=['POST'])
def login():
    try:
        email = request.form['email']
        password = request.form['password']

        with sqlite3.connect('database.db') as connection:
            cursor = connection.cursor()
            cursor.execute('SELECT password FROM users WHERE email = ?', (email,))
            result = cursor.fetchone()

            if result is None:
                return jsonify({"success": False, "error": "Email not found"}), 404

            stored_hashed_password = result[0]

            if not check_password_hash(stored_hashed_password, password):
                return jsonify({"success": False, "error": "Incorrect password"}), 401

        # Check for admin
        if email == ADMIN_EMAIL:
            session['admin'] = True
            session['role'] = 'admin'
            return jsonify({"success": True, "message": "Admin login", "role": "admin"}), 200
        else:
            session['admin'] = False
            session['role'] = 'user'
        return jsonify({"success": True, "message": "User login", "role": "user"}), 200

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/products', methods=['GET'])
def products():
    with sqlite3.connect('database.db') as connection:
        cursor = connection.cursor()
        a = cursor.execute('''
                           SELECT *
                           FROM flowers''').fetchall()
        row = []
        for row in a:
            row.append({
                'name': row[1],
                'description': row[2],
                'price': row[4],
                'image': row[3],
            })
        return jsonify(row)


@app.route('/adminPage', methods=['POST'])
def admin_page():
    if session.get('role') != 'admin':
        return jsonify({"success": False, "error": "Access denied"}), 403
    try:
        name = request.form['name']
        description = request.form['description']
        price = request.form['price']
        image = request.files.get('image')

        if image:
            filename = secure_filename(image.filename)
            path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            image.save(path)

            with sqlite3.connect('database.db') as connection:
                cursor = connection.cursor()
                cursor.execute('''
                               INSERT INTO flowers (name, description, picture, price)
                               VALUES (?, ?, ?, ?)
                               ''', (name, description, filename, price))
                connection.commit()

        return jsonify({"success": True, "message": "Product added"}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({"success": True, "message": "Logged out"}), 200


if __name__ == '__main__':
    app.run(debug=True)
