from flask import Flask
from config import Config
from flask_talisman import Talisman

app = Flask(__name__)
app.config.from_object(Config)
Talisman(app, content_security_policy=None)

from app import routes
