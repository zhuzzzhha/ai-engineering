# import cv2
# import os
# from flask import Flask, flash, request, redirect, url_for, render_template
# from werkzeug.utils import secure_filename
# import sys
# from pathlib import Path
# from config import UPLOAD_FOLDER, REMOVE_TIME
# from utils import allowed_file, get_current_time, get_model, preprocess, process, get_image_w_h, remove_old_files

# app = Flask(__name__)
# app.secret_key = "secret key"
# app.config['UPLOAD_FOLDER'] = 'static/uploads'
# app.config['MAX_CONTENT_LENGTH'] = 20 * 1024 * 1024

# file = Path(__file__).resolve()
# parent, root = file.parent, file.parents[1]
# sys.path.append(str(root))

# try:
#     sys.path.remove(str(parent))
# except ValueError:
#     pass


# @app.route('/')
# def upload_form():
#     return render_template('home.html')


# @app.route('/upload_images', methods=['POST'])
# def upload_images():
#     if 'front' not in request.files or 'side' not in request.files or 'top' not in request.files:
#         flash('No file part')
#         return redirect(request.url)

#     front_file = request.files['front']
#     side_file = request.files['side']
#     top_file = request.files['top']

#     if front_file.filename == '' or side_file.filename =='' or top_file.filename == '':
#         flash('No images selected for uploading')
#         return redirect(request.url)

#     if all(allowed_file(f.filename) for f in [front_file, side_file, top_file]):
#         remove_old_files(UPLOAD_FOLDER, REMOVE_TIME)

#         now = get_current_time()
#         front_filename = now + secure_filename(front_file.filename)
#         side_filename = now + secure_filename(side_file.filename)
#         top_filename = now + secure_filename(top_file.filename)

#         front_file.save(os.path.join(UPLOAD_FOLDER, front_filename))
#         side_file.save(os.path.join(UPLOAD_FOLDER, side_filename))
#         top_file.save(os.path.join(UPLOAD_FOLDER, top_filename))

#         model = get_model()

#         # Process each image
#         images = [cv2.imread(os.path.join(UPLOAD_FOLDER, fn)) for fn in [front_filename, side_filename, top_filename]]
#         processed_images = [preprocess(image) for image in images]

#         # Assuming the model can process multiple images
#         res_images = process(model, processed_images)

#         # Save the results (assuming the model returns images)
#         for i, res_image in enumerate(res_images):
#             w, h = get_image_w_h(images[i])
#             res_image = cv2.resize(res_image, (w, h), interpolation=cv2.INTER_AREA)
#             cv2.imwrite(os.path.join(UPLOAD_FOLDER, now + f'result_i.png'), res_image)

#         # Clean up original images
#         for fn in [front_filename, side_filename, top_filename]:
#             os.remove(os.path.join(UPLOAD_FOLDER, fn))

#         # TODO: Generate STL and STEP files based on the model's output
#         stl_file = 'output.stl'  # Replace with actual file generation logic
#         step_file = 'output.step'  # Replace with actual file generation logic

#         flash('Images processed successfully. Download your files below.')
#         return render_template('home.html', stl_file=stl_file, step_file=step_file)

#     else:
#         flash('Allowed image types are -> png, jpg, jpeg')
#         return redirect(request.url)


# @app.route('/display/<filename>')
# def display_image(filename):
#     return redirect(url_for('static',
#                     filename='uploads/' + filename, code=301))

# if __name__ == "__main__":
#     app.run(port=5085)

from flask import Flask, flash, request, url_for, redirect, render_template, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import cv2
import sys
from pathlib import Path
from config import UPLOAD_FOLDER, REMOVE_TIME
from utils import allowed_file, get_current_time, get_model, preprocess, process, get_image_w_h, remove_old_files

app = Flask(__name__)
app.secret_key = "secret key"
app.config['UPLOAD_FOLDER'] = 'static/uploads'
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
        # Удаляем старые файлы
        #y
        #remove_old_files(UPLOAD_FOLDER, REMOVE_TIME)

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

        # Обработка изображений (заглушка)
        model = get_model()
        images = [cv2.imread(p) for p in [front_file_path, side_file_path, top_file_path]]
        processed_images = [preprocess(image) for image in images]
        res_images = process(model, processed_images)

        # Сохраняем обработанные изображения
        for i, res_image in enumerate(res_images):
            w, h = get_image_w_h(images[i])
            res_image = cv2.resize(res_image, (w, h), interpolation=cv2.INTER_AREA)
            result_filename = now + f'result_{i}.png'
            cv2.imwrite(os.path.join(UPLOAD_FOLDER, result_filename), res_image)

        # Пути к заглушечным файлам
        stl_file_path = os.path.join('misc', 'dummy.stl')
        step_file_path = os.path.join('misc', 'dummy.step')

        # Удаляем оригинальные изображения
        #for path in [front_file_path, side_file_path, top_file_path]:
          #  os.remove(path)

        # Возвращаем файлы в multipart response
        return send_file('misc/dummy.stl', as_attachment=True, download_name="output.stl")

    else:
        flash('Allowed image types are -> png, jpg, jpeg')
        return redirect(request.url)


@app.route('/display/<filename>')
def display_image(filename):
    return redirect(url_for('static',
                            filename='uploads/' + filename, code=301))


if __name__ == "__main__":
    app.run(port=5085)