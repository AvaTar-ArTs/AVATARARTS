##### === Basics & Aliases === #####
# Use conda's Python instead of hardcoded versions
alias pip='python -m pip'
alias python='python3'

##### === Oh-My-Zsh === #####
export ZSH="$HOME/.oh-my-zsh"
export ZSH_CUSTOM="$ZSH/custom"
export ZSH_CACHE_DIR="$ZSH/cache"
ZSH_THEME="adben"
plugins=(zsh-autosuggestions zsh-syntax-highlighting)

# Lazy load Oh-My-Zsh for faster startup
if [[ -z "${ZSH_LOADED:-}" ]]; then
    source "$ZSH/oh-my-zsh.sh"
    export ZSH_LOADED=1
fi

##### === Homebrew Completions (Intel macOS) ===
if command -v brew &>/dev/null; then
  FPATH="$(brew --prefix)/share/zsh-completions:${FPATH}"
fi

##### === Environment Variable Loading === #####
# Load environment variables if .env file exists (with security check)
if [[ -f "$HOME/.env" ]]; then
  # Check if .env has proper permissions (600)
  if [[ $(stat -f %A "$HOME/.env" 2>/dev/null) == "600" ]]; then
    set -o allexport
    source "$HOME/.env"
    set +o allexport
  else
    echo "⚠️  Warning: .env file should have 600 permissions for security"
  fi
fi

##### === PATH Management === #####
typeset -U path

# Core user paths (brew > user > mamba > system)
path=(
  "/usr/local/bin"           # Homebrew managed binaries (Python, etc.) - PRIORITY
  "$HOME/.local/bin"         # Local tools managed by pipx
  "$HOME/.bun/bin"           # Bun JavaScript runtime
  "$HOME/Documents/python"   # Personal Python scripts
  "$path[@]"                 # Include all inherited paths
)

