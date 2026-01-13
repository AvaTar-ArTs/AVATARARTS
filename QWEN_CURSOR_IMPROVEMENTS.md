# 🚀 Qwen & Cursor-Agent Improvements

> **Date:** January 12, 2026
> **Status:** Both tools tested and working
> **Next:** Add convenience aliases and functions

---

## ✅ Part 1: Current Status

### **Testing Results**

✅ **Qwen CLI (v0.6.0)**
- ✅ Installed and working
- ✅ Help system functional
- ✅ Extensive feature set
- ⚠️ No aliases/functions defined

✅ **Cursor-Agent (v2026.01.09)**
- ✅ Installed and working
- ✅ API key configured
- ✅ 13 models available
- ⚠️ No aliases/functions defined (using full command)

---

## 🔧 Part 2: Recommended Improvements

### **1. Add Cursor-Agent Aliases**

**Suggested Aliases:**
```bash
# Cursor-Agent aliases
alias ca="cursor-agent"
alias ca-chat="cursor-agent chat"
alias ca-cloud="cursor-agent --cloud"
alias ca-models="cursor-agent --list-models"
alias ca-resume="cursor-agent --resume"
alias ca-code="cursor-agent --print"
```

**Location:** Add to `~/.zshrc` after cursor-agent configuration (around line 130)

---

### **2. Add Cursor-Agent Function**

**Suggested Function:**
```bash
# Cursor-Agent wrapper function
ca() {
  # Load Cursor API key if needed
  if [[ -z "$CURSOR_API_KEY" ]]; then
    source ~/.env.d/loader.sh cursor >/dev/null 2>&1
  fi

  case "$1" in
    chat)
      shift
      cursor-agent chat "$@"
      ;;
    cloud)
      cursor-agent --cloud
      ;;
    models|list)
      cursor-agent --list-models
      ;;
    resume)
      shift
      cursor-agent --resume "$@"
      ;;
    code)
      shift
      cursor-agent --print "$@"
      ;;
    *)
      cursor-agent "$@"
      ;;
  esac
}
```

**Usage:**
```bash
ca                    # Interactive mode
ca chat "prompt"      # Chat mode
ca cloud              # Cloud mode
ca models             # List models
ca resume <id>        # Resume session
ca code "prompt"      # Non-interactive mode
```

---

### **3. Add Qwen Aliases**

**Suggested Aliases:**
```bash
# Qwen aliases
alias qwen-help="qwen --help"
alias qwen-version="qwen --version"
alias qwen-mcp="qwen mcp"
alias qwen-ext="qwen extensions"
alias qwen-code="qwen --sandbox"
```

---

### **4. Add Qwen Function (Optional)**

**Suggested Function:**
```bash
# Qwen wrapper function
qw() {
  case "$1" in
    mcp)
      shift
      qwen mcp "$@"
      ;;
    ext|extensions)
      shift
      qwen extensions "$@"
      ;;
    code)
      shift
      qwen --sandbox "$@"
      ;;
    *)
      qwen "$@"
      ;;
  esac
}
```

---

### **5. Integration with `ai()` Function**

**Update `ai()` function to include cursor-agent:**

```bash
# In ai() function (around line 590)
# Add cursor-agent option
selection=$(echo -e "grok\nopenai\nclaude\ncursor-agent" | fzf --prompt="Choose AI model> ")

case "$selection" in
  cursor-agent)
    cursor-agent "$@"
    ;;
  # ... existing cases
esac
```

---

## 📋 Part 3: Implementation Plan

### **Step 1: Add Cursor-Agent Aliases**

1. Open `~/.zshrc`
2. Find the cursor-agent configuration section (around line 130)
3. Add aliases after the configuration
4. Save and reload: `source ~/.zshrc`

---

### **Step 2: Add Cursor-Agent Function**

1. Add `ca()` function to `~/.zshrc`
2. Place after aliases or in functions section
3. Test: `ca models`

---

### **Step 3: Add Qwen Aliases**

1. Add qwen aliases to `~/.zshrc`
2. Group with other AI tool aliases
3. Test: `qwen-version`

---

### **Step 4: Update ai() Function (Optional)**

1. Modify `ai()` function to include cursor-agent
2. Test menu selection

---

## 🎯 Part 4: Quick Reference (After Implementation)

### **Cursor-Agent**

```bash
# Long form
cursor-agent
cursor-agent --list-models
cursor-agent chat "prompt"
cursor-agent --cloud

# Short aliases (after implementation)
ca
ca models
ca chat "prompt"
ca cloud
ca resume
ca code "prompt"
```

---

### **Qwen**

```bash
# Long form
qwen
qwen --version
qwen mcp
qwen extensions

# Short aliases (after implementation)
qwen-version
qwen-mcp
qwen-ext
qw mcp
qw ext
```

---

## ✅ Part 5: Summary

**Current State:**
- ✅ Both tools installed and working
- ✅ API keys configured
- ⚠️ No convenience aliases/functions

**Recommended Changes:**
1. ✅ Add cursor-agent aliases
2. ✅ Add cursor-agent function (`ca`)
3. ✅ Add qwen aliases
4. ⚠️ Optional: Add qwen function
5. ⚠️ Optional: Integrate with `ai()` function

**Impact:**
- Faster command execution
- Better discoverability
- Consistent with other AI tools
- Improved workflow

---

*Created: January 12, 2026*
*Next: Implement recommendations*
