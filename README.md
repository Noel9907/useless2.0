"# Useless 2.0"

POST `http://127.0.0.1:8000/run`

body :

{
"mlm_code": "പേര് = \"നോവൽ\"\nപറയു പേര്\nവരിക്കു 2\nചായകട\nപറയു \"വേറെ ജോലി\""
}

response :

{
"output": "ര്\n[Loop started: 2 times]\n💻 പണി നടക്കുന്നു\n💻 പണി നടക്കുന്നു\n☕ ചായ കുടിക്കുന്നു... (5s break)\nേറെ ജോലി\""
}
