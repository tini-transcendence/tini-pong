def sanitize(data: str):
    data = (
        data.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace("\\(", "&#40;")
        .replace("\\)", "&#41;")
        .replace("/", "&#x2F;")
        .replace("'", "&#x27;")
        .replace('"', "&quot;")
    )
    return data


def sanitize_tag(data: str):
    data = data.replace("<", "&lt;").replace(">", "&gt;")
    return data
