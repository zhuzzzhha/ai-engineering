# Используем официальный образ Python
FROM python:3.9-slim

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файлы в контейнер
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

COPY . .

# Открываем порт, на котором будет работать приложение
EXPOSE 5085

# Запускаем приложение
CMD [ "python3", "-m" , "flask", "run", "--host=0.0.0.0"]