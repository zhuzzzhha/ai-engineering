from flask import Flask, flash, request, url_for, redirect, render_template, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import cv2
import sys
from ml.inference import execute_algo # Assuming you still want to use execute_algo
from pathlib import Path
from config import UPLOAD_FOLDER, REMOVE_TIME # Assuming you have these
from utils import allowed_file, get_current_time, get_model, preprocess, process, get_image_w_h, remove_old_files # Assuming these exist

app = Flask(__name__)
app.secret_key = "secret key"
app.config['UPLOAD_FOLDER'] = 'misc/'
app.config['MAX_CONTENT_LENGTH'] = 20 * 1024 * 1024

CORS(app, resources={r"/*": {"origins": "*"}})

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


@app.route('/process_data', methods=['POST'])
def process_data():

    if 'image' not in request.files or 'text' not in request.form:
        flash('Missing file or text input')
        return redirect(request.url)

    image_file = request.files['image']
    input_text = request.form['text']


    if image_file.filename == '':
        flash('No image selected for uploading')
        return redirect(request.url)
    
    if not input_text:
        flash('No text was provided!')
        return redirect(request.url)

    if allowed_file(image_file.filename):
        # Generate a unique filename for saving
        now = get_current_time()
        image_filename = now + secure_filename(image_file.filename)
        image_file_path = os.path.join(UPLOAD_FOLDER, image_filename)

        # Save the image
        image_file.save(image_file_path)

        #Preprocess the text
        processed_text = preprocess(input_text)
        
        # Execute processing algorithm (assuming it can take text and an image path)
        # Note: you may need to modify ml/inference/execute_algo to handle this.
        execute_algo(image_file_path, processed_text) 
         
        # Return the generated file as a download
        return send_file('output/inference.png', as_attachment=True, download_name="output.stl")

    else:
        flash('Allowed image types are -> png, jpg, jpeg')
        return redirect(request.url)


if __name__ == "__main__":
    app.run(port=5085)
