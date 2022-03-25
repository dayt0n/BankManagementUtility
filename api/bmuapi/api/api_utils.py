from flask import jsonify


def error(msg=None):
    result = {"status": "error"}
    if msg:
        result['data'] = msg
    return jsonify(result)


def success(msg=None):
    result = {"status": "success"}
    if msg:
        result['data'] = msg
    return jsonify(result)
