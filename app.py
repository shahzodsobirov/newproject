from flask import Flask, request, redirect, render_template, url_for, session, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, String, Integer, Boolean, ForeignKey
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from flask_migrate import Migrate
import json
import os
from database import *

app = Flask(__name__)
app.config.from_object('config')

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
db = db_setup(app)
migrate = Migrate(app, db)

from routes import *

if __name__ == '__main__':
    app.run()
