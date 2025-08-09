"# Useless 2.0"

POST `http://127.0.0.1:8000/run`

body :

{
"mlm_code": "പേര് = \"നോവൽ\"\nപറയു പേര്\nവരിക്കു 2\nചായകട\nപറയു \"വേറെ ജോലി\""
}

response :

{
"output": "നോവൽ\n[Loop started: 2 times]\n💻 പണി നടക്കുന്നു\n💻 പണി നടക്കുന്നു\n☕ ചായ കുടിക്കുന്നു... (5s break)\nവേറെ ജോലി"
}

POST `http://localhost:8000/files/create`

body :

{
"filename": "hello_world.mlm",
"content": "പ്രിന്റ്('ഹെലോ')",
"session_id": "user_123"
}

response :
{
"id": "6896e1db82d2612b5370d6e5"
}

GET `http://localhost:8000/files/:id`

response :
{
"filename": "hello_world.mlm",
"content": "പ്രിന്റ്('ഹെലോ')",
"session_id": "user_123"
}

PUT `http://localhost:8000/files/:id`

body :
{
"filename": "hello_world.mlm",
"content": "പേര് = \"അപ്ഡേറ്റ് ചെയ്തു\"\nപറയു പേര്"
}

response :
{
"message": "File updated successfully"
}

GET `http://localhost:8000/files`

response :
[
{
"id": "6896ed5612c2a30201b040f5",
"filename": "hello_world.mlm",
"created_at": "2025-08-09T06:40:22.536000"
},
{
"id": "6896ed7012c2a30201b040f6",
"filename": "hello_world.mlm",
"created_at": "2025-08-09T06:40:48.253000"
},
{
"id": "6896ed7112c2a30201b040f7",
"filename": "hello_world.mlm",
"created_at": "2025-08-09T06:40:49.275000"
}
]

GET http://localhost:8000/files/:id
response :

{
"id": "6896ed5612c2a30201b040f5",
"filename": "hello_world.mlm",
"content": "പേര് = \"അപ്ഡേറ്റ് ചെയ്തു\"\nപറയു പേര്",
"session_id": "user_123",
"created_at": "2025-08-09T06:40:22.536000"
}

DELETE `http://localhost:8000/files/:id`

response :
{
"message": "File deleted successfully"
}

PATCH `http://127.0.0.1:8000/files/:id/rename`

body :
{
"filename": "new_file_name.txt"
}

response :
{
"message": "Filename updated successfully"
}
