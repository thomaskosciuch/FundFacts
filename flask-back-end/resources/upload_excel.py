from flask import request, jsonify

import json

import openpyxl
from resources.rows_to_map import rows_to_map


def upload_excel():
    if request.method == 'OPTIONS':
        response = jsonify()
        return response

    file = request.files.get("file")
    sheets = json.loads(request.form.get('sheets'))
    if not file or not sheets:
        print('bad, File or sheets not provided')
        return jsonify({"error": "File or sheets not provided"}), 400

    data_map = {}

    if file.filename.endswith('.xlsx'):
        # try:
        if True:
            workbook = openpyxl.load_workbook(file, data_only=True)

            for sheet_name in sheets:
                sheet = workbook[sheet_name]
                sheet_data = [[cell for cell in row]
                              for row in sheet.iter_rows(values_only=True)]
                data_map[sheet_name] = rows_to_map(sheet_data)
        # except Exception as e:
        #     print('error', e)
        #     return jsonify({"error": str(e)}), 500

    else:
        return jsonify({"error": "Please send an xlsx file"}), 400
    try:
        print(json.dumps(data_map, indent=2))
    except TypeError as e:
        print(data_map)
        print(f'\nerror, {e}')

    return jsonify({"message": f"successfully uploaded ({data_map.keys()})"})
