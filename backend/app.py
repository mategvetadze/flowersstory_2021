from flask import Flask, request, jsonify, abort
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_login import UserMixin, LoginManager, login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS
import click
from flask.cli import with_appcontext
from functools import wraps

app = Flask(__name__)
CORS(app, supports_credentials=True) # Enable CORS for all routes, allowing credentials

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///flowers.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'your_very_secret_key' # Needed for Flask-Login sessions

# Flask-Login setup
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login' # Name of the login route

@login_manager.user_loader
def load_user(user_id):
    # Ensure User model is defined before this is called, or handle potential circular import if User is in another file
    return User.query.get(int(user_id))

db = SQLAlchemy(app)
migrate = Migrate(app, db)

# Models
class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False) 
    role = db.Column(db.String(20), nullable=False, default='user') # e.g., 'user', 'admin'

    def __repr__(self):
        return f'<User {self.username}>'

class Flower(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    description = db.Column(db.String(255), nullable=True)
    image_url = db.Column(db.String(255), nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'price': self.price,
            'description': self.description,
            'image_url': self.image_url
        }

    def __repr__(self):
        return f'<Flower {self.name}>'

# Decorators
def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not current_user.is_authenticated: # Ensure user is logged in
            abort(401) # Unauthorized
        if not hasattr(current_user, 'role') or current_user.role != 'admin':
            abort(403)  # Forbidden
        return f(*args, **kwargs)
    return decorated_function

# CLI command
@click.command(name='create_admin')
@with_appcontext
@click.argument('username')
@click.argument('password')
def create_admin_command(username, password):
    """Creates a new admin user."""
    admin_user = User.query.filter_by(username=username, role='admin').first()
    if admin_user:
        print(f'Admin user {username} already exists.')
        return
    hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
    new_admin = User(username=username, password_hash=hashed_password, role='admin')
    db.session.add(new_admin)
    db.session.commit()
    print(f'Admin user {username} created successfully.')

app.cli.add_command(create_admin_command)

# Basic route
@app.route('/')
def hello():
    return "Hello from Flask backend!"

# Auth API Routes
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({'message': 'Username and password are required'}), 400
    username = data.get('username')
    password = data.get('password')
    if User.query.filter_by(username=username).first():
        return jsonify({'message': 'User already exists'}), 409
    hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
    new_user = User(username=username, password_hash=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({'message': 'Username and password are required'}), 400
    username = data.get('username')
    password = data.get('password')
    user = User.query.filter_by(username=username).first()
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({'message': 'Invalid username or password'}), 401
    login_user(user)
    return jsonify({'message': 'Login successful', 'user': {'username': user.username, 'role': user.role}}), 200

@app.route('/api/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Logout successful'}), 200

@app.route('/api/check_session', methods=['GET'])
@login_required
def check_session():
    # current_user is guaranteed to be authenticated by @login_required
    return jsonify({'logged_in': True, 'user': {'username': current_user.username, 'role': current_user.role}}), 200

# Public Flower API Routes
@app.route('/api/flowers', methods=['GET'])
def get_flowers():
    flowers = Flower.query.all()
    return jsonify([flower.to_dict() for flower in flowers]), 200

@app.route('/api/flowers/<int:flower_id>', methods=['GET'])
def get_flower(flower_id):
    flower = Flower.query.get_or_404(flower_id)
    return jsonify(flower.to_dict()), 200

# Admin Flower API Routes
@app.route('/api/admin/flowers', methods=['POST'])
@login_required
@admin_required
def create_flower():
    data = request.get_json()
    if not data or not data.get('name') or data.get('price') is None: # price can be 0, so check for None explicitly
        return jsonify({'message': 'Name and price are required'}), 400

    name = data.get('name')
    price = data.get('price')
    description = data.get('description')
    image_url = data.get('image_url')

    try:
        price = float(price)
        if price < 0:
            raise ValueError("Price cannot be negative.")
    except ValueError as e:
        return jsonify({'message': str(e) or 'Invalid price format.'}), 400


    new_flower = Flower(
        name=name,
        price=price,
        description=description,
        image_url=image_url
    )
    db.session.add(new_flower)
    db.session.commit()
    return jsonify(new_flower.to_dict()), 201

@app.route('/api/admin/flowers', methods=['GET'])
@login_required
@admin_required
def admin_get_flowers():
    flowers = Flower.query.all()
    return jsonify([flower.to_dict() for flower in flowers]), 200

if __name__ == '__main__':
    app.run(debug=True)
