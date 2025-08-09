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
