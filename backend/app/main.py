from fastapi import FastAPI
from sqlalchemy import text

from app.routers.auth import router as auth_router
from app.routers.admin_surveys import router as admin_surveys_router
from app.routers.public_surveys import router as public_surveys_router
from app.database import engine

app = FastAPI(
    title="Survey API",
    version="1.0.0",
)


@app.get("/")
def root():
    return {"message": "Survey API is running"}


app.include_router(auth_router)
app.include_router(admin_surveys_router)
app.include_router(public_surveys_router)


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.get("/database-health")
def database_health():
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))

        return {"database": "connected", "result": result.scalar()}
