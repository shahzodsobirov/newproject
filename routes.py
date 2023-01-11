from app import *
from app import db
from database import *
from pprint import pprint


def current_user():
    user_now = None
    if 'username' in session:
        user_get = Users.query.filter(Users.name == session['username']).first()
        user_now = user_get
    return user_now


@app.route('/')
def hello_world():  # put application's code here
    return render_template("main.html")


@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        name = request.form.get("name")
        surname = request.form.get("surname")
        number = request.form.get("number")
        birthday = request.form.get("birthday")
        password = request.form.get("password")
        hashed = generate_password_hash(password=password, method="sha256")
        add = Users(name=name, surname=surname, number=number, birthday=birthday, password=hashed)
        db.session.add(add)
        db.session.commit()
        student = Student(user_id=add.id)
        db.session.add(student)
        db.session.commit()
        return redirect(url_for("register"))
    return render_template("register.html")


@app.route("/register_teacher", methods=["GET", "POST"])
def register_teacher():
    if request.method == "POST":
        name = request.form.get("name")
        surname = request.form.get("surname")
        number = request.form.get("number")
        birthday = request.form.get("birthday")
        password = request.form.get("password")
        hashed = generate_password_hash(password=password, method="sha256")
        add = Users(name=name, surname=surname, number=number, birthday=birthday, password=hashed)
        db.session.add(add)
        db.session.commit()
        teacher = Teacher(user_id=add.id)
        db.session.add(teacher)
        db.session.commit()
        return redirect(url_for("register_teacher"))
    return render_template("add teacher.html")


@app.route("/creat_group", methods=["GET", "POST"])
def creat_group():
    if request.method == "POST":
        name = request.form.get("name")
        teacher = request.form.get("teacher")
        print(teacher)
        add = Group(name=name, teacher_id=teacher)
        db.session.add(add)
        db.session.commit()
        # students = db.session.query(Users).join(Users.student).options(contains_eager(Users.student)).filter(
        #     Student.status == True).order_by(Users.id).all()
        students = Student.query.filter(Student.status == True).all()
        for student in students:
            print(student.group)
            student.group.append(add)
            student.status = False
            db.session.commit()
        teacher = Teacher.query.filter(Teacher.user_id == teacher).first()
        teacher.group.append(add)
        db.session.commit()
        print("User")
        return redirect(url_for("creat_group"))
    student = Users.query.filter(Users.student != None).order_by(Users.id).all()
    teacher = Users.query.filter(Users.teacher != None).order_by(Users.id).all()
    return render_template("creat group.html", student=student, teacher=teacher)


@app.route("/change_status/<int:student_id>", methods=["GET", "POST"])
def change_status(student_id):
    value = request.get_json()['value']
    Student.query.filter(Student.id == student_id).update({
        "status": value
    })
    db.session.commit()
    return True


@app.route("/login", methods=["GET", "POST"])
def login():
    user = current_user()
    if request.method == "POST":
        name = request.form.get("name")
        password = request.form.get("password")
        username = Users.query.filter(Users.name == name).first()
        if username:
            if check_password_hash(username.password, password):
                session['username'] = username.name
                print(session['username'])
                return redirect(url_for('profile'))
            else:
                print(False)
                return render_template('main.html', error="Username or password is incorrect")
        else:
            print(False)
            return render_template('main.html', error="Username or password is incorrect")

    return render_template('login.html', user=user)


@app.route("/profile", methods=["GET", "POST"])
def profile():
    user = current_user()
    return render_template("profile.html", user=user)


@app.route("/groups", methods=["GET", "POST"])
def groups():
    user = current_user()
    group = Group.query.all()
    return render_template("groups.html", user=user, group=group)


@app.route("/test_result", methods=["GET", "POST"])
def test_result():
    user = current_user()
    group = Group.query.all()
    return render_template("test_result.html", user=user, group=group)


@app.route("/result", methods=["POST"])
def result():
    user = current_user()
    group = Group.query.all()
    result = request.get_json()['result']
    for item in result:
        student_id = item["student_id"]
        reading = item["reading"]
        listening = item["listening"]
        writing = item["writing"]
        speaking = item["speaking"]
        ball = int(listening) + int(reading) + int(writing) + int(speaking)
        overal = round(int(ball)) / 4
        print(ball)
        print(overal)
        add = Test(student_id=student_id, reading=reading, listening=listening, writing=writing, speaking=speaking,
                   overal=overal)
        db.session.add(add)
        db.session.commit()
    pprint(result)
    return render_template("test_result.html", user=user, group=group)


@app.route("/ielts_result")
def ielts_result():
    user = current_user()
    result = Test.query.all()
    return render_template("ielts.html", result=result, user=user)


@app.route("/choose_subject", methods=["GET", "POST"])
def choose():
    user = current_user()
    subject = Subject.query.all()
    if request.method == "POST":
        return redirect(url_for("choose_levels"))
    return render_template("choose subject.html", user=user, subject=subject)


@app.route("/choose_levels", methods=["GET", "POST"])
def choose_levels():
    user = current_user()
    levels = QuizLevels.query.all()
    if request.method == "POST":
        level = request.form.get("level")

        return redirect(url_for("creat_question", level=level))
    return render_template("choose levels.html", user=user, levels=levels)


@app.route("/creat_question/<int:level>", methods=["GET", "POST"])
def creat_question(level):
    subject = Subject.query.all()
    levels = QuizLevels.query.all()
    return render_template("creat test.html", subject=subject, levels=levels, level=level)


@app.route("/test", methods=["GET", "POST"])
def test():
    test = request.get_json()['list']
    pprint(test)
    return jsonify({
        'success': True
    })


@app.route("/subject", methods=["GET", "POST"])
def subject():
    if request.method == "POST":
        subject = request.form.get("subject")
        add = Subject(name=subject)
        db.session.add(add)
        db.session.commit()
    return render_template("subject.html")


@app.route("/levels", methods=["GET", "POST"])
def levels():
    if request.method == "POST":
        levels = request.form.get("levels")
        subject_id = request.form.get("subject")
        add = QuizLevels(levels=levels, subject_id=subject_id)
        db.session.add(add)
        db.session.commit()
        return redirect(url_for("levels"))
    subject = Subject.query.all()
    return render_template("quizlevels.html", subject=subject)
