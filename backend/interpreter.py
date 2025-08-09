import re
import time
import random

class MalayalamInterpreter:
    def __init__(self):
        self.vars = {}
        self.output = []

    def run_line(self, line):
        line = line.strip()

        # Variable assignment
        if "=" in line and not line.startswith("എങ്കിൽ"):
            var, val = line.split("=", 1)
            var = var.strip()
            val = val.strip().strip('"')
            self.vars[var] = val
            return

        # Print
        if line.startswith("പറയു "):
            text = line[7:]
            # Replace variable names in print
            for k, v in self.vars.items():
                text = text.replace(k, str(v))
            self.output.append(text)
            return

        # Loop
        if line.startswith("വരിക്കു "):
            count = int(line[8:])
            self.output.append(f"[Loop started: {count} times]")
            for _ in range(count):
                self.output.append("💻 പണി നടക്കുന്നു")
            return

        # Tea break
        if line.startswith("ചായകട"):
            self.output.append("☕ ചായ കുടിക്കുന്നു... (5s break)")
            time.sleep(1)  
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