# Remove legacy Python user-site paths
path=(${path:#$HOME/Library/Python/3.11/bin})
#path=(${path:#$HOME/Library/Python/3.9/bin})

##### === Helper Functions ===
function ua {
  for file_path in "$@"; do
    [[ -e "$file_path" ]] || { echo "Path does not exist: $file_path" >&2; return 1; }
  done
  local -r absolute_paths=("${(@f)$(realpath "$@")}")
  /usr/bin/osascript -l JavaScript -e 'function run(argv) { Application("com.runningwithcrayons.Alfred").action(argv) }' "${absolute_paths[@]}"
}

##### === iTerm2 Integration ===
test -e "${HOME}/.iterm2_shell_integration.zsh" && source "${HOME}/.iterm2_shell_integration.zsh"

##### === Zsh Quality of Life Settings ===
setopt autocd
setopt correct
setopt nocaseglob
setopt nocasematch
bindkey -v

##### === Bun / pipx / Go ===
export BUN_INSTALL="$HOME/.bun"
export GOPATH="$HOME/go"
export GOBIN="$GOPATH/bin"
export PATH="$PATH:$GOBIN"

##### === Conda/Mamba Initialization (Optimized) ===
# Use conda's built-in initialization (includes mamba)
if [[ -f "/Users/steven/miniforge3/etc/profile.d/conda.sh" ]]; then
    . "/Users/steven/miniforge3/etc/profile.d/conda.sh"
else
    export PATH="/Users/steven/miniforge3/bin:$PATH"
fi

# Initialize conda for zsh
if command -v conda &>/dev/null; then
    eval "$(conda shell.zsh hook)"
fi

# nvm configuration (lazy load for performance)
export NVM_DIR="$HOME/.nvm"
nvm() {
    unset -f nvm
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
    nvm "$@"
}

##### === Final PATH Export === #####
export PATH
# Conversation Archive Quick Access Aliases
# Added by setup_quick_actions.sh on Tue Oct 14 17:49:56 EDT 2025
# Conversation Archive Quick Access Aliases
# Add these to your ~/.zshrc file

# Quick archive access
alias archive='~/quick_archive.sh'
alias arch='~/quick_archive.sh'

# Specific archive commands
alias arch-open='~/quick_archive.sh open'
alias arch-update='~/quick_archive.sh update'
alias arch-monitor='~/quick_archive.sh monitor'
alias arch-stop='~/quick_archive.sh stop'
alias arch-status='~/quick_archive.sh status'
alias arch-manage='~/quick_archive.sh manage'
alias arch-search='~/quick_archive.sh search'
alias arch-export='~/quick_archive.sh export'

# Quick update and open
alias arch-refresh='~/quick_archive.sh update && ~/quick_archive.sh open'

# Archive with search
alias arch-find='~/quick_archive.sh search'

# Show archive help
alias arch-help='~/quick_archive.sh help'

##### === Claude CLI Aliases ===
alias claude='~/claude-cli.py'
alias claude-i='~/claude-cli.py -i'
alias claude-f='~/claude-cli.py -f'

##### === OpenAI CLI Aliases ===
alias openai='~/openai-cli.py'
alias openai-i='~/openai-cli.py -i'
alias openai-f='~/openai-cli.py -f'
alias gpt='~/openai-cli.py'
alias gpt-i='~/openai-cli.py -i'
alias gpt-f='~/openai-cli.py -f'
alias gpt4='~/openai-cli.py -m gpt-4o'
alias gpt3='~/openai-cli.py -m gpt-3.5-turbo'

##### === xAI/Grok CLI Aliases ===
alias grok='~/xai-cli.py'
alias grok-i='~/xai-cli.py -i'
alias grok-f='~/xai-cli.py -f'
alias grok-s='~/xai-cli.py -s'
alias grok-models='~/xai-cli.py -l'
alias xai='~/xai-cli.py'
alias xai-i='~/xai-cli.py -i'
alias xai-s='~/xai-cli.py -s'

##### === Groq CLI Aliases ===
alias groq='~/groq-cli.py'
alias groq-i='~/groq-cli.py -i'
alias groq-f='~/groq-cli.py -f'
alias groq-models='~/groq-cli.py --list-models'

##### === Unified AI CLI Toolkit ===
alias ai='~/ai-cli-toolkit.py'
alias ai-i='~/ai-cli-toolkit.py -i'
alias ai-f='~/ai-cli-toolkit.py -f'
alias ai-models='~/ai-cli-toolkit.py -l'

# Service-specific shortcuts
alias openai='~/ai-cli-toolkit.py -s openai'
alias groq='~/ai-cli-toolkit.py -s groq'
alias claude='~/ai-cli-toolkit.py -s claude'
alias xai='~/ai-cli-toolkit.py -s xai'

# Interactive modes
alias openai-i='~/ai-cli-toolkit.py -s openai -i'
alias groq-i='~/ai-cli-toolkit.py -s groq -i'
alias claude-i='~/ai-cli-toolkit.py -s claude -i'
alias xai-i='~/ai-cli-toolkit.py -s xai -i'

# Model-specific shortcuts
alias gpt4='~/ai-cli-toolkit.py -s openai -m gpt-4'
alias gpt4o='~/ai-cli-toolkit.py -s openai -m gpt-4o'
alias llama3='~/ai-cli-toolkit.py -s groq -m llama3-8b-8192'
alias mixtral='~/ai-cli-toolkit.py -s groq -m mixtral-8x7b-32768'
alias grok2='~/ai-cli-toolkit.py -s xai -m grok-beta'
alias grok1='~/ai-cli-toolkit.py -s xai -m grok-1'

##### === AI CLI Help ===
alias ai-help='cat ~/AI-CLI-README.md'
alias ai-quick='cat ~/AI-CLI-Quick-Reference.md'

##### === API Key Setup ===
alias api-setup='~/api-key-setup.py --interactive'
alias api-list='~/api-key-setup.py --list'
alias api-keys='~/api-key-setup.py --list'
alias api-priority='~/priority-api-setup.py'
alias api-open='~/simple-api-setup.py'
alias api-select='~/api-selector.py'

##### === AI Configuration Manager ===
alias ai-config='~/ai-config.py'
alias config='~/ai-config.py'
alias config-simple='~/ai-config-simple.py'

##### === Deep Analysis Tools ===
alias deep-analyze='~/deep-analyzer.py'
alias ai-analyze='~/ai-deep-analyzer.py'
alias analyze='~/ai-deep-analyzer.py'
alias quick-analyze='~/quick-analyze.py'
alias qa='~/quick-analyze.py'



# bun completions
[ -s "/Users/steven/.bun/_bun" ] && source "/Users/steven/.bun/_bun"
export GROK_API_KEY="your-actual-xai-api-key-here"

##### === Basics & Aliases === #####
# Aliases for Python3 and Pip3 as defaults
alias pip='pip3'
alias python='python3'


##### === Oh-My-Zsh === #####
export ZSH="$HOME/.oh-my-zsh"
ZSH_THEME="adben"
plugins=(zsh-autosuggestions zsh-syntax-highlighting)
source "$ZSH/oh-my-zsh.sh"

##### === Homebrew Completions (Intel macOS) ===
if command -v brew &>/dev/null; then
  FPATH="$(brew --prefix)/share/zsh-completions:${FPATH}"
fi



##### === Load .env (project/system vars) ===
#if [[ -f "$HOME/.env" ]]; then
 # set -o allexport
 # source "$HOME/.env"
 # set +o allexport
#fi

##### === PATH Hygiene === #####
typeset -U path

# Core user paths (user > brew > conda > system)
path=(
  "$HOME/.local/bin"         # pipx & local tools
  "$HOME/.bun/bin"           # bun
  "$HOME/Documents/python"   # personal Python scripts
  "/usr/local/bin"           # Homebrew (Intel)
  "$path[@]"
)

# Remove legacy Python user-site paths
path=(${path:#$HOME/Library/Python/3.11/bin})
#path=(${path:#$HOME/Library/Python/3.9/bin})

##### === Optional Utilities ===
function ua {
  for file_path in "$@"; do
    [[ -e "$file_path" ]] || { echo "Path does not exist: $file_path" >&2; return 1; }
  done
  local -r absolute_paths=("${(@f)$(realpath "$@")}")
  /usr/bin/osascript -l JavaScript -e 'function run(argv) { Application("com.runningwithcrayons.Alfred").action(argv) }' "${absolute_paths[@]}"
}

##### === iTerm2 Integration ===
test -e "${HOME}/.iterm2_shell_integration.zsh" && source "${HOME}/.iterm2_shell_integration.zsh"

##### === Zsh QoL ===
setopt autocd
setopt correct
setopt nocaseglob
setopt nocasematch
bindkey -v

##### === Bun / pipx / Go ===
export BUN_INSTALL="$HOME/.bun"
export GOPATH="$HOME/go"
export GOBIN="$GOPATH/bin"
export PATH="$PATH:$GOBIN"



##### === Final PATH Export === #####
export PATH



# >>> conda initialize >>>
# !! Contents within this block are managed by 'conda init' !!
__conda_setup="$('/Users/steven/miniforge3/bin/conda' 'shell.zsh' 'hook' 2> /dev/null)"
if [ $? -eq 0 ]; then
    eval "$__conda_setup"
else
    if [ -f "/Users/steven/miniforge3/etc/profile.d/conda.sh" ]; then
        . "/Users/steven/miniforge3/etc/profile.d/conda.sh"
    else
        export PATH="/Users/steven/miniforge3/bin:$PATH"
    fi
fi
unset __conda_setup
# <<< conda initialize <<<


# >>> mamba initialize >>>
# !! Contents within this block are managed by 'mamba shell init' !!
export MAMBA_EXE='/Users/steven/miniforge3/bin/mamba';
export MAMBA_ROOT_PREFIX='/Users/steven/miniforge3';
__mamba_setup="$("$MAMBA_EXE" shell hook --shell zsh --root-prefix "$MAMBA_ROOT_PREFIX" 2> /dev/null)"
if [ $? -eq 0 ]; then
    eval "$__mamba_setup"
else
    alias mamba="$MAMBA_EXE"  # Fallback on help from mamba activate
fi
unset __mamba_setup
# <<< mamba initialize <<<


# nvm configuration
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

##### === BASICS === #####
alias pip='python -m pip'
alias python='python3'

##### === OH-MY-ZSH SETUP === #####
export ZSH="$HOME/.oh-my-zsh"
export ZSH_CUSTOM="$ZSH/custom"
export ZSH_CACHE_DIR="$ZSH/cache"
ZSH_THEME="adben"
plugins=(zsh-autosuggestions zsh-syntax-highlighting)

if [[ -z "${ZSH_LOADED:-}" ]]; then
  source "$ZSH/oh-my-zsh.sh"
  export ZSH_LOADED=1
fi

##### === HOMEBREW COMPLETIONS (INTEL) === #####
if command -v brew &>/dev/null; then
  FPATH="$(brew --prefix)/share/zsh-completions:${FPATH}"
fi

##### === ENVIRONMENT VARIABLE LOADER === #####
# Securely load ~/.env and sync ai-shell
if [[ -f "$HOME/.env" ]]; then
  if [[ $(stat -f %A "$HOME/.env" 2>/dev/null) == "600" ]]; then
    set -o allexport
    source "$HOME/.env"
    set +o allexport
  else
    echo "⚠️  Warning: ~/.env should have 600 permissions for security"
  fi
fi

# Auto-sync OpenAI, Anthropic, Gemini, Groq keys into Builder.io ai-shell
if [[ -n "$OPENAI_API_KEY" ]]; then
  mkdir -p ~/.config/ai-shell
  cat > ~/.config/ai-shell/config.json <<EOF
{
  "OPENAI_KEY": "$OPENAI_API_KEY",
  "ANTHROPIC_KEY": "$ANTHROPIC_API_KEY",
  "GEMINI_KEY": "$GEMINI_API_KEY",
  "GROQ_API_KEY": "$GROQ_API_KEY"
}
EOF
fi

##### === PATH MANAGEMENT === #####
typeset -U path
path=(
  "/usr/local/bin"           # Homebrew binaries
  "$HOME/.local/bin"         # pipx installs
  "$HOME/.bun/bin"           # Bun runtime
  "$HOME/Documents/python"   # Personal Python scripts
  "$path[@]"
)
# Remove legacy Python user-site paths
path=(${path:#$HOME/Library/Python/3.11/bin})
export PATH

##### === HELPER FUNCTIONS === #####
ua() {
  for file_path in "$@"; do
    [[ -e "$file_path" ]] || { echo "Path does not exist: $file_path" >&2; return 1; }
  done
  local -r absolute_paths=("${(@f)$(realpath "$@")}")
  /usr/bin/osascript -l JavaScript -e 'function run(argv){Application("com.runningwithcrayons.Alfred").action(argv)}' "${absolute_paths[@]}"
}

##### === iTERM2 INTEGRATION === #####
test -e "${HOME}/.iterm2_shell_integration.zsh" && source "${HOME}/.iterm2_shell_integration.zsh"

##### === ZSH QUALITY OF LIFE === #####
setopt autocd correct nocaseglob nocasematch
bindkey -v

##### === BUN / PIPX / GO === #####
export BUN_INSTALL="$HOME/.bun"
export GOPATH="$HOME/go"
export GOBIN="$GOPATH/bin"
export PATH="$PATH:$GOBIN"



# export PATH="$HOME/miniforge3/bin:$PATH"  # commented out by conda initialize


##### === NVM LAZY LOAD (PERFORMANCE) === #####
export NVM_DIR="$HOME/.nvm"
nvm() {
  unset -f nvm
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
  [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
  nvm "$@"
}

##### === AI & AUTOMATION MODULE === #####
# All AI / API / Analysis aliases live here for modularity
if [[ -f "$HOME/ai_aliases.sh" ]]; then
  source "$HOME/ai_aliases.sh"
fi

##### === FINAL EXPORTS & SECURITY === #####
export PATH
chmod 600 ~/.env 2>/dev/null

# >>> conda initialize >>>
# !! Contents within this block are managed by 'conda init' !!
__conda_setup="$('/Users/steven/miniforge3/bin/conda' 'shell.zsh' 'hook' 2> /dev/null)"
if [ $? -eq 0 ]; then
    eval "$__conda_setup"
else
    if [ -f "/Users/steven/miniforge3/etc/profile.d/conda.sh" ]; then
        . "/Users/steven/miniforge3/etc/profile.d/conda.sh"
    else
        export PATH="/Users/steven/miniforge3/bin:$PATH"
    fi
fi
unset __conda_setup
# <<< conda initialize <<<


# >>> mamba initialize >>>
# !! Contents within this block are managed by 'mamba shell init' !!
export MAMBA_EXE='/Users/steven/miniforge3/bin/mamba';
export MAMBA_ROOT_PREFIX='/Users/steven/miniforge3';
__mamba_setup="$("$MAMBA_EXE" shell hook --shell zsh --root-prefix "$MAMBA_ROOT_PREFIX" 2> /dev/null)"
if [ $? -eq 0 ]; then
    eval "$__mamba_setup"
else
    alias mamba="$MAMBA_EXE"  # Fallback on help from mamba activate
fi
unset __mamba_setup
# <<< mamba initialize <<<
eval "$(/usr/local/bin/brew shellenv)"
export PATH="$HOME/.local/bin:$PATH"
if command -v ngrok &>/dev/null; then
    eval "$(ngrok completion)"
  fi
##### === BASICS === #####
alias pip='python -m pip'
alias python='python3'

##### === OH-MY-ZSH SETUP === #####
export ZSH="$HOME/.oh-my-zsh"
export ZSH_CUSTOM="$ZSH/custom"
export ZSH_CACHE_DIR="$ZSH/cache"
ZSH_THEME="adben"
plugins=(zsh-autosuggestions zsh-syntax-highlighting)

if [[ -z "${ZSH_LOADED:-}" ]]; then
  source "$ZSH/oh-my-zsh.sh"
  export ZSH_LOADED=1
fi

##### === HOMEBREW COMPLETIONS (INTEL) === #####
if command -v brew &>/dev/null; then
  FPATH="$(brew --prefix)/share/zsh-completions:${FPATH}"
fi

##### === ENVIRONMENT VARIABLE LOADER === #####
# Securely load ~/.env and sync ai-shell
if [[ -f "$HOME/.env" ]]; then
  if [[ $(stat -f %A "$HOME/.env" 2>/dev/null) == "600" ]]; then
    set -o allexport
    source "$HOME/.env"
    set +o allexport
  else
    echo "⚠️  Warning: ~/.env should have 600 permissions for security"
  fi
fi

# Auto-sync OpenAI, Anthropic, Gemini, Groq keys into Builder.io ai-shell
if [[ -n "$OPENAI_API_KEY" ]]; then
  mkdir -p ~/.config/ai-shell
  cat > ~/.config/ai-shell/config.json <<EOF
{
  "OPENAI_KEY": "$OPENAI_API_KEY",
  "ANTHROPIC_KEY": "$ANTHROPIC_API_KEY",
  "GEMINI_KEY": "$GEMINI_API_KEY",
  "GROQ_API_KEY": "$GROQ_API_KEY"
}
EOF
fi

##### === PATH MANAGEMENT === #####
typeset -U path
path=(
  "/usr/local/bin"           # Homebrew binaries
  "$HOME/.local/bin"         # pipx installs
  "$HOME/.bun/bin"           # Bun runtime
  "$HOME/Documents/python"   # Personal Python scripts
  "$HOME/miniforge3/bin"     # Conda/Mamba base path
  "$path[@]"
)
# Remove legacy Python user-site paths
path=(${path:#$HOME/Library/Python/3.11/bin})
export PATH

##### === HELPER FUNCTIONS === #####
ua() {
  for file_path in "$@"; do
    [[ -e "$file_path" ]] || { echo "Path does not exist: $file_path" >&2; return 1; }
  done
  local -r absolute_paths=("${(@f)$(realpath "$@")}")
  /usr/bin/osascript -l JavaScript -e 'function run(argv){Application("com.runningwithcrayons.Alfred").action(argv)}' "${absolute_paths[@]}"
}

##### === iTERM2 INTEGRATION === #####
test -e "${HOME}/.iterm2_shell_integration.zsh" && source "${HOME}/.iterm2_shell_integration.zsh"

##### === ZSH QUALITY OF LIFE === #####
setopt autocd correct nocaseglob nocasematch
bindkey -v

##### === BUN / PIPX / GO === #####
export BUN_INSTALL="$HOME/.bun"
export GOPATH="$HOME/go"
export GOBIN="$GOPATH/bin"
export PATH="$PATH:$GOBIN"

##### === CONDA / MAMBA INITIALIZATION === #####
if [[ -f "$HOME/miniforge3/etc/profile.d/conda.sh" ]]; then
  source "$HOME/miniforge3/etc/profile.d/conda.sh"
fi
if command -v mamba &>/dev/null; then
  eval "$(mamba shell.zsh hook)"
else
  eval "$(conda shell.zsh hook)"
fi

##### === NVM LAZY LOAD (PERFORMANCE) === #####
export NVM_DIR="$HOME/.nvm"
nvm() {
  unset -f nvm
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
  [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
  nvm "$@"
}

##### === AI & AUTOMATION MODULE === #####
# All AI / API / Analysis aliases live here for modularity
if [[ -f "$HOME/ai_aliases.sh" ]]; then
  source "$HOME/ai_aliases.sh"
fi

##### === FINAL EXPORTS & SECURITY === #####
export PATH
chmod 600 ~/.env 2>/dev/null

##### === Basics & Aliases === #####
# Use conda's Python instead of hardcoded versions
alias pip='python -m pip'
alias python='python3'

##### === Oh-My-Zsh === #####
export ZSH="$HOME/.oh-my-zsh"
export ZSH_CUSTOM="$ZSH/custom"
export ZSH_CACHE_DIR="$ZSH/cache"
ZSH_THEME="adben"
plugins=(zsh-autosuggestions zsh-syntax-highlighting)

# Lazy load Oh-My-Zsh for faster startup
if [[ -z "${ZSH_LOADED:-}" ]]; then
    source "$ZSH/oh-my-zsh.sh"
    export ZSH_LOADED=1
fi

##### === Homebrew Completions (Intel macOS) ===
if command -v brew &>/dev/null; then
  FPATH="$(brew --prefix)/share/zsh-completions:${FPATH}"
fi

# Load environment variables if .env file exists (with security check)
if [[ -f "$HOME/.env" ]]; then
  if [[ $(stat -f %A "$HOME/.env" 2>/dev/null) == "600" ]]; then
    set -o allexport
    source "$HOME/.env"
    set +o allexport
  else
    echo "⚠️  Warning: .env file should have 600 permissions for security"
  fi
fi


##### === PATH Management === #####
typeset -U path

# Core user paths (brew > user > mamba > system)
path=(
  "/usr/local/bin"           # Homebrew managed binaries (Python, etc.) - PRIORITY
  "$HOME/.local/bin"         # Local tools managed by pipx
  "$HOME/.bun/bin"           # Bun JavaScript runtime
  "$HOME/Documents/python"   # Personal Python scripts
  "$path[@]"                 # Include all inherited paths
)

# Remove legacy Python user-site paths
path=(${path:#$HOME/Library/Python/3.11/bin})
#path=(${path:#$HOME/Library/Python/3.9/bin})

##### === Helper Functions ===
function ua {
  for file_path in "$@"; do
    [[ -e "$file_path" ]] || { echo "Path does not exist: $file_path" >&2; return 1; }
  done
  local -r absolute_paths=("${(@f)$(realpath "$@")}")
  /usr/bin/osascript -l JavaScript -e 'function run(argv) { Application("com.runningwithcrayons.Alfred").action(argv) }' "${absolute_paths[@]}"
}

##### === iTerm2 Integration ===
test -e "${HOME}/.iterm2_shell_integration.zsh" && source "${HOME}/.iterm2_shell_integration.zsh"

##### === Zsh Quality of Life Settings ===
setopt autocd
setopt correct
setopt nocaseglob
setopt nocasematch
bindkey -v

##### === Bun / pipx / Go ===
export BUN_INSTALL="$HOME/.bun"
export GOPATH="$HOME/go"
export GOBIN="$GOPATH/bin"
export PATH="$PATH:$GOBIN"

##### === Conda/Mamba Initialization (Optimized) ===
# Use conda's built-in initialization (includes mamba)
if [[ -f "/Users/steven/miniforge3/etc/profile.d/conda.sh" ]]; then
# . "/Users/steven/miniforge3/etc/profile.d/conda.sh"  # commented out by conda initialize
else
# export PATH="/Users/steven/miniforge3/bin:$PATH"  # commented out by conda initialize
fi

# Initialize conda for zsh
if command -v conda &>/dev/null; then
    eval "$(conda shell.zsh hook)"
fi

# nvm configuration (lazy load for performance)
export NVM_DIR="$HOME/.nvm"
nvm() {
    unset -f nvm
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
    nvm "$@"
}

##### === Final PATH Export === #####
export PATH
# Conversation Archive Quick Access Aliases
# Added by setup_quick_actions.sh on Tue Oct 14 17:49:56 EDT 2025
# Conversation Archive Quick Access Aliases
# Add these to your ~/.zshrc file

# Quick archive access
alias archive='~/quick_archive.sh'
alias arch='~/quick_archive.sh'

# Specific archive commands
alias arch-open='~/quick_archive.sh open'
alias arch-update='~/quick_archive.sh update'
alias arch-monitor='~/quick_archive.sh monitor'
alias arch-stop='~/quick_archive.sh stop'
alias arch-status='~/quick_archive.sh status'
alias arch-manage='~/quick_archive.sh manage'
alias arch-search='~/quick_archive.sh search'
alias arch-export='~/quick_archive.sh export'

# Quick update and open
alias arch-refresh='~/quick_archive.sh update && ~/quick_archive.sh open'

# Archive with search
alias arch-find='~/quick_archive.sh search'

# Show archive help
alias arch-help='~/quick_archive.sh help'

##### === Claude CLI Aliases ===
alias claude='~/claude-cli.py'
alias claude-i='~/claude-cli.py -i'
alias claude-f='~/claude-cli.py -f'

##### === OpenAI CLI Aliases ===
alias openai='~/openai-cli.py'
alias openai-i='~/openai-cli.py -i'
alias openai-f='~/openai-cli.py -f'
alias gpt='~/openai-cli.py'
alias gpt-i='~/openai-cli.py -i'
alias gpt-f='~/openai-cli.py -f'
alias gpt4='~/openai-cli.py -m gpt-4o'
alias gpt3='~/openai-cli.py -m gpt-3.5-turbo'

##### === xAI/Grok CLI Aliases ===
alias grok='~/xai-cli.py'
alias grok-i='~/xai-cli.py -i'
alias grok-f='~/xai-cli.py -f'
alias grok-s='~/xai-cli.py -s'
alias grok-models='~/xai-cli.py -l'
alias xai='~/xai-cli.py'
alias xai-i='~/xai-cli.py -i'
alias xai-s='~/xai-cli.py -s'

##### === Groq CLI Aliases ===
alias groq='~/groq-cli.py'
alias groq-i='~/groq-cli.py -i'
alias groq-f='~/groq-cli.py -f'
alias groq-models='~/groq-cli.py --list-models'

##### === Unified AI CLI Toolkit ===
alias ai='~/ai-cli-toolkit.py'
alias ai-i='~/ai-cli-toolkit.py -i'
alias ai-f='~/ai-cli-toolkit.py -f'
alias ai-models='~/ai-cli-toolkit.py -l'

# Service-specific shortcuts
alias openai='~/ai-cli-toolkit.py -s openai'
alias groq='~/ai-cli-toolkit.py -s groq'
alias claude='~/ai-cli-toolkit.py -s claude'
alias xai='~/ai-cli-toolkit.py -s xai'

# Interactive modes
alias openai-i='~/ai-cli-toolkit.py -s openai -i'
alias groq-i='~/ai-cli-toolkit.py -s groq -i'
alias claude-i='~/ai-cli-toolkit.py -s claude -i'
alias xai-i='~/ai-cli-toolkit.py -s xai -i'

# Model-specific shortcuts
alias gpt4='~/ai-cli-toolkit.py -s openai -m gpt-4'
alias gpt4o='~/ai-cli-toolkit.py -s openai -m gpt-4o'
alias llama3='~/ai-cli-toolkit.py -s groq -m llama3-8b-8192'
alias mixtral='~/ai-cli-toolkit.py -s groq -m mixtral-8x7b-32768'
alias grok2='~/ai-cli-toolkit.py -s xai -m grok-beta'
alias grok1='~/ai-cli-toolkit.py -s xai -m grok-1'

##### === AI CLI Help ===
alias ai-help='cat ~/AI-CLI-README.md'
alias ai-quick='cat ~/AI-CLI-Quick-Reference.md'

##### === API Key Setup ===
alias api-setup='~/api-key-setup.py --interactive'
alias api-list='~/api-key-setup.py --list'
alias api-keys='~/api-key-setup.py --list'
alias api-priority='~/priority-api-setup.py'
alias api-open='~/simple-api-setup.py'
alias api-select='~/api-selector.py'

##### === AI Configuration Manager ===
alias ai-config='~/ai-config.py'
alias config='~/ai-config.py'
alias config-simple='~/ai-config-simple.py'

##### === Deep Analysis Tools ===
alias deep-analyze='~/deep-analyzer.py'
alias ai-analyze='~/ai-deep-analyzer.py'
alias analyze='~/ai-deep-analyzer.py'
alias quick-analyze='~/quick-analyze.py'
alias qa='~/quick-analyze.py'



# bun completions
[ -s "/Users/steven/.bun/_bun" ] && source "/Users/steven/.bun/_bun"
export GROK_API_KEY="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"

# >>> conda initialize >>>
# !! Contents within this block are managed by 'conda init' !!
__conda_setup="$('/Users/steven/miniforge3/bin/conda' 'shell.zsh' 'hook' 2> /dev/null)"
if [ $? -eq 0 ]; then
    eval "$__conda_setup"
else
    if [ -f "/Users/steven/miniforge3/etc/profile.d/conda.sh" ]; then
        . "/Users/steven/miniforge3/etc/profile.d/conda.sh"
    else
        export PATH="/Users/steven/miniforge3/bin:$PATH"
    fi
fi
unset __conda_setup
# <<< conda initialize <<<


##### === Basics & Aliases === #####
# Use conda's Python instead of hardcoded versions
alias pip='python -m pip'
alias python='python3'

##### === Oh-My-Zsh === #####
export ZSH="$HOME/.oh-my-zsh"
export ZSH_CUSTOM="$ZSH/custom"
export ZSH_CACHE_DIR="$ZSH/cache"
ZSH_THEME="adben"
plugins=(zsh-autosuggestions zsh-syntax-highlighting)

# Lazy load Oh-My-Zsh for faster startup
if [[ -z "${ZSH_LOADED:-}" ]]; then
    source "$ZSH/oh-my-zsh.sh"
    export ZSH_LOADED=1
fi

##### === Homebrew Completions (Intel macOS) ===
if command -v brew &>/dev/null; then
  FPATH="$(brew --prefix)/share/zsh-completions:${FPATH}"
fi

##### === Environment Variable Loading === #####
# Load environment variables if .env file exists (with security check)
if [[ -f "$HOME/.env" ]]; then
  # Check if .env has proper permissions (600)
  if [[ $(stat -f %A "$HOME/.env" 2>/dev/null) == "600" ]]; then
    set -o allexport
    source "$HOME/.env"
    set +o allexport
  else
    echo "⚠️  Warning: .env file should have 600 permissions for security"
  fi
fi

##### === PATH Management === #####
typeset -U path

# Core user paths (brew > user > mamba > system)
path=(
  "/usr/local/bin"           # Homebrew managed binaries (Python, etc.) - PRIORITY
  "$HOME/.local/bin"         # Local tools managed by pipx
  "$HOME/.bun/bin"           # Bun JavaScript runtime
  "$HOME/Documents/python"   # Personal Python scripts
  "$path[@]"                 # Include all inherited paths
)

# Remove legacy Python user-site paths
path=(${path:#$HOME/Library/Python/3.11/bin})
#path=(${path:#$HOME/Library/Python/3.9/bin})

##### === Helper Functions ===
function ua {
  for file_path in "$@"; do
    [[ -e "$file_path" ]] || { echo "Path does not exist: $file_path" >&2; return 1; }
  done
  local -r absolute_paths=("${(@f)$(realpath "$@")}")
  /usr/bin/osascript -l JavaScript -e 'function run(argv) { Application("com.runningwithcrayons.Alfred").action(argv) }' "${absolute_paths[@]}"
}

##### === iTerm2 Integration ===
test -e "${HOME}/.iterm2_shell_integration.zsh" && source "${HOME}/.iterm2_shell_integration.zsh"

##### === Zsh Quality of Life Settings ===
setopt autocd
setopt correct
setopt nocaseglob
setopt nocasematch
bindkey -v

##### === Bun / pipx / Go ===
export BUN_INSTALL="$HOME/.bun"
export GOPATH="$HOME/go"
export GOBIN="$GOPATH/bin"
export PATH="$PATH:$GOBIN"

##### === Conda/Mamba Initialization (Optimized) ===
# Use conda's built-in initialization (includes mamba)
if [[ -f "/Users/steven/miniforge3/etc/profile.d/conda.sh" ]]; then
# . "/Users/steven/miniforge3/etc/profile.d/conda.sh"  # commented out by conda initialize
else
# export PATH="/Users/steven/miniforge3/bin:$PATH"  # commented out by conda initialize
fi

# Initialize conda for zsh
if command -v conda &>/dev/null; then
    eval "$(conda shell.zsh hook)"
fi

# nvm configuration (lazy load for performance)
export NVM_DIR="$HOME/.nvm"
nvm() {
    unset -f nvm
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
    nvm "$@"
}

##### === Final PATH Export === #####
export PATH
# Conversation Archive Quick Access Aliases
# Added by setup_quick_actions.sh on Tue Oct 14 17:49:56 EDT 2025
# Conversation Archive Quick Access Aliases
# Add these to your ~/.zshrc file

# Quick archive access
alias archive='~/quick_archive.sh'
alias arch='~/quick_archive.sh'

# Specific archive commands
alias arch-open='~/quick_archive.sh open'
alias arch-update='~/quick_archive.sh update'
alias arch-monitor='~/quick_archive.sh monitor'
alias arch-stop='~/quick_archive.sh stop'
alias arch-status='~/quick_archive.sh status'
alias arch-manage='~/quick_archive.sh manage'
alias arch-search='~/quick_archive.sh search'
alias arch-export='~/quick_archive.sh export'

# Quick update and open
alias arch-refresh='~/quick_archive.sh update && ~/quick_archive.sh open'

# Archive with search
alias arch-find='~/quick_archive.sh search'

# Show archive help
alias arch-help='~/quick_archive.sh help'

##### === Claude CLI Aliases ===
alias claude='~/claude-cli.py'
alias claude-i='~/claude-cli.py -i'
alias claude-f='~/claude-cli.py -f'

##### === OpenAI CLI Aliases ===
alias openai='~/openai-cli.py'
alias openai-i='~/openai-cli.py -i'
alias openai-f='~/openai-cli.py -f'
alias gpt='~/openai-cli.py'
alias gpt-i='~/openai-cli.py -i'
alias gpt-f='~/openai-cli.py -f'
alias gpt4='~/openai-cli.py -m gpt-4o'
alias gpt3='~/openai-cli.py -m gpt-3.5-turbo'

##### === xAI/Grok CLI Aliases ===
alias grok='~/xai-cli.py'
alias grok-i='~/xai-cli.py -i'
alias grok-f='~/xai-cli.py -f'
alias grok-s='~/xai-cli.py -s'
alias grok-models='~/xai-cli.py -l'
alias xai='~/xai-cli.py'
alias xai-i='~/xai-cli.py -i'
alias xai-s='~/xai-cli.py -s'

##### === Groq CLI Aliases ===
alias groq='~/groq-cli.py'
alias groq-i='~/groq-cli.py -i'
alias groq-f='~/groq-cli.py -f'
alias groq-models='~/groq-cli.py --list-models'

##### === Unified AI CLI Toolkit ===
alias ai='~/ai-cli-toolkit.py'
alias ai-i='~/ai-cli-toolkit.py -i'
alias ai-f='~/ai-cli-toolkit.py -f'
alias ai-models='~/ai-cli-toolkit.py -l'

# Service-specific shortcuts
alias openai='~/ai-cli-toolkit.py -s openai'
alias groq='~/ai-cli-toolkit.py -s groq'
alias claude='~/ai-cli-toolkit.py -s claude'
alias xai='~/ai-cli-toolkit.py -s xai'

# Interactive modes
alias openai-i='~/ai-cli-toolkit.py -s openai -i'
alias groq-i='~/ai-cli-toolkit.py -s groq -i'
alias claude-i='~/ai-cli-toolkit.py -s claude -i'
alias xai-i='~/ai-cli-toolkit.py -s xai -i'

# Model-specific shortcuts
alias gpt4='~/ai-cli-toolkit.py -s openai -m gpt-4'
alias gpt4o='~/ai-cli-toolkit.py -s openai -m gpt-4o'
alias llama3='~/ai-cli-toolkit.py -s groq -m llama3-8b-8192'
alias mixtral='~/ai-cli-toolkit.py -s groq -m mixtral-8x7b-32768'
alias grok2='~/ai-cli-toolkit.py -s xai -m grok-beta'
alias grok1='~/ai-cli-toolkit.py -s xai -m grok-1'

##### === AI CLI Help ===
alias ai-help='cat ~/AI-CLI-README.md'
alias ai-quick='cat ~/AI-CLI-Quick-Reference.md'

##### === API Key Setup ===
alias api-setup='~/api-key-setup.py --interactive'
alias api-list='~/api-key-setup.py --list'
alias api-keys='~/api-key-setup.py --list'
alias api-priority='~/priority-api-setup.py'
alias api-open='~/simple-api-setup.py'
alias api-select='~/api-selector.py'

##### === AI Configuration Manager ===
alias ai-config='~/ai-config.py'
alias config='~/ai-config.py'
alias config-simple='~/ai-config-simple.py'

##### === Deep Analysis Tools ===
alias deep-analyze='~/deep-analyzer.py'
alias ai-analyze='~/ai-deep-analyzer.py'
alias analyze='~/ai-deep-analyzer.py'
alias quick-analyze='~/quick-analyze.py'
alias qa='~/quick-analyze.py'



# bun completions
[ -s "/Users/steven/.bun/_bun" ] && source "/Users/steven/.bun/_bun"
export GROK_API_KEY="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"

# >>> conda initialize >>>
# !! Contents within this block are managed by 'conda init' !!
__conda_setup="$('/Users/steven/miniforge3/bin/conda' 'shell.zsh' 'hook' 2> /dev/null)"
if [ $? -eq 0 ]; then
    eval "$__conda_setup"
else
    if [ -f "/Users/steven/miniforge3/etc/profile.d/conda.sh" ]; then
        . "/Users/steven/miniforge3/etc/profile.d/conda.sh"
    else
        export PATH="/Users/steven/miniforge3/bin:$PATH"
    fi
fi
unset __conda_setup
# <<< conda initialize <<<

export OPENAI_API_KEY=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
export ANTHROPIC_API_KEY=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

##### === Basics & Aliases === #####
# Aliases for Python3 and Pip3 as defaults
alias pip='pip3'
alias python='python3'

##### === Oh-My-Zsh === #####
export ZSH="$HOME/.oh-my-zsh"
ZSH_THEME="adben"
plugins=(zsh-autosuggestions zsh-syntax-highlighting)
source "$ZSH/oh-my-zsh.sh"

##### === Homebrew Completions (Intel macOS) ===
if command -v brew &>/dev/null; then
  FPATH="$(brew --prefix)/share/zsh-completions:${FPATH}"
fi

##### === Environment Variable Loading === #####
# Load environment variables if .env file exists
if [[ -f "$HOME/.env" ]]; then
  set -o allexport
  source "$HOME/.env"
  set +o allexport
fi

##### === PATH Management === #####
typeset -U path

# Core user paths (user > brew > mamba > system)
path=(
  "$HOME/.local/bin"         # Local tools managed by pipx
  "$HOME/.bun/bin"           # Bun JavaScript runtime
  "$HOME/Documents/python"   # Personal Python scripts
  "/usr/local/bin"           # Homebrew managed binaries
  "$path[@]"                 # Include all inherited paths
)

# Remove legacy Python user-site paths
path=(${path:#$HOME/Library/Python/3.11/bin})
#path=(${path:#$HOME/Library/Python/3.9/bin})

##### === Helper Functions ===
function ua {
  for file_path in "$@"; do
    [[ -e "$file_path" ]] || { echo "Path does not exist: $file_path" >&2; return 1; }
  done
  local -r absolute_paths=("${(@f)$(realpath "$@")}")
  /usr/bin/osascript -l JavaScript -e 'function run(argv) { Application("com.runningwithcrayons.Alfred").action(argv) }' "${absolute_paths[@]}"
}

##### === iTerm2 Integration ===
test -e "${HOME}/.iterm2_shell_integration.zsh" && source "${HOME}/.iterm2_shell_integration.zsh"

##### === Zsh Quality of Life Settings ===
setopt autocd
setopt correct
setopt nocaseglob
setopt nocasematch
bindkey -v

##### === Bun / pipx / Go ===
export BUN_INSTALL="$HOME/.bun"
export GOPATH="$HOME/go"
export GOBIN="$GOPATH/bin"
export PATH="$PATH:$GOBIN"

##### === Mamba Initialization ===
export MAMBA_EXE='/Users/steven/miniforge3/bin/mamba'
export MAMBA_ROOT_PREFIX='/Users/steven/miniforge3'
__mamba_setup="$("$MAMBA_EXE" shell hook --shell zsh --root-prefix "$MAMBA_ROOT_PREFIX" 2> /dev/null)"
if [ $? -eq 0 ]; then
    eval "$__mamba_setup"
else
    alias mamba="$MAMBA_EXE"  # Fallback if mamba activate fails
fi
unset __mamba_setup

# nvm configuration
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # Load nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # Load nvm bash completion

##### === Final PATH Export === #####
export PATH
##### === Basics & Aliases === #####
# Aliases for Python3 and Pip3 as defaults
alias pip='python3 -m pip'
alias python='python3'


##### === Oh-My-Zsh === #####
export ZSH="$HOME/.oh-my-zsh"
ZSH_THEME="adben"
plugins=(zsh-autosuggestions zsh-syntax-highlighting)
source "$ZSH/oh-my-zsh.sh"

##### === Homebrew Completions (Intel macOS) ===
if command -v brew &>/dev/null; then
  FPATH="$(brew --prefix)/share/zsh-completions:${FPATH}"
fi

##### === OpenSSL Flags (guarded) ===
#if [[ -d /usr/local/opt/openssl ]]; then
#  path+=("/usr/local/opt/openssl/bin")
#  export LDFLAGS="-L/usr/local/opt/openssl/lib"
#  export CPPFLAGS="-I/usr/local/opt/openssl/include"
#fi

##### === Load .env (project/system vars) ===
if [[ -f "$HOME/.env" ]]; then
  set -o allexport
  source "$HOME/.env"
  set +o allexport
fi

##### === PATH Hygiene === #####
typeset -U path

# Core user paths (user > brew > conda > system)
path=(
  "$HOME/.local/bin"         # pipx & local tools
  "$HOME/.bun/bin"           # bun
  "$HOME/Documents/python"   # personal Python scripts
  "/usr/local/bin"           # Homebrew (Intel)
  "$path[@]"
)

# Remove legacy Python user-site paths
path=(${path:#$HOME/Library/Python/3.11/bin})
#path=(${path:#$HOME/Library/Python/3.9/bin})

##### === Optional Utilities ===
function ua {
  for file_path in "$@"; do
    [[ -e "$file_path" ]] || { echo "Path does not exist: $file_path" >&2; return 1; }
  done
  local -r absolute_paths=("${(@f)$(realpath "$@")}")
  /usr/bin/osascript -l JavaScript -e 'function run(argv) { Application("com.runningwithcrayons.Alfred").action(argv) }' "${absolute_paths[@]}"
}

##### === iTerm2 Integration ===
test -e "${HOME}/.iterm2_shell_integration.zsh" && source "${HOME}/.iterm2_shell_integration.zsh"

##### === Zsh QoL ===
setopt autocd
setopt correct
setopt nocaseglob
setopt nocasematch
bindkey -v

##### === Bun / pipx / Go ===
export BUN_INSTALL="$HOME/.bun"
export GOPATH="$HOME/go"
export GOBIN="$GOPATH/bin"
export PATH="$PATH:$GOBIN"

##### === Conda/Mamba Configuration === #####
# Don’t auto-activate base unless you want it always on
export CONDA_AUTO_ACTIVATE_BASE=true
# (Change to true if you prefer base active every shell)

# >>> conda initialize >>>
# !! Contents within this block are managed by 'conda init' !!
__conda_setup="$('/Users/steven/miniforge3/bin/conda' 'shell.zsh' 'hook' 2> /dev/null)"
if [ $? -eq 0 ]; then
    eval "$__conda_setup"
else
    if [ -f "/Users/steven/miniforge3/etc/profile.d/conda.sh" ]; then
        . "/Users/steven/miniforge3/etc/profile.d/conda.sh"
    else
        export PATH="/Users/steven/miniforge3/bin:$PATH"
    fi
fi
unset __conda_setup
# <<< conda initialize <<<

##### === Conda/Mamba Performance Tweaks ===
export CONDA_SOLVER=libmamba
export CONDA_CHANNEL_PRIORITY=strict
export CONDA_VERBOSITY=1
export MAMBA_NO_BANNER=1

##### === Helper Functions for Conda/Mamba ===
function ca() {
  if [[ -z "$1" ]]; then
    echo "Usage: ca <env_name>"
    echo "Available environments:"
    mamba env list | grep -v "^#" | awk '{print "  -", $1}'
  else
    conda activate "$1"
  fi
}

function mkcenv() {
  if [[ -z "$1" ]]; then
    echo "Usage: mkcenv <script.py> [--name custom_name]"
  else
    python "$HOME/Documents/python/auto_env_creator_mamba.py" "$@"
  fi
}

function cenvs() {
  echo "📦 Conda/Mamba Environments:"
  mamba env list
}

function cclean() {
  echo "🧹 Cleaning conda/mamba cache..."
  mamba clean --all -y
  echo "✅ Done!"
}

function cexport() {
  if [[ -z "$CONDA_DEFAULT_ENV" ]]; then
    echo "❌ No conda environment active"
  else
    local env_name="$CONDA_DEFAULT_ENV"
    local output="${env_name}_$(date +%Y%m%d).yml"
    mamba env export --no-builds > "$output"
    echo "✅ Exported to: $output"
  fi
}

##### === Final PATH Export === #####
export PATH

##### === Mamba Integration (fallback only) ===
# Prefer Conda’s shell hook; don’t double-eval
export MAMBA_EXE='/Users/steven/miniforge3/bin/mamba'
export MAMBA_ROOT_PREFIX='/Users/steven/miniforge3'
__mamba_setup="$("$MAMBA_EXE" shell hook --shell zsh --root-prefix "$MAMBA_ROOT_PREFIX" 2> /dev/null)"
if [ $? -ne 0 ]; then
    alias mamba="$MAMBA_EXE"  # fallback alias if hook fails
fi
unset __mamba_setup

##### === Basics & Aliases === #####
# Aliases for Python3 and Pip3 as defaults
alias pip='pip3'
alias python='python3'


##### === Oh-My-Zsh === #####
export ZSH="$HOME/.oh-my-zsh"
ZSH_THEME="adben"
plugins=(zsh-autosuggestions zsh-syntax-highlighting)
source "$ZSH/oh-my-zsh.sh"

##### === Homebrew Completions (Intel macOS) ===
if command -v brew &>/dev/null; then
  FPATH="$(brew --prefix)/share/zsh-completions:${FPATH}"
fi

##### === OpenSSL Flags (guarded) ===
#if [[ -d /usr/local/opt/openssl ]]; then
#  path+=("/usr/local/opt/openssl/bin")
#  export LDFLAGS="-L/usr/local/opt/openssl/lib"
#  export CPPFLAGS="-I/usr/local/opt/openssl/include"
#fi

##### === Load .env (project/system vars) ===
if [[ -f "$HOME/.env" ]]; then
  set -o allexport
  source "$HOME/.env"
  set +o allexport
fi

##### === PATH Hygiene === #####
typeset -U path

# Core user paths (user > brew > conda > system)
path=(
  "$HOME/.local/bin"         # pipx & local tools
  "$HOME/.bun/bin"           # bun
  "$HOME/Documents/python"   # personal Python scripts
  "/usr/local/bin"           # Homebrew (Intel)
  "$path[@]"
)

# Remove legacy Python user-site paths
path=(${path:#$HOME/Library/Python/3.11/bin})
#path=(${path:#$HOME/Library/Python/3.9/bin})

##### === Optional Utilities ===
function ua {
  for file_path in "$@"; do
    [[ -e "$file_path" ]] || { echo "Path does not exist: $file_path" >&2; return 1; }
  done
  local -r absolute_paths=("${(@f)$(realpath "$@")}")
  /usr/bin/osascript -l JavaScript -e 'function run(argv) { Application("com.runningwithcrayons.Alfred").action(argv) }' "${absolute_paths[@]}"
}

##### === iTerm2 Integration ===
test -e "${HOME}/.iterm2_shell_integration.zsh" && source "${HOME}/.iterm2_shell_integration.zsh"

##### === Zsh QoL ===
setopt autocd
setopt correct
setopt nocaseglob
setopt nocasematch
bindkey -v

##### === Bun / pipx / Go ===
export BUN_INSTALL="$HOME/.bun"
export GOPATH="$HOME/go"
export GOBIN="$GOPATH/bin"
export PATH="$PATH:$GOBIN"

##### === Conda/Mamba Configuration === #####
# Don’t auto-activate base unless you want it always on
export CONDA_AUTO_ACTIVATE_BASE=true
# (Change to true if you prefer base active every shell)

# >>> conda initialize >>>
# !! Contents within this block are managed by 'conda init' !!
__conda_setup="$('/Users/steven/miniforge3/bin/conda' 'shell.zsh' 'hook' 2> /dev/null)"
if [ $? -eq 0 ]; then
    eval "$__conda_setup"
else
    if [ -f "/Users/steven/miniforge3/etc/profile.d/conda.sh" ]; then
        . "/Users/steven/miniforge3/etc/profile.d/conda.sh"
    else
        export PATH="/Users/steven/miniforge3/bin:$PATH"
    fi
fi
unset __conda_setup
# <<< conda initialize <<<

##### === Conda/Mamba Performance Tweaks ===
export CONDA_SOLVER=libmamba
export CONDA_CHANNEL_PRIORITY=strict
export CONDA_VERBOSITY=1
export MAMBA_NO_BANNER=1

##### === Helper Functions for Conda/Mamba ===
function ca() {
  if [[ -z "$1" ]]; then
    echo "Usage: ca <env_name>"
    echo "Available environments:"
    mamba env list | grep -v "^#" | awk '{print "  -", $1}'
  else
    conda activate "$1"
  fi
}

function mkcenv() {
  if [[ -z "$1" ]]; then
    echo "Usage: mkcenv <script.py> [--name custom_name]"
  else
    python "$HOME/Documents/python/auto_env_creator_mamba.py" "$@"
  fi
}

function cenvs() {
  echo "📦 Conda/Mamba Environments:"
  mamba env list
}

function cclean() {
  echo "🧹 Cleaning conda/mamba cache..."
  mamba clean --all -y
  echo "✅ Done!"
}

function cexport() {
  if [[ -z "$CONDA_DEFAULT_ENV" ]]; then
    echo "❌ No conda environment active"
  else
    local env_name="$CONDA_DEFAULT_ENV"
    local output="${env_name}_$(date +%Y%m%d).yml"
    mamba env export --no-builds > "$output"
    echo "✅ Exported to: $output"
  fi
}

##### === Final PATH Export === #####
export PATH

##### === Mamba Integration (fallback only) ===
# Prefer Conda’s shell hook; don’t double-eval
export MAMBA_EXE='/Users/steven/miniforge3/bin/mamba'
export MAMBA_ROOT_PREFIX='/Users/steven/miniforge3'
__mamba_setup="$("$MAMBA_EXE" shell hook --shell zsh --root-prefix "$MAMBA_ROOT_PREFIX" 2> /dev/null)"
if [ $? -ne 0 ]; then
    alias mamba="$MAMBA_EXE"  # fallback alias if hook fails
fi
unset __mamba_setup

# Aliases for Python3 and Pip3 as defaults
alias pip='pip3'
alias python='python3'

# Path to Oh-My-Zsh installation
export ZSH="$HOME/.oh-my-zsh"

# Set the Zsh theme
ZSH_THEME="adben"

# Enable Zsh plugins for enhanced functionality
plugins=(
  zsh-autosuggestions
  zsh-syntax-highlighting
  zsh-autocomplete
)

# Load Oh-My-Zsh framework
source "$ZSH/oh-my-zsh.sh"

# Homebrew completions setup with fallback for errors
if command -v brew &>/dev/null; then
  FPATH="$(brew --prefix)/share/zsh-completions:$FPATH"
  autoload -Uz compinit
  compinit || echo "Warning: compinit failed, completions may not work."
else
  echo "Warning: Homebrew is not installed or not found in your PATH."
fi

# Securely load API keys from .env file
if [ -f "$HOME/.env" ]; then
  while IFS='=' read -r key value; do
    if [[ ! "$key" =~ ^[[:space:]]*# && -n "$key" ]]; then
      export "$key"="$value"
    fi
  done < "$HOME/.env"
else
  echo "Warning: .env file not found."
fi

# iTerm2 shell integration (if applicable)
if [ -e "${HOME}/.iterm2_shell_integration.zsh" ]; then
  source "${HOME}/.iterm2_shell_integration.zsh"
fi

# Add directories to $PATH without duplicates
typeset -U path
path+=(
  "$HOME/miniforge3/bin"
  "$HOME/Library/Python/3.11/bin"
  "/usr/local/bin"
)

# Conda initialization for Miniforge: activate only when needed
if [ -f "$HOME/miniforge3/etc/profile.d/conda.sh" ]; then
  source "$HOME/miniforge3/etc/profile.d/conda.sh"
  # Uncomment the line below to auto-activate the base environment
  # conda activate base
else
  export PATH="$HOME/miniforge3/bin:$PATH"
fi

# Zsh quality-of-life improvements
setopt autocd           # Automatically cd into directories
setopt correct          # Auto-correct spelling errors in commands
setopt nocaseglob       # Case-insensitive globbing
setopt nocasematch      # Case-insensitive matching in completions

# Load Zsh syntax highlighting for better command visibility
if [ -f "$(brew --prefix)/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh" ]; then
  source "$(brew --prefix)/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh"
else
  echo "Warning: Zsh syntax highlighting not found."
fi

# Enable colors and Vim keybindings for a better shell experience
autoload -U colors && colors
bindkey -v

# Miniforge-specific conda initialization (auto-managed by 'conda init')
# >>> conda initialize >>>
# !! Contents within this block are managed by 'conda init' !!
__conda_setup="$('/Users/steven/miniforge3/bin/conda' 'shell.zsh' 'hook' 2> /dev/null)"
if [ $? -eq 0 ]; then
  eval "$__conda_setup"
else
  if [ -f "/Users/steven/miniforge3/etc/profile.d/conda.sh" ]; then
    source "/Users/steven/miniforge3/etc/profile.d/conda.sh"
  else
    export PATH="/Users/steven/miniforge3/bin:$PATH"
  fi
fi
unset __conda_setup
# <<< conda initialize <<<
##### === Basics & Aliases === #####
# Only alias Python/pip when NOT inside a conda env
if [[ -z "$CONDA_PREFIX" ]]; then
  alias python='python3'
  alias pip='python3 -m pip'
fi
alias gs="gosearch"

# Add mamba alias (faster than conda)
if command -v mamba &>/dev/null; then
  alias c='mamba'  # quick shorthand for mamba commands
fi

##### === Oh-My-Zsh === #####
export ZSH="$HOME/.oh-my-zsh"
ZSH_THEME="adben"
plugins=(zsh-autosuggestions zsh-syntax-highlighting)
source "$ZSH/oh-my-zsh.sh"

##### === Homebrew Completions (Intel macOS) ===
if command -v brew &>/dev/null; then
  FPATH="$(brew --prefix)/share/zsh-completions:${FPATH}"
fi

##### === OpenSSL Flags (guarded) ===
if [[ -d /usr/local/opt/openssl ]]; then
  path+=("/usr/local/opt/openssl/bin")
  export LDFLAGS="-L/usr/local/opt/openssl/lib"
  export CPPFLAGS="-I/usr/local/opt/openssl/include"
fi

##### === Load .env (project/system vars) ===
if [[ -f "$HOME/.env" ]]; then
  set -o allexport
  source "$HOME/.env"
  set +o allexport
fi

##### === PATH Hygiene === #####
typeset -U path

# Core user paths (user > brew > conda > system)
path=(
  "$HOME/.local/bin"         # pipx & local tools
  "$HOME/.bun/bin"           # bun
  "$HOME/Documents/python"   # personal Python scripts
  "/usr/local/bin"           # Homebrew (Intel)
  "$path[@]"
)

# Remove legacy Python user-site paths
path=(${path:#$HOME/Library/Python/3.13/bin})
path=(${path:#$HOME/Library/Python/3.9/bin})

##### === Optional Utilities ===
function ua {
  for file_path in "$@"; do
    [[ -e "$file_path" ]] || { echo "Path does not exist: $file_path" >&2; return 1; }
  done
  local -r absolute_paths=("${(@f)$(realpath "$@")}")
  /usr/bin/osascript -l JavaScript -e 'function run(argv) { Application("com.runningwithcrayons.Alfred").action(argv) }' "${absolute_paths[@]}"
}

##### === iTerm2 Integration ===
test -e "${HOME}/.iterm2_shell_integration.zsh" && source "${HOME}/.iterm2_shell_integration.zsh"

##### === Zsh QoL ===
setopt autocd
setopt correct
setopt nocaseglob
setopt nocasematch
bindkey -v

##### === Bun / pipx / Go ===
export BUN_INSTALL="$HOME/.bun"
export GOPATH="$HOME/go"
export GOBIN="$GOPATH/bin"
export PATH="$PATH:$GOBIN"

##### === Conda/Mamba Configuration === #####
# Don’t auto-activate base unless you want it always on
export CONDA_AUTO_ACTIVATE_BASE=false
# (Change to true if you prefer base active every shell)

# >>> conda initialize >>>
# !! Contents within this block are managed by 'conda init' !!
__conda_setup="$('/Users/steven/miniforge3/bin/conda' 'shell.zsh' 'hook' 2> /dev/null)"
if [ $? -eq 0 ]; then
    eval "$__conda_setup"
else
    if [ -f "/Users/steven/miniforge3/etc/profile.d/conda.sh" ]; then
        . "/Users/steven/miniforge3/etc/profile.d/conda.sh"
    else
        export PATH="/Users/steven/miniforge3/bin:$PATH"
    fi
fi
unset __conda_setup
# <<< conda initialize <<<

##### === Conda/Mamba Performance Tweaks ===
export CONDA_SOLVER=libmamba
export CONDA_CHANNEL_PRIORITY=strict
export CONDA_VERBOSITY=1
export MAMBA_NO_BANNER=1

##### === Helper Functions for Conda/Mamba ===
function ca() {
  if [[ -z "$1" ]]; then
    echo "Usage: ca <env_name>"
    echo "Available environments:"
    mamba env list | grep -v "^#" | awk '{print "  -", $1}'
  else
    conda activate "$1"
  fi
}

function mkcenv() {
  if [[ -z "$1" ]]; then
    echo "Usage: mkcenv <script.py> [--name custom_name]"
  else
    python "$HOME/Documents/python/auto_env_creator_mamba.py" "$@"
  fi
}

function cenvs() {
  echo "📦 Conda/Mamba Environments:"
  mamba env list
}

function cclean() {
  echo "🧹 Cleaning conda/mamba cache..."
  mamba clean --all -y
  echo "✅ Done!"
}

function cexport() {
  if [[ -z "$CONDA_DEFAULT_ENV" ]]; then
    echo "❌ No conda environment active"
  else
    local env_name="$CONDA_DEFAULT_ENV"
    local output="${env_name}_$(date +%Y%m%d).yml"
    mamba env export --no-builds > "$output"
    echo "✅ Exported to: $output"
  fi
}

##### === Final PATH Export === #####
export PATH

##### === Mamba Integration (fallback only) ===
# Prefer Conda’s shell hook; don’t double-eval
export MAMBA_EXE='/Users/steven/miniforge3/bin/mamba'
export MAMBA_ROOT_PREFIX='/Users/steven/miniforge3'
__mamba_setup="$("$MAMBA_EXE" shell hook --shell zsh --root-prefix "$MAMBA_ROOT_PREFIX" 2> /dev/null)"
if [ $? -ne 0 ]; then
    alias mamba="$MAMBA_EXE"  # fallback alias if hook fails
fi
unset __mamba_setup

##### === Basics & Aliases === #####
# Only alias Python/pip when NOT inside a conda env
if [[ -z "$CONDA_PREFIX" ]]; then
  alias python='python3'
  alias pip='python3 -m pip'
fi
alias gs="gosearch"

# Add mamba alias (mamba is faster than conda!)
if command -v mamba &>/dev/null; then
  alias c='mamba'  # Quick alias for mamba commands
fi

##### === Oh-My-Zsh === #####
export ZSH="$HOME/.oh-my-zsh"
ZSH_THEME="adben"
plugins=(zsh-autosuggestions zsh-syntax-highlighting)
source "$ZSH/oh-my-zsh.sh"

##### === Homebrew Completions (Intel macOS) ===
# Oh-My-Zsh runs `compinit` already; don't run it twice.
if command -v brew &>/dev/null; then
  FPATH="$(brew --prefix)/share/zsh-completions:${FPATH}"
fi

##### === OpenSSL Flags (guarded) ===
# Only set if these paths exist, to avoid breaking compiles elsewhere
if [[ -d /usr/local/opt/openssl ]]; then
  path+=("/usr/local/opt/openssl/bin")
  export LDFLAGS="-L/usr/local/opt/openssl/lib"
  export CPPFLAGS="-I/usr/local/opt/openssl/include"
fi

##### === Load .env (project/system vars) ===
if [[ -f "$HOME/.env" ]]; then
  set -o allexport
  source "$HOME/.env"
  set +o allexport
fi

##### === PATH Hygiene === #####
# Deduplicate PATH via zsh's `path` array
typeset -U path

# Core user paths (order matters: user > brew > conda > system)
# NOTE: Conda's bin will be managed by conda init below
path=(
  "$HOME/.local/bin"         # pipx & local tools
  "$HOME/.bun/bin"           # bun
  "$HOME/Documents/python"   # Your Python scripts (moved up for priority)
  "/usr/local/bin"           # Homebrew (Intel)
  "$path[@]"                 # existing entries
)

# Remove legacy user-site Python versions to prevent shadowing
# Adjust version number if needed
path=(${path:#$HOME/Library/Python/3.13/bin})
path=(${path:#$HOME/Library/Python/3.9/bin})

##### === Optional: Utilities ===
# Alfred Universal Actions helper
function ua {
  for file_path in "$@"; do
    [[ -e "$file_path" ]] || { echo "Path does not exist: $file_path" >&2; return 1; }
  done
  local -r absolute_paths=("${(@f)$(realpath "$@")}")
  /usr/bin/osascript -l JavaScript -e 'function run(argv) { Application("com.runningwithcrayons.Alfred").action(argv) }' "${absolute_paths[@]}"
}

##### === iTerm2 Integration ===
test -e "${HOME}/.iterm2_shell_integration.zsh" && source "${HOME}/.iterm2_shell_integration.zsh"

##### === Zsh QoL ===
setopt autocd
setopt correct
setopt nocaseglob
setopt nocasematch
bindkey -v

##### === Bun ===
export BUN_INSTALL="$HOME/.bun"
# Already in path array above, but keeping for documentation

##### === pipx ===
# Already added above via ~/.local/bin

##### === Go ===
export GOPATH="$HOME/go"
export GOBIN="$GOPATH/bin"
export PATH="$PATH:$GOBIN"

##### === Conda/Mamba Configuration === #####
# Disable auto-activation of base environment (better workflow)
export CONDA_AUTO_ACTIVATE_BASE=false

# >>> conda initialize >>>
# !! Contents within this block are managed by 'conda init' !!
__conda_setup="$('/Users/steven/miniforge3/bin/conda' 'shell.zsh' 'hook' 2> /dev/null)"
if [ $? -eq 0 ]; then
    eval "$__conda_setup"
else
    if [ -f "/Users/steven/miniforge3/etc/profile.d/conda.sh" ]; then
        . "/Users/steven/miniforge3/etc/profile.d/conda.sh"
    else
        export PATH="/Users/steven/miniforge3/bin:$PATH"
    fi
fi
unset __conda_setup
# <<< conda initialize <<<

##### === Conda/Mamba Performance Optimizations === #####
# Use libmamba solver (faster dependency resolution)
export CONDA_SOLVER=libmamba

# Strict channel priority (faster, more reliable)
export CONDA_CHANNEL_PRIORITY=strict

# Reduce verbosity for cleaner output
export CONDA_VERBOSITY=1

##### === Helper Functions for Conda/Mamba === #####
# Quick environment activation
function ca() {
  if [[ -z "$1" ]]; then
    echo "Usage: ca <env_name>"
    echo "Available environments:"
    mamba env list | grep -v "^#" | awk '{print "  -", $1}'
  else
    conda activate "$1"
  fi
}

# Quick environment creation with auto-env-creator
function mkcenv() {
  if [[ -z "$1" ]]; then
    echo "Usage: mkcenv <script.py> [--name custom_name]"
  else
    python "$HOME/Documents/python/auto_env_creator_mamba.py" "$@"
  fi
}

# List all environments with sizes
function cenvs() {
  echo "📦 Conda/Mamba Environments:"
  mamba env list
}

# Clean conda/mamba cache
function cclean() {
  echo "🧹 Cleaning conda/mamba cache..."
  mamba clean --all -y
  echo "✅ Done!"
}

# Export current environment
function cexport() {
  if [[ -z "$CONDA_DEFAULT_ENV" ]]; then
    echo "❌ No conda environment active"
  else
    local env_name="$CONDA_DEFAULT_ENV"
    local output="${env_name}_$(date +%Y%m%d).yml"
    mamba env export --no-builds > "$output"
    echo "✅ Exported to: $output"
  fi
}

##### === Final PATH Export === #####
# Ensure PATH is properly exported (already handled by typeset -U above)
export PATH
# >>> mamba initialize >>>
# !! Contents within this block are managed by 'mamba shell init' !!
export MAMBA_EXE='/Users/steven/miniforge3/bin/mamba';
export MAMBA_ROOT_PREFIX='/Users/steven/miniforge3';
__mamba_setup="$("$MAMBA_EXE" shell hook --shell zsh --root-prefix "$MAMBA_ROOT_PREFIX" 2> /dev/null)"
if [ $? -eq 0 ]; then
    eval "$__mamba_setup"
else
    alias mamba="$MAMBA_EXE"  # Fallback on help from mamba activate
fi
unset __mamba_setup
# <<< mamba initialize <<<

##### === Basics & Aliases === #####
# Only alias Python/pip when NOT inside a conda env
if [[ -z "$CONDA_PREFIX" ]]; then
  alias python='python3'
  alias pip='python3 -m pip'
fi
alias gs="gosearch"

# Add mamba alias (mamba is faster than conda!)
if command -v mamba &>/dev/null; then
  alias c='mamba'  # Quick alias for mamba commands
fi

##### === Oh-My-Zsh === #####
export ZSH="$HOME/.oh-my-zsh"
ZSH_THEME="adben"
plugins=(zsh-autosuggestions zsh-syntax-highlighting)
source "$ZSH/oh-my-zsh.sh"

##### === Homebrew Completions (Intel macOS) ===
# Oh-My-Zsh runs `compinit` already; don't run it twice.
if command -v brew &>/dev/null; then
  FPATH="$(brew --prefix)/share/zsh-completions:${FPATH}"
fi

##### === OpenSSL Flags (guarded) ===
# Only set if these paths exist, to avoid breaking compiles elsewhere
if [[ -d /usr/local/opt/openssl ]]; then
  path+=("/usr/local/opt/openssl/bin")
  export LDFLAGS="-L/usr/local/opt/openssl/lib"
  export CPPFLAGS="-I/usr/local/opt/openssl/include"
fi

##### === Load .env (project/system vars) ===
if [[ -f "$HOME/.env" ]]; then
  set -o allexport
  source "$HOME/.env"
  set +o allexport
fi

##### === PATH Hygiene === #####
# Deduplicate PATH via zsh's `path` array
typeset -U path

# Core user paths (order matters: user > brew > conda > system)
# NOTE: Conda's bin will be managed by conda init below
path=(
  "$HOME/.local/bin"         # pipx & local tools
  "$HOME/.bun/bin"           # bun
  "$HOME/Documents/python"   # Your Python scripts (moved up for priority)
  "/usr/local/bin"           # Homebrew (Intel)
  "$path[@]"                 # existing entries
)

# Remove legacy user-site Python versions to prevent shadowing
# Adjust version number if needed
path=(${path:#$HOME/Library/Python/3.13/bin})
path=(${path:#$HOME/Library/Python/3.9/bin})

##### === Optional: Utilities ===
# Alfred Universal Actions helper
function ua {
  for file_path in "$@"; do
    [[ -e "$file_path" ]] || { echo "Path does not exist: $file_path" >&2; return 1; }
  done
  local -r absolute_paths=("${(@f)$(realpath "$@")}")
  /usr/bin/osascript -l JavaScript -e 'function run(argv) { Application("com.runningwithcrayons.Alfred").action(argv) }' "${absolute_paths[@]}"
}

##### === iTerm2 Integration ===
test -e "${HOME}/.iterm2_shell_integration.zsh" && source "${HOME}/.iterm2_shell_integration.zsh"

##### === Zsh QoL ===
setopt autocd
setopt correct
setopt nocaseglob
setopt nocasematch
bindkey -v

##### === Bun ===
export BUN_INSTALL="$HOME/.bun"
# Already in path array above, but keeping for documentation

##### === pipx ===
# Already added above via ~/.local/bin

##### === Go ===
export GOPATH="$HOME/go"
export GOBIN="$GOPATH/bin"
export PATH="$PATH:$GOBIN"

##### === Conda/Mamba Configuration === #####
# Disable auto-activation of base environment (better workflow)
export CONDA_AUTO_ACTIVATE_BASE=false

# >>> conda initialize >>>
# !! Contents within this block are managed by 'conda init' !!
__conda_setup="$('/Users/steven/miniforge3/bin/conda' 'shell.zsh' 'hook' 2> /dev/null)"
if [ $? -eq 0 ]; then
    eval "$__conda_setup"
else
    if [ -f "/Users/steven/miniforge3/etc/profile.d/conda.sh" ]; then
        . "/Users/steven/miniforge3/etc/profile.d/conda.sh"
    else
        export PATH="/Users/steven/miniforge3/bin:$PATH"
    fi
fi
unset __conda_setup

# Initialize mamba (if available)
if [ -f "/Users/steven/miniforge3/etc/profile.d/mamba.sh" ]; then
    . "/Users/steven/miniforge3/etc/profile.d/mamba.sh"
fi
# <<< conda initialize <<<

##### === Conda/Mamba Performance Optimizations === #####
# Use libmamba solver (faster dependency resolution)
export CONDA_SOLVER=libmamba

# Strict channel priority (faster, more reliable)
export CONDA_CHANNEL_PRIORITY=strict

# Reduce verbosity for cleaner output
export CONDA_VERBOSITY=1

##### === Helper Functions for Conda/Mamba === #####
# Quick environment activation
function ca() {
  if [[ -z "$1" ]]; then
    echo "Usage: ca <env_name>"
    echo "Available environments:"
    mamba env list | grep -v "^#" | awk '{print "  -", $1}'
  else
    conda activate "$1"
  fi
}

# Quick environment creation with auto-env-creator
function mkcenv() {
  if [[ -z "$1" ]]; then
    echo "Usage: mkcenv <script.py> [--name custom_name]"
  else
    python "$HOME/Documents/python/auto_env_creator_mamba.py" "$@"
  fi
}

# List all environments with sizes
function cenvs() {
  echo "📦 Conda/Mamba Environments:"
  mamba env list
}

# Clean conda/mamba cache
function cclean() {
  echo "🧹 Cleaning conda/mamba cache..."
  mamba clean --all -y
  echo "✅ Done!"
}

# Export current environment
function cexport() {
  if [[ -z "$CONDA_DEFAULT_ENV" ]]; then
    echo "❌ No conda environment active"
  else
    local env_name="$CONDA_DEFAULT_ENV"
    local output="${env_name}_$(date +%Y%m%d).yml"
    mamba env export --no-builds > "$output"
    echo "✅ Exported to: $output"
  fi
}

##### === Final PATH Export === #####
# Ensure PATH is properly exported (already handled by typeset -U above)
export PATH
##### === Basics & Aliases === #####
# Only alias Python/pip when NOT inside a conda env
if [[ -z "$CONDA_PREFIX" ]]; then
  alias python='python3'
  alias pip='python3 -m pip'
fi

alias gs="gosearch"

##### === Oh-My-Zsh === #####
export ZSH="$HOME/.oh-my-zsh"
ZSH_THEME="adben"
plugins=(zsh-autosuggestions zsh-syntax-highlighting)
source "$ZSH/oh-my-zsh.sh"

##### === Homebrew Completions (Intel macOS) ===
# Oh-My-Zsh runs `compinit` already; don't run it twice.
if command -v brew &>/dev/null; then
  FPATH="$(brew --prefix)/share/zsh-completions:${FPATH}"
fi

##### === OpenSSL Flags (guarded) ===
# Only set if these paths exist, to avoid breaking compiles elsewhere
if [[ -d /usr/local/opt/openssl ]]; then
  path+=("/usr/local/opt/openssl/bin")
  export LDFLAGS="-L/usr/local/opt/openssl/lib"
  export CPPFLAGS="-I/usr/local/opt/openssl/include"
fi

##### === Load .env (project/system vars) ===
if [[ -f "$HOME/.env" ]]; then
  set -o allexport
  source "$HOME/.env"
  set +o allexport
fi

##### === PATH Hygiene ===
# Deduplicate PATH via zsh's `path` array
typeset -U path

# Core user paths (order matters: user > brew > system)
path=(
  "$HOME/.local/bin"         # pipx & local tools
  "$HOME/.bun/bin"           # bun
  "/usr/local/bin"           # Homebrew (Intel)
  "$path[@]"                 # existing entries
)

# Remove legacy user-site Python 3.9 scripts to prevent shadowing
# (If you actually need them, comment this out)
path=(${path:#$HOME/Library/Python/3.13/bin})

##### === Optional: Utilities ===
# Alfred Universal Actions helper
function ua {
  for file_path in "$@"; do
    [[ -e "$file_path" ]] || { echo "Path does not exist: $file_path" >&2; return 1; }
  done
  local -r absolute_paths=("${(@f)$(realpath "$@")}")
  /usr/bin/osascript -l JavaScript -e 'function run(argv) { Application("com.runningwithcrayons.Alfred").action(argv) }' "${absolute_paths[@]}"
}

##### === iTerm2 Integration ===
test -e "${HOME}/.iterm2_shell_integration.zsh" && source "${HOME}/.iterm2_shell_integration.zsh"

##### === Zsh QoL ===
setopt autocd
setopt correct
setopt nocaseglob
setopt nocasematch
bindkey -v

##### === Bun ===
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"

##### === pipx (already added above via ~/.local/bin) ===
# Created by pipx: keep for documentation
export PATH="$PATH:$HOME/.local/bin"

##### === Go ===
export GOPATH="$HOME/go"
export GOBIN="$GOPATH/bin"
export PATH="$PATH:$GOBIN"

##### === Conda (managed by conda init) ===
# IMPORTANT:
# Do NOT manually add  here. Let `conda init zsh` insert its block below.
# Run once:   conda init zsh
# That will create a block like:
# >>> conda initialize >>>
# !! Contents within this block are managed by 'conda init' !!
__conda_setup="$('/Users/steven/miniforge3/bin/conda' 'shell.zsh' 'hook' 2> /dev/null)"
if [ $? -eq 0 ]; then
    eval "$__conda_setup"
else
    if [ -f "/Users/steven/miniforge3/etc/profile.d/conda.sh" ]; then
        . "/Users/steven/miniforge3/etc/profile.d/conda.sh"
    else
        export PATH="/Users/steven/miniforge3/bin:$PATH"
    fi
fi
unset __conda_setup
# <<< conda initialize <<<


export PATH="/Users/steven/Documents/python:$PATH"

##### === Basics & Aliases === #####
# Only alias Python/pip when NOT inside a conda env
if [[ -z "$CONDA_PREFIX" ]]; then
  alias python='python3'
  alias pip='python3 -m pip'
fi

alias gs="gosearch"

##### === Oh-My-Zsh === #####
export ZSH="$HOME/.oh-my-zsh"
ZSH_THEME="adben"
plugins=(zsh-autosuggestions zsh-syntax-highlighting)
source "$ZSH/oh-my-zsh.sh"

##### === Homebrew Completions (Intel macOS) ===
if command -v brew &>/dev/null; then
  FPATH="$(brew --prefix)/share/zsh-completions:${FPATH}"
fi
autoload -Uz compinit && compinit

##### === OpenSSL Flags (guarded) ===
if [[ -d /usr/local/opt/openssl ]]; then
  path+=("/usr/local/opt/openssl/bin")
  export LDFLAGS="${LDFLAGS:+$LDFLAGS }-L/usr/local/opt/openssl/lib"
  export CPPFLAGS="${CPPFLAGS:+$CPPFLAGS }-I/usr/local/opt/openssl/include"
fi

##### === Load .env (project/system vars) ===
if [[ -f "$HOME/.env" ]]; then
  set -o allexport
  source "$HOME/.env"
  set +o allexport
fi

##### === PATH Hygiene ===
typeset -U path
path=(
  "$HOME/.local/bin"
  "$HOME/.bun/bin"
  "/usr/local/bin"
  "$path[@]"
)

##### === Optional: Utilities ===
ua() {
  for file_path in "$@"; do
    [[ -e "$file_path" ]] || { echo "Path does not exist: $file_path" >&2; return 1; }
  done
  local -r absolute_paths=("${(@f)$(realpath "$@")}")
  /usr/bin/osascript -l JavaScript -e \
    'function run(argv) { Application("com.runningwithcrayons.Alfred").action(argv) }' \
    "${absolute_paths[@]}"
}

##### === iTerm2 Integration ===
[[ -e "${HOME}/.iterm2_shell_integration.zsh" ]] && source "${HOME}/.iterm2_shell_integration.zsh"

##### === Zsh QoL ===
setopt autocd
setopt correct
setopt nocaseglob
setopt nocasematch
bindkey -v

##### === Bun ===
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"

##### === pipx ===
export PATH="$PATH:$HOME/.local/bin"

##### === Go ===
export GOPATH="$HOME/go"
export GOBIN="$GOPATH/bin"
export PATH="$PATH:$GOBIN"

##### === Misc Tools ===
[ ! -f "$HOME/.x-cmd.root/X" ] || . "$HOME/.x-cmd.root/X"
export CHEAT_CONFIG_PATH="$HOME/.dotfiles/cheat/conf.yml"

##### === Python on Intel macOS (prefer Homebrew when not in conda) ===
export CONDA_AUTO_ACTIVATE_BASE=false

# Homebrew Intel Python 3.11 path
if [ -d "/usr/local/opt/python@3.11/bin" ]; then
  brew_py_bin="/usr/local/opt/python@3.11/bin"
else
  brew_py_bin="/usr/local/bin"
fi

if [[ -z "$CONDA_PREFIX" ]]; then
  export PATH="$brew_py_bin:/usr/local/bin:$PATH"
  alias python='python3'
  alias pip='python3 -m pip'
  alias python311="$brew_py_bin/python3.11"
  alias mkvenv='python311 -m venv'
fi

# Debug helpers
whopy()  { echo "python3 -> $(command -v python3)"; python3 -V; }
whopip() { echo "pip     -> $(command -v pip)"; pip -V; }

# Toggles
usebrewpy()  { export PATH="$brew_py_bin:/usr/local/bin:${PATH//:$HOME\/miniforge3\/bin/}"; hash -r; whopy; }
useconda()   { command -v conda >/dev/null && conda activate base || echo "conda not found"; whopy; }

##### === Conda Initialize (no auto-activate) ===
# Managed by `conda init`
__conda_setup="$('/Users/steven/miniforge3/bin/conda' 'shell.zsh' 'hook' 2> /dev/null)"
if [ $? -eq 0 ]; then
    eval "$__conda_setup"
else
    if [ -f "/Users/steven/miniforge3/etc/profile.d/conda.sh" ]; then
        . "/Users/steven/miniforge3/etc/profile.d/conda.sh"
    else
        export PATH="/Users/steven/miniforge3/bin:$PATH"
    fi
fi
unset __conda_setup

##### === Basics & Aliases === #####
# Only alias Python/pip when NOT inside a conda env
if [[ -z "$CONDA_PREFIX" ]]; then
  alias python='python3'
  alias pip='python3 -m pip'
fi

alias gs="gosearch"

##### === Oh-My-Zsh === #####
export ZSH="$HOME/.oh-my-zsh"
ZSH_THEME="adben"
plugins=(zsh-autosuggestions zsh-syntax-highlighting)
source "$ZSH/oh-my-zsh.sh"

##### === Homebrew Completions (Intel macOS) ===
if command -v brew &>/dev/null; then
  FPATH="$(brew --prefix)/share/zsh-completions:${FPATH}"
fi
autoload -Uz compinit && compinit

##### === OpenSSL Flags (guarded) ===
if [[ -d /usr/local/opt/openssl ]]; then
  path+=("/usr/local/opt/openssl/bin")
  export LDFLAGS="${LDFLAGS:+$LDFLAGS }-L/usr/local/opt/openssl/lib"
  export CPPFLAGS="${CPPFLAGS:+$CPPFLAGS }-I/usr/local/opt/openssl/include"
fi

##### === Load .env (project/system vars) ===
if [[ -f "$HOME/.env" ]]; then
  set -o allexport
  source "$HOME/.env"
  set +o allexport
fi

##### === PATH Hygiene ===
typeset -U path
path=(
  "$HOME/.local/bin"
  "$HOME/.bun/bin"
  "/usr/local/bin"
  "$path[@]"
)

##### === Optional: Utilities ===
ua() {
  for file_path in "$@"; do
    [[ -e "$file_path" ]] || { echo "Path does not exist: $file_path" >&2; return 1; }
  done
  local -r absolute_paths=("${(@f)$(realpath "$@")}")
  /usr/bin/osascript -l JavaScript -e \
    'function run(argv) { Application("com.runningwithcrayons.Alfred").action(argv) }' \
    "${absolute_paths[@]}"
}

##### === iTerm2 Integration ===
[[ -e "${HOME}/.iterm2_shell_integration.zsh" ]] && source "${HOME}/.iterm2_shell_integration.zsh"

##### === Zsh QoL ===
setopt autocd
setopt correct
setopt nocaseglob
setopt nocasematch
bindkey -v

##### === Bun ===
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"

##### === pipx ===
export PATH="$PATH:$HOME/.local/bin"

##### === Go ===
export GOPATH="$HOME/go"
export GOBIN="$GOPATH/bin"
export PATH="$PATH:$GOBIN"

##### === Misc Tools ===
[ ! -f "$HOME/.x-cmd.root/X" ] || . "$HOME/.x-cmd.root/X"
export CHEAT_CONFIG_PATH="$HOME/.dotfiles/cheat/conf.yml"

##### === Python on Intel macOS (prefer Homebrew when not in conda) ===
export CONDA_AUTO_ACTIVATE_BASE=false

# Homebrew Intel Python 3.11 location
if [ -d "/usr/local/opt/python@3.11/bin" ]; then
  brew_py_bin="/usr/local/opt/python@3.11/bin"
else
  brew_py_bin="/usr/local/bin"
fi

if [[ -z "$CONDA_PREFIX" ]]; then
  export PATH="$brew_py_bin:/usr/local/bin:$PATH"
  alias python='python3'
  alias pip='python3 -m pip'
  alias python311="$brew_py_bin/python3.11"
  alias mkvenv='python311 -m venv'
fi

# Debug helpers
whopy()  { echo "python3 -> $(command -v python3)"; python3 -V; }
whopip() { echo "pip     -> $(command -v pip)"; pip -V; }

# Optional toggles
usebrewpy()  { export PATH="$brew_py_bin:/usr/local/bin:${PATH//:$HOME\/miniforge3\/bin/}"; hash -r; whopy; }
useconda()   { command -v conda >/dev/null && conda activate base || echo "conda not found"; whopy; }

##### === Conda Initialize ===
# Managed by `conda init`
__conda_setup="$('/Users/steven/miniforge3/bin/conda' 'shell.zsh' 'hook' 2> /dev/null)"
if [ $? -eq 0 ]; then
    eval "$__conda_setup"
else
    if [ -f "/Users/steven/miniforge3/etc/profile.d/conda.sh" ]; then
        . "/Users/steven/miniforge3/etc/profile.d/conda.sh"
    else
        export PATH="/Users/steven/miniforge3/bin:$PATH"
    fi
fi
unset __conda_setup

##### === Basics & Aliases === #####
# Only alias Python/pip when NOT inside a conda env
if [[ -z "$CONDA_PREFIX" ]]; then
  alias python='python3'
  alias pip='python3 -m pip'
fi

alias gs="gosearch"

##### === Oh-My-Zsh === #####
export ZSH="$HOME/.oh-my-zsh"
ZSH_THEME="adben"
plugins=(zsh-autosuggestions zsh-syntax-highlighting)
source "$ZSH/oh-my-zsh.sh"

##### === Homebrew Completions (Intel macOS) ===
if command -v brew &>/dev/null; then
  FPATH="$(brew --prefix)/share/zsh-completions:${FPATH}"
fi

##### === OpenSSL Flags (guarded) ===
if [[ -d /usr/local/opt/openssl ]]; then
  path+=("/usr/local/opt/openssl/bin")
  export LDFLAGS="-L/usr/local/opt/openssl/lib"
  export CPPFLAGS="-I/usr/local/opt/openssl/include"
fi

##### === Load .env (project/system vars) ===
if [[ -f "$HOME/.env" ]]; then
  set -o allexport
  source "$HOME/.env"
  set +o allexport
fi

##### === PATH Hygiene ===
typeset -U path
path=(
  "$HOME/.local/bin"
  "$HOME/.bun/bin"
  "/usr/local/bin"
  "$path[@]"
)

##### === Optional: Utilities ===
ua() {
  for file_path in "$@"; do
    [[ -e "$file_path" ]] || { echo "Path does not exist: $file_path" >&2; return 1; }
  done
  local -r absolute_paths=("${(@f)$(realpath "$@")}")
  /usr/bin/osascript -l JavaScript -e \
    'function run(argv) { Application("com.runningwithcrayons.Alfred").action(argv) }' \
    "${absolute_paths[@]}"
}

##### === iTerm2 Integration ===
[[ -e "${HOME}/.iterm2_shell_integration.zsh" ]] && source "${HOME}/.iterm2_shell_integration.zsh"

##### === Zsh QoL ===
setopt autocd
setopt correct
setopt nocaseglob
setopt nocasematch
bindkey -v

##### === Bun ===
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"

##### === pipx ===
export PATH="$PATH:$HOME/.local/bin"

##### === Go ===
export GOPATH="$HOME/go"
export GOBIN="$GOPATH/bin"
export PATH="$PATH:$GOBIN"



##### === Misc Tools ===
[ ! -f "$HOME/.x-cmd.root/X" ] || . "$HOME/.x-cmd.root/X"
export CHEAT_CONFIG_PATH="$HOME/.dotfiles/cheat/conf.yml"


##### === Python on Intel macOS (prefer Homebrew when not in conda) ===
# Never auto-activate base in new shells
export CONDA_AUTO_ACTIVATE_BASE=false

# When not inside a conda env, put Homebrew Python 3.11 first on PATH
if [[ -z "$CONDA_PREFIX" ]]; then
  # Homebrew Intel lives in /usr/local (not /opt/homebrew)
  export PATH="/usr/local/opt/python@3.11/bin:/usr/local/bin:$PATH"
  alias python='python3'
  alias pip='python3 -m pip'
  alias python311='/usr/local/bin/python3.11'
  alias mkvenv='python311 -m venv'
fi

# Tiny debug helpers
whopy() { echo "python3 -> $(command -v python3)"; python3 -V; }
whopip() { echo "pip -> $(command -v pip)"; pip -V; }

##### === Force Auto-Activate Conda base ===
# Always drop into base when opening a new interactive shell
 if [[ -n "$PS1" ]]; then
  command -v conda >/dev/null 2>&1 && conda activate base
 fi

# >>> conda initialize >>>
# !! Contents within this block are managed by 'conda init' !!
__conda_setup="$('/Users/steven/miniforge3/bin/conda' 'shell.zsh' 'hook' 2> /dev/null)"
if [ $? -eq 0 ]; then
    eval "$__conda_setup"
else
    if [ -f "/Users/steven/miniforge3/etc/profile.d/conda.sh" ]; then
        . "/Users/steven/miniforge3/etc/profile.d/conda.sh"
    else
        export PATH="/Users/steven/miniforge3/bin:$PATH"
    fi
fi
unset __conda_setup
# <<< conda initialize <<<


##### === Basics & Aliases === #####
# Only alias Python/pip when NOT inside a conda env
if [[ -z "$CONDA_PREFIX" ]]; then
  alias python='python3'
  alias pip='python3 -m pip'
fi

alias gs="gosearch"

##### === Oh-My-Zsh === #####
export ZSH="$HOME/.oh-my-zsh"
ZSH_THEME="adben"
plugins=(zsh-autosuggestions zsh-syntax-highlighting)
source "$ZSH/oh-my-zsh.sh"

##### === Homebrew Completions (Intel macOS) ===
if command -v brew &>/dev/null; then
  FPATH="$(brew --prefix)/share/zsh-completions:${FPATH}"
fi

##### === OpenSSL Flags (guarded) ===
if [[ -d /usr/local/opt/openssl ]]; then
  path+=("/usr/local/opt/openssl/bin")
  export LDFLAGS="-L/usr/local/opt/openssl/lib"
  export CPPFLAGS="-I/usr/local/opt/openssl/include"
fi

##### === Load .env (project/system vars) ===
if [[ -f "$HOME/.env" ]]; then
  set -o allexport
  source "$HOME/.env"
  set +o allexport
fi

##### === PATH Hygiene ===
typeset -U path
path=(
  "$HOME/.local/bin"
  "$HOME/.bun/bin"
  "/usr/local/bin"
  "$path[@]"
)

##### === Optional: Utilities ===
ua() {
  for file_path in "$@"; do
    [[ -e "$file_path" ]] || { echo "Path does not exist: $file_path" >&2; return 1; }
  done
  local -r absolute_paths=("${(@f)$(realpath "$@")}")
  /usr/bin/osascript -l JavaScript -e \
    'function run(argv) { Application("com.runningwithcrayons.Alfred").action(argv) }' \
    "${absolute_paths[@]}"
}

##### === iTerm2 Integration ===
[[ -e "${HOME}/.iterm2_shell_integration.zsh" ]] && source "${HOME}/.iterm2_shell_integration.zsh"

##### === Zsh QoL ===
setopt autocd
setopt correct
setopt nocaseglob
setopt nocasematch
bindkey -v

##### === Bun ===
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"

##### === pipx ===
export PATH="$PATH:$HOME/.local/bin"

##### === Go ===
export GOPATH="$HOME/go"
export GOBIN="$GOPATH/bin"
export PATH="$PATH:$GOBIN"



##### === Misc Tools ===
[ ! -f "$HOME/.x-cmd.root/X" ] || . "$HOME/.x-cmd.root/X"
export CHEAT_CONFIG_PATH="$HOME/.dotfiles/cheat/conf.yml"

##### === Force Auto-Activate Conda base ===
# Always drop into base when opening a new interactive shell
# if [[ -n "$PS1" ]]; then
#  command -v conda >/dev/null 2>&1 && conda activate base
# fi
# >>> conda initialize >>>
# !! Contents within this block are managed by 'conda init' !!
__conda_setup="$('/Users/steven/miniforge3/bin/conda' 'shell.zsh' 'hook' 2> /dev/null)"
if [ $? -eq 0 ]; then
    eval "$__conda_setup"
else
    if [ -f "/Users/steven/miniforge3/etc/profile.d/conda.sh" ]; then
        . "/Users/steven/miniforge3/etc/profile.d/conda.sh"
    else
        export PATH="/Users/steven/miniforge3/bin:$PATH"
    fi
fi
unset __conda_setup
# <<< conda initialize <<<


##### === Basics & Aliases === #####
# Only alias Python/pip when NOT inside a conda env
if [[ -z "$CONDA_PREFIX" ]]; then
  alias python='python3'
  alias pip='python3 -m pip'
fi

alias gs="gosearch"

##### === Oh-My-Zsh === #####
export ZSH="$HOME/.oh-my-zsh"
ZSH_THEME="adben"
plugins=(zsh-autosuggestions zsh-syntax-highlighting)
source "$ZSH/oh-my-zsh.sh"

##### === Homebrew Completions (Intel macOS) ===
if command -v brew &>/dev/null; then
  FPATH="$(brew --prefix)/share/zsh-completions:${FPATH}"
fi

##### === OpenSSL Flags (guarded) ===
if [[ -d /usr/local/opt/openssl ]]; then
  path+=("/usr/local/opt/openssl/bin")
  export LDFLAGS="-L/usr/local/opt/openssl/lib"
  export CPPFLAGS="-I/usr/local/opt/openssl/include"
fi

##### === Load .env (project/system vars) ===
if [[ -f "$HOME/.env" ]]; then
  set -o allexport
  source "$HOME/.env"
  set +o allexport
fi

##### === PATH Hygiene ===
typeset -U path
path=(
  "$HOME/.local/bin"
  "$HOME/.bun/bin"
  "/usr/local/bin"
  "$path[@]"
)

##### === Optional: Utilities ===
ua() {
  for file_path in "$@"; do
    [[ -e "$file_path" ]] || { echo "Path does not exist: $file_path" >&2; return 1; }
  done
  local -r absolute_paths=("${(@f)$(realpath "$@")}")
  /usr/bin/osascript -l JavaScript -e \
    'function run(argv) { Application("com.runningwithcrayons.Alfred").action(argv) }' \
    "${absolute_paths[@]}"
}

##### === iTerm2 Integration ===
[[ -e "${HOME}/.iterm2_shell_integration.zsh" ]] && source "${HOME}/.iterm2_shell_integration.zsh"

##### === Zsh QoL ===
setopt autocd
setopt correct
setopt nocaseglob
setopt nocasematch
bindkey -v

##### === Bun ===
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"

##### === pipx ===
export PATH="$PATH:$HOME/.local/bin"

##### === Go ===
export GOPATH="$HOME/go"
export GOBIN="$GOPATH/bin"
export PATH="$PATH:$GOBIN"



##### === Misc Tools ===
[ ! -f "$HOME/.x-cmd.root/X" ] || . "$HOME/.x-cmd.root/X"
export CHEAT_CONFIG_PATH="$HOME/.dotfiles/cheat/conf.yml"

##### === Force Auto-Activate Conda base ===
# Always drop into base when opening a new interactive shell
if [[ -n "$PS1" ]]; then
  command -v conda >/dev/null 2>&1 && conda activate base
fi
# >>> conda initialize >>>
# !! Contents within this block are managed by 'conda init' !!
__conda_setup="$('/Users/steven/miniforge3/bin/conda' 'shell.zsh' 'hook' 2> /dev/null)"
if [ $? -eq 0 ]; then
    eval "$__conda_setup"
else
    if [ -f "/Users/steven/miniforge3/etc/profile.d/conda.sh" ]; then
        . "/Users/steven/miniforge3/etc/profile.d/conda.sh"
    else
        export PATH="/Users/steven/miniforge3/bin:$PATH"
    fi
fi
unset __conda_setup
# <<< conda initialize <<<


##### === Basics & Aliases === #####
# Only alias Python/pip when NOT inside a conda env
if [[ -z "$CONDA_PREFIX" ]]; then
  alias python='python3'
  alias pip='python3 -m pip'
fi

alias gs="gosearch"

##### === Oh-My-Zsh === #####
export ZSH="$HOME/.oh-my-zsh"
ZSH_THEME="adben"
plugins=(zsh-autosuggestions zsh-syntax-highlighting)
source "$ZSH/oh-my-zsh.sh"

##### === Homebrew Completions (Intel macOS) ===
if command -v brew &>/dev/null; then
  FPATH="$(brew --prefix)/share/zsh-completions:${FPATH}"
fi

##### === OpenSSL Flags (guarded) ===
if [[ -d /usr/local/opt/openssl ]]; then
  path+=("/usr/local/opt/openssl/bin")
  export LDFLAGS="-L/usr/local/opt/openssl/lib"
  export CPPFLAGS="-I/usr/local/opt/openssl/include"
fi

##### === Load .env (project/system vars) ===
if [[ -f "$HOME/.env" ]]; then
  set -o allexport
  source "$HOME/.env"
  set +o allexport
fi

##### === PATH Hygiene ===
typeset -U path
path=(
  "$HOME/.local/bin"
  "$HOME/.bun/bin"
  "/usr/local/bin"
  "$path[@]"
)
path=(${path:#$HOME/Library/Python/3.9/bin})

##### === Optional: Utilities ===
ua() {
  for file_path in "$@"; do
    [[ -e "$file_path" ]] || { echo "Path does not exist: $file_path" >&2; return 1; }
  done
  local -r absolute_paths=("${(@f)$(realpath "$@")}")
  /usr/bin/osascript -l JavaScript -e \
    'function run(argv) { Application("com.runningwithcrayons.Alfred").action(argv) }' \
    "${absolute_paths[@]}"
}

##### === iTerm2 Integration ===
[[ -e "${HOME}/.iterm2_shell_integration.zsh" ]] && source "${HOME}/.iterm2_shell_integration.zsh"

##### === Zsh QoL ===
setopt autocd
setopt correct
setopt nocaseglob
setopt nocasematch
bindkey -v

##### === Bun ===
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"

##### === pipx ===
export PATH="$PATH:$HOME/.local/bin"

##### === Go ===
export GOPATH="$HOME/go"
export GOBIN="$GOPATH/bin"
export PATH="$PATH:$GOBIN"

##### === Conda (managed by conda init) ===
__conda_setup="$('/Users/steven/miniconda3/bin/conda' 'shell.zsh' 'hook' 2> /dev/null)"
if [ $? -eq 0 ]; then
    eval "$__conda_setup"
else
    if [ -f "/Users/steven/miniconda3/etc/profile.d/conda.sh" ]; then
        . "/Users/steven/miniconda3/etc/profile.d/conda.sh"
    else
        export PATH="/Users/steven/miniconda3/bin:$PATH"
    fi
fi
unset __conda_setup
# <<< conda initialize <<<

##### === Misc Tools ===
[ ! -f "$HOME/.x-cmd.root/X" ] || . "$HOME/.x-cmd.root/X"
export CHEAT_CONFIG_PATH="$HOME/.dotfiles/cheat/conf.yml"

##### === Force Auto-Activate Conda base ===
# Always drop into base when opening a new shell
if [[ -n "$PS1" ]]; then
  conda activate base
fi

##### === Basics & Aliases === #####
# Only alias Python/pip when NOT inside a conda env
if [[ -z "$CONDA_PREFIX" ]]; then
  alias python='python3'
  alias pip='python3 -m pip'
fi

alias gs="gosearch"

##### === Oh-My-Zsh === #####
export ZSH="$HOME/.oh-my-zsh"
ZSH_THEME="adben"
plugins=(zsh-autosuggestions zsh-syntax-highlighting)
source "$ZSH/oh-my-zsh.sh"

##### === Homebrew Completions (Intel macOS) ===
# Oh-My-Zsh runs `compinit` already; don't run it twice.
if command -v brew &>/dev/null; then
  FPATH="$(brew --prefix)/share/zsh-completions:${FPATH}"
fi

##### === OpenSSL Flags (guarded) ===
if [[ -d /usr/local/opt/openssl ]]; then
  path+=("/usr/local/opt/openssl/bin")
  export LDFLAGS="-L/usr/local/opt/openssl/lib"
  export CPPFLAGS="-I/usr/local/opt/openssl/include"
fi

##### === Load .env (project/system vars) ===
if [[ -f "$HOME/.env" ]]; then
  set -o allexport
  source "$HOME/.env"
  set +o allexport
fi

##### === PATH Hygiene ===
# Deduplicate PATH via zsh's `path` array
typeset -U path

# Core user paths (order matters: user > brew > system)
path=(
  "$HOME/.local/bin"         # pipx & local tools
  "$HOME/.bun/bin"           # bun
  "/usr/local/bin"           # Homebrew (Intel)
  "$path[@]"                 # existing entries
)

# Remove legacy user-site Python 3.9 scripts to prevent shadowing
path=(${path:#$HOME/Library/Python/3.9/bin})

##### === Optional: Utilities ===
# Alfred Universal Actions helper
ua() {
  for file_path in "$@"; do
    [[ -e "$file_path" ]] || { echo "Path does not exist: $file_path" >&2; return 1; }
  done
  local -r absolute_paths=("${(@f)$(realpath "$@")}")
  /usr/bin/osascript -l JavaScript -e \
    'function run(argv) { Application("com.runningwithcrayons.Alfred").action(argv) }' \
    "${absolute_paths[@]}"
}

##### === iTerm2 Integration ===
[[ -e "${HOME}/.iterm2_shell_integration.zsh" ]] && source "${HOME}/.iterm2_shell_integration.zsh"

##### === Zsh QoL ===
setopt autocd
setopt correct
setopt nocaseglob
setopt nocasematch
bindkey -v

##### === Bun ===
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"

##### === pipx ===
export PATH="$PATH:$HOME/.local/bin"

##### === Go ===
export GOPATH="$HOME/go"
export GOBIN="$GOPATH/bin"
export PATH="$PATH:$GOBIN"

##### === Conda (managed by conda init) ===
# Do not edit manually — run `conda init zsh` to refresh
__conda_setup="$('/Users/steven/miniconda3/bin/conda' 'shell.zsh' 'hook' 2> /dev/null)"
if [ $? -eq 0 ]; then
    eval "$__conda_setup"
else
    if [ -f "/Users/steven/miniconda3/etc/profile.d/conda.sh" ]; then
        . "/Users/steven/miniconda3/etc/profile.d/conda.sh"
    else
        export PATH="/Users/steven/miniconda3/bin:$PATH"
    fi
fi
unset __conda_setup
# <<< conda initialize <<<

##### === Misc Tools ===
[ ! -f "$HOME/.x-cmd.root/X" ] || . "$HOME/.x-cmd.root/X"  # boot up x-cmd
export CHEAT_CONFIG_PATH="$HOME/.dotfiles/cheat/conf.yml"

##### === Auto-activate base Conda env (optional) ===
# Uncomment to force base env on new shells
#if [[ -z "$CONDA_DEFAULT_ENV" && -n "$PS1" ]]; then
#  conda activate base
#fi

##### === Basics & Aliases === #####
# Only alias Python/pip when NOT inside a conda env
if [[ -z "$CONDA_PREFIX" ]]; then
  alias python='python3'
  alias pip='python3 -m pip'
fi

alias gs="gosearch"

##### === Oh-My-Zsh === #####
export ZSH="$HOME/.oh-my-zsh"
ZSH_THEME="adben"
plugins=(zsh-autosuggestions zsh-syntax-highlighting)
source "$ZSH/oh-my-zsh.sh"

##### === Homebrew Completions (Intel macOS) ===
# Oh-My-Zsh runs `compinit` already; don't run it twice.
if command -v brew &>/dev/null; then
  FPATH="$(brew --prefix)/share/zsh-completions:${FPATH}"
fi

##### === OpenSSL Flags (guarded) ===
# Only set if these paths exist, to avoid breaking compiles elsewhere
if [[ -d /usr/local/opt/openssl ]]; then
  path+=("/usr/local/opt/openssl/bin")
  export LDFLAGS="-L/usr/local/opt/openssl/lib"
  export CPPFLAGS="-I/usr/local/opt/openssl/include"
fi

##### === Load .env (project/system vars) ===
if [[ -f "$HOME/.env" ]]; then
  set -o allexport
  source "$HOME/.env"
  set +o allexport
fi

##### === PATH Hygiene ===
# Deduplicate PATH via zsh's `path` array
typeset -U path

# Core user paths (order matters: user > brew > system)
path=(
  "$HOME/.local/bin"         # pipx & local tools
  "$HOME/.bun/bin"           # bun
  "/usr/local/bin"           # Homebrew (Intel)
  "$path[@]"                 # existing entries
)

# Remove legacy user-site Python 3.9 scripts to prevent shadowing
# (If you actually need them, comment this out)
path=(${path:#$HOME/Library/Python/3.9/bin})

##### === Optional: Utilities ===
# Alfred Universal Actions helper
function ua {
  for file_path in "$@"; do
    [[ -e "$file_path" ]] || { echo "Path does not exist: $file_path" >&2; return 1; }
  done
  local -r absolute_paths=("${(@f)$(realpath "$@")}")
  /usr/bin/osascript -l JavaScript -e 'function run(argv) { Application("com.runningwithcrayons.Alfred").action(argv) }' "${absolute_paths[@]}"
}

##### === iTerm2 Integration ===
test -e "${HOME}/.iterm2_shell_integration.zsh" && source "${HOME}/.iterm2_shell_integration.zsh"

##### === Zsh QoL ===
setopt autocd
setopt correct
setopt nocaseglob
setopt nocasematch
bindkey -v

##### === Bun ===
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"

##### === pipx (already added above via ~/.local/bin) ===
# Created by pipx: keep for documentation
export PATH="$PATH:$HOME/.local/bin"

##### === Go ===
export GOPATH="$HOME/go"
export GOBIN="$GOPATH/bin"
export PATH="$PATH:$GOBIN"

##### === Conda (managed by conda init) ===
# IMPORTANT:
# Do NOT manually add  here. Let `conda init zsh` insert its block below.
# Run once:   conda init zsh
# That will create a block like:
# >>> conda initialize >>>
# !! Contents within this block are managed by 'conda init' !!
__conda_setup="$('/Users/steven/miniconda3/bin/conda' 'shell.zsh' 'hook' 2> /dev/null)"
if [ $? -eq 0 ]; then
    eval "$__conda_setup"
else
    if [ -f "/Users/steven/miniconda3/etc/profile.d/conda.sh" ]; then
        . "/Users/steven/miniconda3/etc/profile.d/conda.sh"
    else
        export PATH="/Users/steven/miniconda3/bin:$PATH"
    fi
fi
unset __conda_setup
# <<< conda initialize <<<

[ ! -f "$HOME/.x-cmd.root/X" ] || . "$HOME/.x-cmd.root/X" # boot up x-cmd.
export CHEAT_CONFIG_PATH="~/.dotfiles/cheat/conf.yml"w

##### === Basics & Aliases === #####
# Only alias Python/pip when NOT inside a conda env
if [[ -z "$CONDA_PREFIX" ]]; then
  alias python='python3'
  alias pip='python3 -m pip'
fi

alias gs="gosearch"

##### === Oh-My-Zsh === #####
export ZSH="$HOME/.oh-my-zsh"
ZSH_THEME="adben"
plugins=(zsh-autosuggestions zsh-syntax-highlighting)
source "$ZSH/oh-my-zsh.sh"

##### === Homebrew Completions (Intel macOS) ===
# Oh-My-Zsh runs `compinit` already; don't run it twice.
if command -v brew &>/dev/null; then
  FPATH="$(brew --prefix)/share/zsh-completions:${FPATH}"
fi

##### === OpenSSL Flags (guarded) ===
# Only set if these paths exist, to avoid breaking compiles elsewhere
if [[ -d /usr/local/opt/openssl ]]; then
  path+=("/usr/local/opt/openssl/bin")
  export LDFLAGS="-L/usr/local/opt/openssl/lib"
  export CPPFLAGS="-I/usr/local/opt/openssl/include"
fi

##### === Load .env (project/system vars) ===
if [[ -f "$HOME/.env" ]]; then
  set -o allexport
  source "$HOME/.env"
  set +o allexport
fi

##### === PATH Hygiene ===
# Deduplicate PATH via zsh's `path` array
typeset -U path

# Core user paths (order matters: user > brew > system)
path=(
  "$HOME/.local/bin"         # pipx & local tools
  "$HOME/.bun/bin"           # bun
  "/usr/local/bin"           # Homebrew (Intel)
  "$path[@]"                 # existing entries
)

# Remove legacy user-site Python 3.9 scripts to prevent shadowing
# (If you actually need them, comment this out)
path=(${path:#$HOME/Library/Python/3.9/bin})

##### === Optional: Utilities ===
# Alfred Universal Actions helper
function ua {
  for file_path in "$@"; do
    [[ -e "$file_path" ]] || { echo "Path does not exist: $file_path" >&2; return 1; }
  done
  local -r absolute_paths=("${(@f)$(realpath "$@")}")
  /usr/bin/osascript -l JavaScript -e 'function run(argv) { Application("com.runningwithcrayons.Alfred").action(argv) }' "${absolute_paths[@]}"
}

##### === iTerm2 Integration ===
test -e "${HOME}/.iterm2_shell_integration.zsh" && source "${HOME}/.iterm2_shell_integration.zsh"

##### === Zsh QoL ===
setopt autocd
setopt correct
setopt nocaseglob
setopt nocasematch
bindkey -v

##### === Bun ===
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"

##### === pipx (already added above via ~/.local/bin) ===
# Created by pipx: keep for documentation
export PATH="$PATH:$HOME/.local/bin"

##### === Go ===
export GOPATH="$HOME/go"
export GOBIN="$GOPATH/bin"
export PATH="$PATH:$GOBIN"

##### === Conda (managed by conda init) ===
# IMPORTANT:
# Do NOT manually add  here. Let `conda init zsh` insert its block below.
# Run once:   conda init zsh
# That will create a block like:
# >>> conda initialize >>>
# !! Contents within this block are managed by 'conda init' !!
__conda_setup="$('/Users/steven/miniforge3/bin/conda' 'shell.zsh' 'hook' 2> /dev/null)"
if [ $? -eq 0 ]; then
    eval "$__conda_setup"
else
    if [ -f "/Users/steven/miniforge3/etc/profile.d/conda.sh" ]; then
        . "/Users/steven/miniforge3/etc/profile.d/conda.sh"
    else
        export PATH="/Users/steven/miniforge3/bin:$PATH"
    fi
fi
unset __conda_setup
# <<< conda initialize <<<

[ ! -f "$HOME/.x-cmd.root/X" ] || . "$HOME/.x-cmd.root/X" # boot up x-cmd.
export CHEAT_CONFIG_PATH="~/.dotfiles/cheat/conf.yml"w

##### === Basics & Aliases === #####
# Only alias Python/pip when NOT inside a conda env
if [[ -z "$CONDA_PREFIX" ]]; then
  alias python='python3'
  alias pip='python3 -m pip'
fi

alias gs="gosearch"

##### === Oh-My-Zsh === #####
export ZSH="$HOME/.oh-my-zsh"
ZSH_THEME="adben"
plugins=(zsh-autosuggestions zsh-syntax-highlighting)
source "$ZSH/oh-my-zsh.sh"

##### === Homebrew Completions (Intel macOS) ===
# Oh-My-Zsh runs `compinit` already; don't run it twice.
if command -v brew &>/dev/null; then
  FPATH="$(brew --prefix)/share/zsh-completions:${FPATH}"
fi

##### === OpenSSL Flags (guarded) ===
# Only set if these paths exist, to avoid breaking compiles elsewhere
if [[ -d /usr/local/opt/openssl ]]; then
  path+=("/usr/local/opt/openssl/bin")
  export LDFLAGS="-L/usr/local/opt/openssl/lib"
  export CPPFLAGS="-I/usr/local/opt/openssl/include"
fi

##### === Load .env (project/system vars) ===
if [[ -f "$HOME/.env" ]]; then
  set -o allexport
  source "$HOME/.env"
  set +o allexport
fi

##### === PATH Hygiene ===
# Deduplicate PATH via zsh's `path` array
typeset -U path

# Core user paths (order matters: user > brew > system)
path=(
  "$HOME/.local/bin"         # pipx & local tools
  "$HOME/.bun/bin"           # bun
  "/usr/local/bin"           # Homebrew (Intel)
  "$path[@]"                 # existing entries
)

# Remove legacy user-site Python 3.9 scripts to prevent shadowing
# (If you actually need them, comment this out)
path=(${path:#$HOME/Library/Python/3.9/bin})

##### === Optional: Utilities ===
# Alfred Universal Actions helper
function ua {
  for file_path in "$@"; do
    [[ -e "$file_path" ]] || { echo "Path does not exist: $file_path" >&2; return 1; }
  done
  local -r absolute_paths=("${(@f)$(realpath "$@")}")
  /usr/bin/osascript -l JavaScript -e 'function run(argv) { Application("com.runningwithcrayons.Alfred").action(argv) }' "${absolute_paths[@]}"
}

##### === iTerm2 Integration ===
test -e "${HOME}/.iterm2_shell_integration.zsh" && source "${HOME}/.iterm2_shell_integration.zsh"

##### === Zsh QoL ===
setopt autocd
setopt correct
setopt nocaseglob
setopt nocasematch
bindkey -v

##### === Bun ===
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"

##### === pipx (already added above via ~/.local/bin) ===
# Created by pipx: keep for documentation
export PATH="$PATH:$HOME/.local/bin"

##### === Go ===
export GOPATH="$HOME/go"
export GOBIN="$GOPATH/bin"
export PATH="$PATH:$GOBIN"

##### === Conda (managed by conda init) ===
# IMPORTANT:
# Do NOT manually add "$HOME/miniconda3/bin" here. Let `conda init zsh` insert its block below.
# Run once:   conda init zsh
# That will create a block like:
# >>> conda initialize >>>
# ... (auto-generated by conda) ...
# <<< conda initialize <<<

# === Aliases (Remove if Python 3 is already the default) ===
alias pip='pip3'
alias python='python3'
alias gs="gosearch"

# === Oh-My-Zsh Configuration ===
export ZSH="$HOME/.oh-my-zsh"

ZSH_THEME="adben"
plugins=(zsh-autosuggestions zsh-syntax-highlighting)
source "$ZSH/oh-my-zsh.sh"

# === Homebrew Completions ===
if command -v brew &>/dev/null; then
    FPATH=$(brew --prefix)/share/zsh-completions:$FPATH
    compinit -C
fi


# === OpenSSL Configuration ===
path+=("/usr/local/opt/openssl/bin")
export LDFLAGS="-L/usr/local/opt/openssl/lib"
export CPPFLAGS="-I/usr/local/opt/openssl/include"

# === Load Environment Variables from .env file ===
if [ -f "$HOME/.env" ]; then
    set -o allexport
    source "$HOME/.env"
    set +o allexport
fi

# === Add Paths to $PATH without Duplicates ===
typeset -U path
path+=(
    "$HOME/miniconda3/bin"
    "$HOME/Library/Python/3.9/bin"
    "/usr/local/bin"
)

function ua {
  # Verify all paths are valid
  for file_path in "${@}"
  do
    if [[ ! -e "${file_path}" ]]
    then
      echo "Path does not exist: ${file_path}" >&2
      return 1
    fi
  done

  # Expand arguments into full paths
  local -r absolute_paths=("${(@f)$(realpath "${@}")}")

  # Open Universal Actions
  /usr/bin/osascript -l JavaScript -e 'function run(argv) { Application("com.runningwithcrayons.Alfred").action(argv) }' "${absolute_paths[@]}"
}

# === iTerm2 Integration ===
test -e "${HOME}/.iterm2_shell_integration.zsh" && source "${HOME}/.iterm2_shell_integration.zsh"

# === Zsh Quality of Life Improvements ===
setopt autocd                # Automatically 'cd' into directories
setopt correct               # Auto-correct spelling errors in commands
setopt nocaseglob            # Case-insensitive globbing
setopt nocasematch           # Case-insensitive matching in completions

# === Key Bindings ===
bindkey -v

#export PATH=$PATH:/Users/steven/.spicetify



#export NVM_DIR="$HOME/.nvm"
#[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
#[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm #bash_completion


#export PYENV_ROOT="$HOME/.pyenv"
#[[ -d $PYENV_ROOT/bin ]] && export PATH="$PYENV_ROOT/bin:$PATH"
#eval "$(pyenv init - zsh)"

# bun completions
[ -s "/Users/steven/.oh-my-zsh/completions/_bun" ] && source "/Users/steven/.oh-my-zsh/completions/_bun"

# bun
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"

[ ! -f "$HOME/.x-cmd.root/X" ] || . "$HOME/.x-cmd.root/X" # boot up x-cmd.

# Created by `pipx` on 2025-06-04 16:02:53
export PATH="$PATH:/Users/steven/.local/bin"



# Go environment setup
export GOPATH="$HOME/go"
export GOBIN="$GOPATH/bin"
export PATH="$PATH:$GOBIN"


# === Aliases (Remove if Python 3 is already the default) ===
alias pip='pip3'
alias python='python3'
alias gs="gosearch"

# === Oh-My-Zsh Configuration ===
export ZSH="$HOME/.oh-my-zsh"

ZSH_THEME="adben"
plugins=(zsh-autosuggestions zsh-syntax-highlighting)
source "$ZSH/oh-my-zsh.sh"

# === Homebrew Completions ===
if command -v brew &>/dev/null; then
    FPATH=$(brew --prefix)/share/zsh-completions:$FPATH
    compinit -C
fi


# === OpenSSL Configuration ===
path+=("/usr/local/opt/openssl/bin")
export LDFLAGS="-L/usr/local/opt/openssl/lib"
export CPPFLAGS="-I/usr/local/opt/openssl/include"

# === Load Environment Variables from .env file ===
if [ -f "$HOME/.env" ]; then
    set -o allexport
    source "$HOME/.env"
    set +o allexport
fi

# === Add Paths to $PATH without Duplicates ===
typeset -U path
path+=(
    "$HOME/miniconda3/bin"
    "$HOME/Library/Python/3.9/bin"
    "/usr/local/bin"
)

function ua {
  # Verify all paths are valid
  for file_path in "${@}"
  do
    if [[ ! -e "${file_path}" ]]
    then
      echo "Path does not exist: ${file_path}" >&2
      return 1
    fi
  done

  # Expand arguments into full paths
  local -r absolute_paths=("${(@f)$(realpath "${@}")}")

  # Open Universal Actions
  /usr/bin/osascript -l JavaScript -e 'function run(argv) { Application("com.runningwithcrayons.Alfred").action(argv) }' "${absolute_paths[@]}"
}

# === iTerm2 Integration ===
test -e "${HOME}/.iterm2_shell_integration.zsh" && source "${HOME}/.iterm2_shell_integration.zsh"

# === Zsh Quality of Life Improvements ===
setopt autocd                # Automatically 'cd' into directories
setopt correct               # Auto-correct spelling errors in commands
setopt nocaseglob            # Case-insensitive globbing
setopt nocasematch           # Case-insensitive matching in completions

# === Key Bindings ===
bindkey -v

#export PATH=$PATH:/Users/steven/.spicetify



#export NVM_DIR="$HOME/.nvm"
#[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
#[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm #bash_completion


#export PYENV_ROOT="$HOME/.pyenv"
#[[ -d $PYENV_ROOT/bin ]] && export PATH="$PYENV_ROOT/bin:$PATH"
#eval "$(pyenv init - zsh)"

# bun completions
[ -s "/Users/steven/.oh-my-zsh/completions/_bun" ] && source "/Users/steven/.oh-my-zsh/completions/_bun"

# bun
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"

[ ! -f "$HOME/.x-cmd.root/X" ] || . "$HOME/.x-cmd.root/X" # boot up x-cmd.

# Created by `pipx` on 2025-06-04 16:02:53
export PATH="$PATH:/Users/steven/.local/bin"

# >>> conda initialize >>>
# !! Contents within this block are managed by 'conda init' !!
__conda_setup="$('/Users/steven/miniconda3/bin/conda' 'shell.zsh' 'hook' 2> /dev/null)"
if [ $? -eq 0 ]; then
    eval "$__conda_setup"
else
    if [ -f "/Users/steven/miniconda3/etc/profile.d/conda.sh" ]; then
        . "/Users/steven/miniconda3/etc/profile.d/conda.sh"
    else
        export PATH="/Users/steven/miniconda3/bin:$PATH"
    fi
fi
unset __conda_setup
# <<< conda initialize <<<

# Go environment setup
export GOPATH="$HOME/go"
export GOBIN="$GOPATH/bin"
export PATH="$PATH:$GOBIN"


git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions

# If you come from bash you might have to change your $PATH.
# export PATH=$HOME/bin:$HOME/.local/bin:/usr/local/bin:$PATH

# Path to your Oh My Zsh installation.
export ZSH="$HOME/.oh-my-zsh"

# Set name of the theme to load --- if set to "random", it will
# load a random theme each time Oh My Zsh is loaded, in which case,
# to know which specific one was loaded, run: echo $RANDOM_THEME
# See https://github.com/ohmyzsh/ohmyzsh/wiki/Themes
ZSH_THEME="robbyrussell"

# Set list of themes to pick from when loading at random
# Setting this variable when ZSH_THEME=random will cause zsh to load
# a theme from this variable instead of looking in $ZSH/themes/
# If set to an empty array, this variable will have no effect.
# ZSH_THEME_RANDOM_CANDIDATES=( "robbyrussell" "agnoster" )

# Uncomment the following line to use case-sensitive completion.
# CASE_SENSITIVE="true"

# Uncomment the following line to use hyphen-insensitive completion.
# Case-sensitive completion must be off. _ and - will be interchangeable.
# HYPHEN_INSENSITIVE="true"

# Uncomment one of the following lines to change the auto-update behavior
# zstyle ':omz:update' mode disabled  # disable automatic updates
# zstyle ':omz:update' mode auto      # update automatically without asking
# zstyle ':omz:update' mode reminder  # just remind me to update when it's time

# Uncomment the following line to change how often to auto-update (in days).
# zstyle ':omz:update' frequency 13

# Uncomment the following line if pasting URLs and other text is messed up.
# DISABLE_MAGIC_FUNCTIONS="true"

# Uncomment the following line to disable colors in ls.
# DISABLE_LS_COLORS="true"

# Uncomment the following line to disable auto-setting terminal title.
# DISABLE_AUTO_TITLE="true"

# Uncomment the following line to enable command auto-correction.
# ENABLE_CORRECTION="true"

# Uncomment the following line to display red dots whilst waiting for completion.
# You can also set it to another string to have that shown instead of the default red dots.
# e.g. COMPLETION_WAITING_DOTS="%F{yellow}waiting...%f"
# Caution: this setting can cause issues with multiline prompts in zsh < 5.7.1 (see #5765)
# COMPLETION_WAITING_DOTS="true"

# Uncomment the following line if you want to disable marking untracked files
# under VCS as dirty. This makes repository status check for large repositories
# much, much faster.
# DISABLE_UNTRACKED_FILES_DIRTY="true"

# Uncomment the following line if you want to change the command execution time
# stamp shown in the history command output.
# You can set one of the optional three formats:
# "mm/dd/yyyy"|"dd.mm.yyyy"|"yyyy-mm-dd"
# or set a custom format using the strftime function format specifications,
# see 'man strftime' for details.
# HIST_STAMPS="mm/dd/yyyy"

# Would you like to use another custom folder than $ZSH/custom?
# ZSH_CUSTOM=/path/to/new-custom-folder

# Which plugins would you like to load?
# Standard plugins can be found in $ZSH/plugins/
# Custom plugins may be added to $ZSH_CUSTOM/plugins/
# Example format: plugins=(rails git textmate ruby lighthouse)
# Add wisely, as too many plugins slow down shell startup.
plugins=(git)

source $ZSH/oh-my-zsh.sh

# User configuration

# export MANPATH="/usr/local/man:$MANPATH"

# You may need to manually set your language environment
# export LANG=en_US.UTF-8

# Preferred editor for local and remote sessions
# if [[ -n $SSH_CONNECTION ]]; then
#   export EDITOR='vim'
# else
#   export EDITOR='nvim'
# fi

# Compilation flags
# export ARCHFLAGS="-arch $(uname -m)"

# Set personal aliases, overriding those provided by Oh My Zsh libs,
# plugins, and themes. Aliases can be placed here, though Oh My Zsh
# users are encouraged to define aliases within a top-level file in
# the $ZSH_CUSTOM folder, with .zsh extension. Examples:
# - $ZSH_CUSTOM/aliases.zsh
# - $ZSH_CUSTOM/macos.zsh
# For a full list of active aliases, run `alias`.
#
# Example aliases
# alias zshconfig="mate ~/.zshrc"
# alias ohmyzsh="mate ~/.oh-my-zsh"

plugins=( 
    git
    zsh-autosuggestions
    zsh-syntax-highlighting
)

# >>> conda initialize >>>
# !! Contents within this block are managed by 'conda init' !!
__conda_setup="$('/Users/steven/miniconda3/bin/conda' 'shell.zsh' 'hook' 2> /dev/null)"
if [ $? -eq 0 ]; then
    eval "$__conda_setup"
else
    if [ -f "/Users/steven/miniconda3/etc/profile.d/conda.sh" ]; then
        . "/Users/steven/miniconda3/etc/profile.d/conda.sh"
    else
        export PATH="/Users/steven/miniconda3/bin:$PATH"
    fi
fi
unset __conda_setup
# <<< conda initialize <<<

export PATH="/usr/local/bin:$PATH"


# Install zsh-autosuggestions plugin
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions

# Install zsh-syntax-highlighting plugin
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting

\# === Aliases (Remove if Python 3 is already the default) ===
alias pip='pip3'
alias python='python3'

# === Oh-My-Zsh Configuration ===
export ZSH="$HOME/.oh-my-zsh"
ZSH_THEME="adben"
plugins=(zsh-autosuggestions zsh-syntax-highlighting)
source "$ZSH/oh-my-zsh.sh"

# === Homebrew Completions ===
if command -v brew &>/dev/null; then
  FPATH=$(brew --prefix)/share/zsh-completions:$FPATH
  compinit -C
fi

# === OpenSSL Configuration ===
path+=("/usr/local/opt/openssl/bin")
export LDFLAGS="-L/usr/local/opt/openssl/lib"
export CPPFLAGS="-I/usr/local/opt/openssl/include"

# === Load Environment Variables from .env file ===
if [ -f "$HOME/.env" ]; then
  set -o allexport
  source "$HOME/.env"
  set +o allexport
fi

# === Add Paths to $PATH without Duplicates ===
typeset -U path
path+=(
  "$HOME/miniconda3/bin"
  "$HOME/Library/Python/3.9/bin"
  "/usr/local/bin"
)



# === iTerm2 Integration ===
test -e "${HOME}/.iterm2_shell_integration.zsh" && source "${HOME}/.iterm2_shell_integration.zsh"

# === Zsh Quality of Life Improvements ===
setopt autocd        # Automatically 'cd' into directories
setopt correct        # Auto-correct spelling errors in commands
setopt nocaseglob      # Case-insensitive globbing
setopt nocasematch      # Case-insensitive matching in completions

# === Key Bindings ===
bindkey -v

export PATH=$PATH:/Users/steven/.spicetify




# >>> conda initialize >>>
# !! Contents within this block are managed by 'conda init' !!
__conda_setup="$('/Users/steven/miniconda3/bin/conda' 'shell.zsh' 'hook' 2> /dev/null)"
if [ $? -eq 0 ]; then
  eval "$__conda_setup"
else
  if [ -f "/Users/steven/miniconda3/etc/profile.d/conda.sh" ]; then
    . "/Users/steven/miniconda3/etc/profile.d/conda.sh"
  else
    export PATH="/Users/steven/miniconda3/bin:$PATH"
  fi
fi
unset __conda_setup
# <<< conda initialize <<<



# The next line updates PATH for the Google Cloud SDK.
if [ -f '/Users/steven/Downloads/Compressed/google-cloud-sdk/path.zsh.inc' ]; then . '/Users/steven/Downloads/Compressed/google-cloud-sdk/path.zsh.inc'; fi

# The next line enables shell command completion for gcloud.
if [ -f '/Users/steven/Downloads/Compressed/google-cloud-sdk/completion.zsh.inc' ]; then . '/Users/steven/Downloads/Compressed/google-cloud-sdk/completion.zsh.inc'; fi

# === Aliases (Remove if Python 3 is already the default) ===
alias pip='pip3'
alias python='python3'

# === Oh-My-Zsh Configuration ===
export ZSH="$HOME/.oh-my-zsh"
ZSH_THEME="adben"
plugins=(zsh-autosuggestions zsh-syntax-highlighting)
source "$ZSH/oh-my-zsh.sh"

# === Homebrew Completions ===
if command -v brew &>/dev/null; then
  FPATH=$(brew --prefix)/share/zsh-completions:$FPATH
  compinit -C
fi

# === OpenSSL Configuration ===
path+=("/usr/local/opt/openssl/bin")
export LDFLAGS="-L/usr/local/opt/openssl/lib"
export CPPFLAGS="-I/usr/local/opt/openssl/include"

# === Load Environment Variables from .env file ===
if [ -f "$HOME/.env" ]; then
  set -o allexport
  source "$HOME/.env"
  set +o allexport
fi

# === Add Paths to $PATH without Duplicates ===
typeset -U path
path+=(
  "$HOME/miniconda3/bin"
  "$HOME/Library/Python/3.9/bin"
  "/usr/local/bin"
)



# === iTerm2 Integration ===
test -e "${HOME}/.iterm2_shell_integration.zsh" && source "${HOME}/.iterm2_shell_integration.zsh"

# === Zsh Quality of Life Improvements ===
setopt autocd        # Automatically 'cd' into directories
setopt correct        # Auto-correct spelling errors in commands
setopt nocaseglob      # Case-insensitive globbing
setopt nocasematch      # Case-insensitive matching in completions

# === Key Bindings ===
bindkey -v

export PATH=$PATH:/Users/steven/.spicetify




# >>> conda initialize >>>
# !! Contents within this block are managed by 'conda init' !!
__conda_setup="$('/Users/steven/miniconda3/bin/conda' 'shell.zsh' 'hook' 2> /dev/null)"
if [ $? -eq 0 ]; then
  eval "$__conda_setup"
else
  if [ -f "/Users/steven/miniconda3/etc/profile.d/conda.sh" ]; then
    . "/Users/steven/miniconda3/etc/profile.d/conda.sh"
  else
    export PATH="/Users/steven/miniconda3/bin:$PATH"
  fi
fi
unset __conda_setup
# <<< conda initialize <<<
# === Aliases (Remove if Python 3 is already the default) ===
alias pip='pip3'
alias python='python3'

# === Oh-My-Zsh Configuration ===
export ZSH="$HOME/.oh-my-zsh"
ZSH_THEME="adben"
plugins=(zsh-autosuggestions zsh-syntax-highlighting)
source "$ZSH/oh-my-zsh.sh"

# === Homebrew Completions ===
if command -v brew &>/dev/null; then
    FPATH=$(brew --prefix)/share/zsh-completions:$FPATH
    compinit -C
fi

# === OpenSSL Configuration ===
path+=("/usr/local/opt/openssl/bin")
export LDFLAGS="-L/usr/local/opt/openssl/lib"
export CPPFLAGS="-I/usr/local/opt/openssl/include"

# === Load Environment Variables from .env file ===
if [ -f "$HOME/.env" ]; then
    set -o allexport
    source "$HOME/.env"
    set +o allexport
fi

# === Add Paths to $PATH without Duplicates ===
typeset -U path
path+=(
    "$HOME/miniconda3/bin"
    "$HOME/Library/Python/3.9/bin"
    "/usr/local/bin"
)



# === iTerm2 Integration ===
test -e "${HOME}/.iterm2_shell_integration.zsh" && source "${HOME}/.iterm2_shell_integration.zsh"

# === Zsh Quality of Life Improvements ===
setopt autocd                # Automatically 'cd' into directories
setopt correct               # Auto-correct spelling errors in commands
setopt nocaseglob            # Case-insensitive globbing
setopt nocasematch           # Case-insensitive matching in completions

# === Key Bindings ===
bindkey -v

export PATH=$PATH:/Users/steven/.spicetify




# >>> conda initialize >>>
# !! Contents within this block are managed by 'conda init' !!
__conda_setup="$('/Users/steven/miniconda3/bin/conda' 'shell.zsh' 'hook' 2> /dev/null)"
if [ $? -eq 0 ]; then
    eval "$__conda_setup"
else
    if [ -f "/Users/steven/miniconda3/etc/profile.d/conda.sh" ]; then
        . "/Users/steven/miniconda3/etc/profile.d/conda.sh"
    else
        export PATH="/Users/steven/miniconda3/bin:$PATH"
    fi
fi
unset __conda_setup
# <<< conda initialize <<<



# The next line updates PATH for the Google Cloud SDK.
if [ -f '/Users/steven/Downloads/Compressed/google-cloud-sdk/path.zsh.inc' ]; then . '/Users/steven/Downloads/Compressed/google-cloud-sdk/path.zsh.inc'; fi

# The next line enables shell command completion for gcloud.
if [ -f '/Users/steven/Downloads/Compressed/google-cloud-sdk/completion.zsh.inc' ]; then . '/Users/steven/Downloads/Compressed/google-cloud-sdk/completion.zsh.inc'; fi

# === Aliases (Remove if Python 3 is already the default) ===
alias pip='pip3'
alias python='python3'

# === Oh-My-Zsh Configuration ===
export ZSH="$HOME/.oh-my-zsh"
ZSH_THEME="adben"
plugins=(zsh-autosuggestions zsh-syntax-highlighting)
source "$ZSH/oh-my-zsh.sh"

# === Homebrew Completions ===
if command -v brew &>/dev/null; then
    FPATH=$(brew --prefix)/share/zsh-completions:$FPATH
    compinit -C
fi

# === OpenSSL Configuration ===
path+=("/usr/local/opt/openssl/bin")
export LDFLAGS="-L/usr/local/opt/openssl/lib"
export CPPFLAGS="-I/usr/local/opt/openssl/include"

# === Load Environment Variables from .env file ===
if [ -f "$HOME/.env" ]; then
    set -o allexport
    source "$HOME/.env"
    set +o allexport
fi

# === Add Paths to $PATH without Duplicates ===
typeset -U path
path+=(
    "$HOME/miniconda3/bin"
    "$HOME/Library/Python/3.9/bin"
    "/usr/local/bin"
)



# === iTerm2 Integration ===
test -e "${HOME}/.iterm2_shell_integration.zsh" && source "${HOME}/.iterm2_shell_integration.zsh"

# === Zsh Quality of Life Improvements ===
setopt autocd                # Automatically 'cd' into directories
setopt correct               # Auto-correct spelling errors in commands
setopt nocaseglob            # Case-insensitive globbing
setopt nocasematch           # Case-insensitive matching in completions

# === Key Bindings ===
bindkey -v

export PATH=$PATH:/Users/steven/.spicetify




# >>> conda initialize >>>
# !! Contents within this block are managed by 'conda init' !!
__conda_setup="$('/Users/steven/miniconda3/bin/conda' 'shell.zsh' 'hook' 2> /dev/null)"
if [ $? -eq 0 ]; then
    eval "$__conda_setup"
else
    if [ -f "/Users/steven/miniconda3/etc/profile.d/conda.sh" ]; then
        . "/Users/steven/miniconda3/etc/profile.d/conda.sh"
    else
        export PATH="/Users/steven/miniconda3/bin:$PATH"
    fi
fi
unset __conda_setup
# <<< conda initialize <<<


git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting

rm -r /Users/steven/.oh-my-zsh
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

# If you come from bash you might have to change your $PATH.
# export PATH=$HOME/bin:$HOME/.local/bin:/usr/local/bin:$PATH

# Path to your Oh My Zsh installation.
export ZSH="$HOME/.oh-my-zsh"

# Set name of the theme to load --- if set to "random", it will
# load a random theme each time Oh My Zsh is loaded, in which case,
# to know which specific one was loaded, run: echo $RANDOM_THEME
# See https://github.com/ohmyzsh/ohmyzsh/wiki/Themes
ZSH_THEME="robbyrussell"

# Set list of themes to pick from when loading at random
# Setting this variable when ZSH_THEME=random will cause zsh to load
# a theme from this variable instead of looking in $ZSH/themes/
# If set to an empty array, this variable will have no effect.
# ZSH_THEME_RANDOM_CANDIDATES=( "robbyrussell" "agnoster" )

# Uncomment the following line to use case-sensitive completion.
# CASE_SENSITIVE="true"

# Uncomment the following line to use hyphen-insensitive completion.
# Case-sensitive completion must be off. _ and - will be interchangeable.
# HYPHEN_INSENSITIVE="true"

# Uncomment one of the following lines to change the auto-update behavior
# zstyle ':omz:update' mode disabled  # disable automatic updates
# zstyle ':omz:update' mode auto      # update automatically without asking
# zstyle ':omz:update' mode reminder  # just remind me to update when it's time

# Uncomment the following line to change how often to auto-update (in days).
# zstyle ':omz:update' frequency 13

# Uncomment the following line if pasting URLs and other text is messed up.
# DISABLE_MAGIC_FUNCTIONS="true"

# Uncomment the following line to disable colors in ls.
# DISABLE_LS_COLORS="true"

# Uncomment the following line to disable auto-setting terminal title.
# DISABLE_AUTO_TITLE="true"

# Uncomment the following line to enable command auto-correction.
# ENABLE_CORRECTION="true"

# Uncomment the following line to display red dots whilst waiting for completion.
# You can also set it to another string to have that shown instead of the default red dots.
# e.g. COMPLETION_WAITING_DOTS="%F{yellow}waiting...%f"
# Caution: this setting can cause issues with multiline prompts in zsh < 5.7.1 (see #5765)
# COMPLETION_WAITING_DOTS="true"

# Uncomment the following line if you want to disable marking untracked files
# under VCS as dirty. This makes repository status check for large repositories
# much, much faster.
# DISABLE_UNTRACKED_FILES_DIRTY="true"

# Uncomment the following line if you want to change the command execution time
# stamp shown in the history command output.
# You can set one of the optional three formats:
# "mm/dd/yyyy"|"dd.mm.yyyy"|"yyyy-mm-dd"
# or set a custom format using the strftime function format specifications,
# see 'man strftime' for details.
# HIST_STAMPS="mm/dd/yyyy"

# Would you like to use another custom folder than $ZSH/custom?
# ZSH_CUSTOM=/path/to/new-custom-folder

# Which plugins would you like to load?
# Standard plugins can be found in $ZSH/plugins/
# Custom plugins may be added to $ZSH_CUSTOM/plugins/
# Example format: plugins=(rails git textmate ruby lighthouse)
# Add wisely, as too many plugins slow down shell startup.
plugins=(git)

source $ZSH/oh-my-zsh.sh

# User configuration

# export MANPATH="/usr/local/man:$MANPATH"

# You may need to manually set your language environment
# export LANG=en_US.UTF-8

# Preferred editor for local and remote sessions
# if [[ -n $SSH_CONNECTION ]]; then
#   export EDITOR='vim'
# else
#   export EDITOR='nvim'
# fi

# Compilation flags
# export ARCHFLAGS="-arch $(uname -m)"

# Set personal aliases, overriding those provided by Oh My Zsh libs,
# plugins, and themes. Aliases can be placed here, though Oh My Zsh
# users are encouraged to define aliases within a top-level file in
# the $ZSH_CUSTOM folder, with .zsh extension. Examples:
# - $ZSH_CUSTOM/aliases.zsh
# - $ZSH_CUSTOM/macos.zsh
# For a full list of active aliases, run `alias`.
#
# Example aliases
# alias zshconfig="mate ~/.zshrc"
# alias ohmyzsh="mate ~/.oh-my-zsh"

sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"