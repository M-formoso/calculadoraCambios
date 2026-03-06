import os
import uvicorn

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    print(f"Starting server on port {port}")
    print(f"PORT env var: {os.environ.get('PORT', 'not set')}")
    uvicorn.run("app.main:app", host="0.0.0.0", port=port)
