{
    "title": "private.photo.cup",
    "description": "获取水杯取水照片",
    "type": "object",
    "required": [
        "cup"
    ],
    "properties": {
        "cup": {
            "type": "string",
            "format": "objectId"
        },
        "lte": {
            "type": "integer"
        },
        "gte": {
            "type": "integer"
        }
    }
}