import json
from flask import Flask, render_template, request, send_from_directory
import requests

app = Flask(
    __name__,
    static_folder="../../../frontend/dist/static",
    template_folder="../../../frontend/dist",
)

MODEL = "gpt-4-1106-preview"
token = None


def get_token():
    global token
    # Check if the .copilot_token file exists
    while True:
        try:
            with open(".copilot_token", "r") as f:
                access_token = f.read()
                break
        except FileNotFoundError:
            raise Exception("No token found")
    # Get a session with the access token
    resp = requests.get(
        "https://api.github.com/copilot_internal/v2/token",
        headers={
            "authorization": f"token {access_token}",
            "editor-version": "Neovim/0.6.1",
            "editor-plugin-version": "copilot.vim/1.16.0",
            "user-agent": "GithubCopilot/1.155.0",
        },
    )

    # Parse the response json, isolating the token
    resp_json = resp.json()
    token = resp_json.get("token")


def answer(chat):
    global token
    # If the token is None, get a new one
    if token is None:
        get_token()

    # If the token is None, get a new one
    # messages.append({"content": str(message), "role": "user"})

    try:
        resp = requests.post(
            "https://api.githubcopilot.com/chat/completions",
            headers={
                "authorization": f"Bearer {token}",
                "Editor-Version": "vscode/1.80.1",
            },
            json={
                "intent": False,
                "model": MODEL,
                "temperature": 0,
                "top_p": 1,
                "n": 1,
                "stream": True,
                "messages": chat,
            },
        )
    except requests.exceptions.ConnectionError:
        return ""

    result = ""

    # Parse the response text, splitting it by newlines
    resp_text = resp.text.split("\n")
    for line in resp_text:
        # If the line contains a completion, print it
        if line.startswith("data: {"):
            # Parse the completion from the line as json
            json_completion = json.loads(line[6:])
            try:
                completion = (
                    json_completion.get("choices")[0].get("delta").get("content")
                )
                if completion:
                    result += completion
                else:
                    result += "\n"
            except:
                pass

    # messages.append({"content": result, "role": "assistant"})

    if result == "":
        print(resp.status_code)
        print(resp.text)
    return result


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def catch_all(path):
    print(app.static_folder)
    print(app.template_folder)
    return render_template("index.html")


@app.route("/api/complete", methods=["POST"])
def complete():
    if not request.json:
        return {"error": "No JSON body provided"}

    chat = request.json["chat"]
    answered_message = answer(chat)

    return answered_message

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
