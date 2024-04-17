from flask import Flask, send_from_directory

app = Flask(__name__, static_folder="build")


@app.route("/")
def serve():
    """Serves the React app."""
    return send_from_directory(app.static_folder, "index.html")


@app.route("/<path:path>")
def serve_static(path):
    """Serves static files."""
    if path.endswith(".js"):
        mimetype = "application/javascript"
    elif path.endswith(".css"):
        mimetype = "text/css"
    else:
        mimetype = "text/html"
    return send_from_directory(app.static_folder, path, mimetype=mimetype)


if __name__ == "__main__":
    app.run(debug=True)
