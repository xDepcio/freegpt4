from flask import Flask, render_template, send_from_directory

app = Flask(
    __name__,
    static_folder="../../../frontend/dist/static",
    template_folder="../../../frontend/dist",
)


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def catch_all(path):
    print(app.static_folder)
    print(app.template_folder)
    return render_template("index.html")


@app.route("/complete", methods=["POST"])
def complete():
    return "# Hello, World! \n**this is bold** and this not \n```python\nprint('Hello, World!')\n```"


# @app.route("/")
# def serve():
#     """Serves the React app."""
#     print(app.static_folder)
#     return send_from_directory(app.static_folder, "index.html")


# @app.route("/assets/<path:path>")
# def serve_static(path):
#     """Serves static files."""
#     if path.endswith(".js"):
#         mimetype = "application/javascript"
#     elif path.endswith(".css"):
#         mimetype = "text/css"
#     else:
#         mimetype = "text/html"
#     return send_from_directory(app.static_folder, path, mimetype=mimetype)


if __name__ == "__main__":
    app.run(debug=True)
