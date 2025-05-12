import flask
from flask import Flask, render_template, request, redirect, url_for, session
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash
import os
import sqlite3

app = flask.Flask(__name__)
app.secret_key = "9a$k29#jsl@0kd!02kdns@#329s"
app.config["UPLOAD_FOLDER"] = "static/uploads/"
app.config['DATABASE'] = 'flowers.db'
ADMIN_EMAIL = 'admin@flowers.com'
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)


def init_db():
    with sqlite3.connect(app.config['DATABASE']) as db:
        c = db.cursor()

        # Flowers table
        c.execute('''
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
                      TEXT,
                      image
                      TEXT
                      NOT
                      NULL
                  )
                  ''')

        # Users table
        c.execute('''
                  CREATE TABLE IF NOT EXISTS users
                  (
                      id
                      INTEGER
                      PRIMARY
                      KEY
                      AUTOINCREMENT,
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


init_db()


@app.route('/')
def index():
    with sqlite3.connect(app.config['DATABASE']) as db:
        flowers = db.execute('select * from flowers').fetchall()
        return render_template('index.html', flowers=flowers)


@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        email = request.form['email']
        password = generate_password_hash(request.form['password'])

        try:
            with sqlite3.connect(app.config['DATABASE']) as db:
                db.execute('''
                           insert into users (email, password)
                           values (?, ?)
                           ''', (email, password))
                return redirect(url_for('login'))
        except sqlite3.IntegrityError:
            return render_template('register.html',error="email already registered")
    return render_template('register.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        with sqlite3.connect(app.config['DATABASE']) as db:
            user = db.execute('select * from users where email=?', (email,)).fetchone()
        if user and check_password_hash(user[2], password):
            if user[1] == ADMIN_EMAIL:
                session['user'] = email
                session['admin'] = True
                return redirect(url_for('admin'))
            session['user'] = email
            return redirect(url_for('index'))
        else:
            return render_template('login.html',error='Incorrect email or password')
    return render_template('login.html')


@app.route('/admin', methods=['GET', 'POST'])
def admin():
    if not session.get('admin'):
        return redirect(url_for('login'))
    if session.get('user') != ADMIN_EMAIL:
        return redirect(url_for('login'))
    if request.method == 'POST':
        name = request.form['name']
        description = request.form['description']
        image = request.files['image']
        if image:
            filename = secure_filename(image.filename)
            path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            image.save(path)
            with sqlite3.connect(app.config['DATABASE']) as db:
                db.execute('''
                           insert into flowers (name, description, image)
                           values (?, ?, ?)''', (name, description, path))
    with sqlite3.connect(app.config['DATABASE']) as db:
        flowers = db.execute('select * from flowers').fetchall()
        return render_template('admin.html', flowers=flowers)

@app.route('/logout')
def logout():
    session.clear()  # Clear the session
    return redirect(url_for('login'))
if __name__ == '__main__':
    app.run(debug=True)
# with sqlite3.connect(app.config['DATABASE']) as db:
#     db.execute('''
#         drop table if exists flowers
#     ''')
#     db.execute('''
#         drop table if exists users
#      ''')
#     db.commit()
