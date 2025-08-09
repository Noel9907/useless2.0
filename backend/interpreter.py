import re
import time
import random

class MalayalamInterpreter:
    def __init__(self):
        self.vars = {}
        self.output = []

    def run_line(self, line):
        line = line.strip()
        print(f"DEBUG: Processing line: '{line}'")

        # Variable assignment: പേര് = "നോവൽ"
        if "=" in line and not line.startswith("എങ്കിൽ"):
            var, val = line.split("=", 1)
            var = var.strip()
            val = val.strip()
            print(f"DEBUG: Raw var='{var}', Raw val='{val}'")
            # Remove surrounding quotes if present
            if val.startswith('"') and val.endswith('"'):
                val = val[1:-1]
            self.vars[var] = val
            print(f"DEBUG: Stored variable '{var}' = '{val}'")
            print(f"DEBUG: Current vars: {self.vars}")
            return

        # Print: പറയു ...
        if line.startswith("പറയു "):
            # Use replace to properly handle Unicode
            text = line.replace("പറയു ", "", 1)
            print(f"DEBUG: Text after 'പറയു ': '{text}'")
            # Remove quotes around final string if present
            if text.startswith('"') and text.endswith('"'):
                text = text[1:-1]
                print(f"DEBUG: Text after removing quotes: '{text}'")
            # Replace variables - check if the text is exactly a variable name
            print(f"DEBUG: Checking if '{text}' is in vars: {text in self.vars}")
            print(f"DEBUG: Available vars: {list(self.vars.keys())}")
            if text in self.vars:
                text = self.vars[text]
                print(f"DEBUG: Replaced with: '{text}'")
            self.output.append(text)
            print(f"DEBUG: Added to output: '{text}'")
            return

        # Loop: വരിക്കു 3
        if line.startswith("വരിക്കു "):
            count_str = line.replace("വരിക്കു ", "", 1).strip()
            try:
                count = int(count_str)
            except ValueError:
                self.output.append(f"❌ തെറ്റ്: '{count_str}' സംഖ്യയല്ല")
                return
            self.output.append(f"[Loop started: {count} times]")
            for _ in range(count):
                self.output.append("💻 പണി നടക്കുന്നു")
            return

        # Tea break: ചായകട
        if line.startswith("ചായകട"):
            self.output.append("☕ ചായ കുടിക്കുന്നു... (5s break)")
            time.sleep(1)  # Keep small delay for demo
            return

        # Unknown
        self.output.append(f"❌ തെറ്റ്: '{line}' എനിക്ക് മനസ്സിലായില്ല")

    def run(self, code):
        self.vars.clear()
        self.output.clear()
        for line in code.split("\n"):
            if line.strip():
                self.run_line(line)
        return "\n".join(self.output)