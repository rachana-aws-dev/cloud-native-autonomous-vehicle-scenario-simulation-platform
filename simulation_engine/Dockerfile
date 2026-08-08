FROM python:3.12-slim

WORKDIR /simulation_engine

COPY . .

RUN pip install --no-cache-dir -r requirements.txt

CMD ["python","simulate.py"]