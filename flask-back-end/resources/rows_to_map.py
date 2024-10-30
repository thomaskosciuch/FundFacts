def rows_to_map(rows: list[list], header=0) -> list[dict]:
    map_array = []

    header += 1

    iterator = rows.__iter__()
    for _ in range(header):
        header: list[str] = iterator.__next__()
    while True:
        try:
            row = iterator.__next__()
        except StopIteration:
            break

        map_array.append({header[i]: value for i, value in enumerate(row)})
    return map_array
