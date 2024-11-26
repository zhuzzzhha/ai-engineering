from flask import Flask, flash, request, url_for, redirect, render_template, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import cv2
import sys
from ml.inference import execute_algo
from pathlib import Path
from config import UPLOAD_FOLDER, REMOVE_TIME
from utils import allowed_file, get_current_time, get_model, preprocess, process, get_image_w_h, remove_old_files

app = Flask(__name__)
app.secret_key = "secret key"
app.config['UPLOAD_FOLDER'] = 'misc/'
app.config['MAX_CONTENT_LENGTH'] = 20 * 1024 * 1024

CORS(app, resources={r"/*": {"origins": "*"}})  # Разрешает доступ всем доменам

file = Path(__file__).resolve()
parent, root = file.parent, file.parents[1]
sys.path.append(str(root))

try:
    sys.path.remove(str(parent))
except ValueError:
    pass


@app.route('/')
def upload_form():
    return render_template('home.html')


@app.route('/upload_images', methods=['POST'])
def upload_images():
    if 'front' not in request.files or 'side' not in request.files or 'top' not in request.files:
        flash('No file part')
        return redirect(request.url)

    front_file = request.files['front']
    side_file = request.files['side']
    top_file = request.files['top']

    if front_file.filename == '' or side_file.filename == '' or top_file.filename == '':
        flash('No images selected for uploading')
        return redirect(request.url)

    if all(allowed_file(f.filename) for f in [front_file, side_file, top_file]):

        # Генерируем уникальные имена для сохранения
        now = get_current_time()
        front_filename = now + secure_filename(front_file.filename)
        side_filename = now + secure_filename(side_file.filename)
        top_filename = now + secure_filename(top_file.filename)

        # Сохраняем изображения
        front_file_path = os.path.join(UPLOAD_FOLDER, front_filename)
        side_file_path = os.path.join(UPLOAD_FOLDER, side_filename)
        top_file_path = os.path.join(UPLOAD_FOLDER, top_filename)

        front_file.save(front_file_path)
        side_file.save(side_file_path)
        top_file.save(top_file_path)

        execute_algo(top_file_path, side_file_path, front_file_path)
        # Возвращаем файлы в multipart response
        return send_file('output/inference_stl.stl', as_attachment=True, download_name="output.stl")

    else:
        flash('Allowed image types are -> png, jpg, jpeg')
        return redirect(request.url)

if __name__ == "__main__":
    app.run(port=5085)