from datetime import datetime
from flask import Flask, render_template, url_for, flash, redirect
from flask_sqlalchemy import SQLAlchemy
from forms import RegistrationForm, LoginForm

app = Flask(__name__)              #create app variable and setting it to instance of flask class 
app.config['SECRET_KEY'] = '5791628bb0b13ce0c676dfde280ba245'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
db = SQALchemy()         #create database instance
 
class User(db.Model):       #create class User that imports from db.Model 
    id = db.Column(db.Integer, primeKey=True)        #create column of unique ID for user(PrimeKey).
    username = db.Column(db.String(20), unique=True,nullable=False)      #create db column of username of user with max length of 20 characters. checks to make sure unique
    email = db.Column(db.String(120), unique=True,nullable=False)        #create db column of email of user with max length 120 char. Checks for unique
    image_file = db.Column(db.String(20), nullable=False,  ault='default.jpg')    #creates database column for profile picture. nullable is false, must have default picture 
    #^^^^^^^^^^WILL HAVE TO IMPORT A DEFAULT JPEG FOR THE PROFILES
    password = db.Column(db.String(60), nullable=False)         #creates db column for passwords. max 60 char because they are going to be hashed
    rank = db.Column(db.integer, level=True)        #creates db column for rank of profile
    
    def __repr__(self):             #specify REPR method(how object is printed out)
        return f"User('{self.username}', '{self.email}', '{self.image_file}')"      #returns username, email, and image file

