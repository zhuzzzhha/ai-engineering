# Используем официальный минималистичный образ Python
FROM python:3.9-slim

# Устанавливаем переменную окружения для автоматического подтверждения установки
ENV DEBIAN_FRONTEND=noninteractive

# Обновляем пакеты и устанавливаем OpenSCAD и другие системные зависимости
RUN apt-get update && apt-get install -y --no-install-recommends \
    openscad \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файлы зависимостей и устанавливаем Python-зависимости
COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Копируем оставшиеся файлы проекта
COPY . .

# Открываем порт для Flask-приложения
EXPOSE 5000

# Указываем команду запуска приложения
CMD ["python3", "-m", "flask", "run", "--host=0.0.0.0"]