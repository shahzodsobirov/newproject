from app import *
from flask_migrate import Migrate
from sqlalchemy import String, Integer, Boolean, Column, ForeignKey, DateTime, or_, and_, desc, func, ARRAY, JSON, \
    extract
from sqlalchemy.orm import contains_eager
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func, functions

db = SQLAlchemy()


def db_setup(app):
    app.config.from_object('config')
    db.app = app
    db.init_app(app)
    Migrate(app, db)
    return db


class Users(db.Model):
    id = Column(Integer, primary_key=True)
    name = Column(String)
    surname = Column(String)
    number = Column(String)
    birthday = Column(String)
    password = Column(String)
    teacher = relationship('Teacher', backref="user", order_by="Teacher.id")
    student = relationship('Student', backref="user", order_by="Student.id")
    # ielts = relationship('Test', backref="user", order_by="Test.id")


class Student(db.Model):
    __tablename__ = "student"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    status = Column(Boolean)
    group = relationship('Group', secondary="student_group", backref="student", order_by="Group.id")
    test = relationship("Test", backref="student", order_by="Test.id")


class Teacher(db.Model):
    __tablename__ = "teacher"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    group = relationship('Group', secondary="teacher_group", backref="teacher", order_by="Group.id")


db.Table('teacher_group',
         Column('teacher_id', Integer, ForeignKey('teacher.id')),
         Column('group_id', Integer, ForeignKey('group.id')),
         )

db.Table('student_group',
         Column('student_id', Integer, ForeignKey('student.id')),
         Column('group_id', Integer, ForeignKey('group.id'))
         )


class Group(db.Model):
    __tablename__ = "group"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    teacher_id = Column(Integer)


class Test(db.Model):
    __tablename__ = "test"
    id = Column(Integer, primary_key=True)
    student_id = Column(Integer, ForeignKey("student.id"))
    reading = Column(String)
    listening = Column(String)
    writing = Column(String)
    speaking = Column(String)
    overal = Column(String)


class Subject(db.Model):
    __tablename__ = "subject"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    levels = db.relationship("QuizLevels", backref="subject", order_by="QuizLevels.id")
    questions = db.relationship("Questions", backref="subject", order_by="Questions.id")


class QuizLevels(db.Model):
    __tablename__ = "quiz_levels"
    id = Column(Integer, primary_key=True)
    subject_id = Column(Integer, ForeignKey("subject.id"))
    levels = Column(String)
    questions = db.relationship("Questions", backref="quiz_levels", order_by="Questions.id")


class Questions(db.Model):
    __tablename__ = "questions"
    id = Column(Integer, primary_key=True)
    subject_id = Column(Integer, ForeignKey("subject.id"))
    levels_id = Column(Integer, ForeignKey("quiz_levels.id"))
    question = Column(String)
    variants = db.relationship("Variants", backref="questions", order_by="Variants.id")

class Variants(db.Model):
    __tablename__ = "variants"
    id = Column(Integer, primary_key=True)
    subject_id = Column(Integer)
    levels_id = Column(Integer)
    question_id = Column(Integer, ForeignKey("questions.id"))
    variants = Column(String)
    answer = Column(Boolean)
