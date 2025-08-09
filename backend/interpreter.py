import re
import time

class MalayalamInterpreter:
    def __init__(self):
        self.vars = {}
        self.output = []

    def replace_vars(self, text):
        """Replace {var} placeholders with stored variable values."""
        def repl(match):
            var_name = match.group(1)
            return str(self.vars.get(var_name, f"{{{var_name}}}"))
        return re.sub(r"\{([\wഀ-ൿ]+)\}", repl, text)

    def run_line(self, line):
        line = line.strip()

        # Variable assignment: പേര് = "നോവൽ"
        if "=" in line and not line.startswith("എങ്കിൽ"):
            var, val = line.split("=", 1)
            var = var.strip()
            val = val.strip()
            if val.startswith('"') and val.endswith('"'):
                val = val[1:-1]
            self.vars[var] = val
            return

        # Print: പറയു ...
        if line.startswith("പറയു "):
            text = line.replace("പറയു ", "", 1)
            if text.startswith('"') and text.endswith('"'):
                text = text[1:-1]
            if text in self.vars:
                text = self.vars[text]
            else:
                text = self.replace_vars(text)
            self.output.append(text)
            return

        # Tea break: ചായകട
        if line.startswith("ചായകട"):
            self.output.append("☕ ചായ കുടിക്കുന്നു... (5s break)")
            time.sleep(1)  # demo delay
            return

        # Unknown command
        self.output.append(f"❌ തെറ്റ്: '{line}' എനിക്ക് മനസ്സിലായില്ല")

    def run(self, code):
        self.vars.clear()
        self.output.clear()
        lines = code.split("\n")
        i = 0
        while i < len(lines):
            line = lines[i].strip()

            # Loop: വരിക്കു N ... അവസാനം
            if line.startswith("വരിക്കു "):
                count_str = line.replace("വരിക്കു ", "", 1).strip()
                try:
                    count = int(count_str)
                except ValueError:
                    self.output.append(f"❌ തെറ്റ്: '{count_str}' സംഖ്യയല്ല")
                    i += 1
                    continue

                # Collect loop body
                loop_body = []
                i += 1
                while i < len(lines) and lines[i].strip() != "അവസാനം":
                    loop_body.append(lines[i])
                    i += 1

                # Execute loop
                for _ in range(count):
                    for body_line in loop_body:
                        self.run_line(body_line)

                i += 1  # Skip "അവസാനം"
                continue

            # If condition: എങ്കിൽ var == "value" ... അവസാനം
            if line.startswith("എങ്കിൽ "):
                condition_str = line.replace("എങ്കിൽ ", "", 1).strip()

                # Collect if body
                if_body = []
                i += 1
                while i < len(lines) and lines[i].strip() != "അവസാനം":
                    if_body.append(lines[i])
                    i += 1

                # Parse condition
                try:
                    left, right = condition_str.split("==", 1)
                    left = left.strip()
                    right = right.strip().strip('"')

                    # Replace with var value if exists
                    left_val = self.vars.get(left, left)
                    if str(left_val) == right:
                        for body_line in if_body:
                            self.run_line(body_line)
                except ValueError:
                    self.output.append(f"❌ തെറ്റ്: '{condition_str}' ശരിയായ സ്ഥിതിയല്ല")

                i += 1  # Skip "അവസാനം"
                continue

            # Normal line
            if line:
                self.run_line(line)
            i += 1

        return "\n".join(self.output)
