from fastapi import FastAPI
from sqlalchemy import text

from app.database import engine

app = FastAPI(
    title="Survey API",
    version="1.0.0",
)


@app.get("/")
def root():
    return {"message": "Survey API is running"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.get("/database-health")
def database_health():
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))

        return {"database": "connected", "result": result.scalar()}
