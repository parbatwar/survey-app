from fastapi import FastAPI

app = FastAPI(
    title="My FastAPI Application",
    description="Backend API for the dynamic survey application",
    version="1.0.0",
)


@app.get("/")
def root():
    return {"message": "Welcome to the FastAPI application!"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}
