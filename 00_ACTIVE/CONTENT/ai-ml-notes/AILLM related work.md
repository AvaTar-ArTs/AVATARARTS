# AI/LLM related work 

x-cmd is committed to introducing AI/LLM capabilities in the simplest way to improve user productivity.

## Local models complement each other with models from various manufacturers, each with its own strengths 

1. We have consistently encapsulated various LLM service CLIs in a way that users can seamlessly interact with `@gpt` `@gpt4` `@gpt` `@gemini` `@o` (ollama) in conjunction with the current shell environment (variables, files) and communicate with LLM.
2. We believe that local LLM can protect privacy and complement cloud LLM;  our solution is to build a seamless interaction between local LLM and  cloud LLM, each with its own strengths.
3. On the local model service, we focus on supporting [ollama](https://ollama.ai); based on practical experience, we have enhanced `ls` (view local downloaded models), `la` (view available model list), `run`, `pull`; in addition, based on the ollama api, we have also encapsulated an  interface consistent with the openai, gemini, mistral, moonshot modules.

Here is a demonstration of the interaction between gemini, ollama, and gpt-4o to complete tasks.

## AI application modules 

1. [co module -- copilot](https://x-cmd.com/mod/co): x-cmd enhances all traditional commands that can be enhanced by LLM, we will add prompts to reduce LLM illusions, and the ultimate goal is to  make it possible to generate commands correctly in most scenarios under  models such as llama 3 8B and the like according to the user's natural  language.
2. The results of all command lines can be piped to the LLM CLI that implements the chat interface -- @o ([ollama](https://www.x-cmd.com/mod/ollama)), @gpt ([openai](https://www.x-cmd.com/mod/openai), gpt3.5), @gpt4 ([openai](https://www.x-cmd.com/mod/openai) gpt4), @gemini ([gemini](https://www.x-cmd.com/mod/gemini)) -- or generate text according to user prompts, or start a chat to discuss the results.
3. x-cmd will fully leverage the capabilities of LLM to provide some LLM  application modules such as translation ( tran ), writing ([writer](https://www.x-cmd.com/mod/writer)), local image-to-text ( llava ), local audio-to-text ([whisper](https://www.x-cmd.com/mod/whisper)), etc.

Under development, stay tuned:

1. Each field can be tailored, thanks to the nature of x-cmd's shell easy  bonding and expansion, we will use the x-cmd module mechanism to extend  the functionality of traditional commands with LLM Agent technology.
2. x-cmd will leverage its 500+ opensource pkg to inject more action into LLM.

Here is a demonstration of co and tran.

## Related [AI/LLM modules](https://www.x-cmd.com/mod/llmf) 

* API Client:
  * [openai](https://www.x-cmd.com/mod/openai): OpenAI Webservice client
  * [gemini](https://www.x-cmd.com/mod/gemini): Gemini Webservice client
  * [mistral](https://www.x-cmd.com/mod/mistral): Mistral Webservice client
  * [moonshot](https://www.x-cmd.com/mod/moonshot): Moonshot Webservice client
  * [jina](https://www.x-cmd.com/mod/jina): Jina Webservice client
* Local model and application modules:
  * [ollama](https://www.x-cmd.com/mod/ollama): Ollama CLI enhancement (ls, la, run, pull interactive enhancement) and Webservice client
  * [llmf](https://www.x-cmd.com/mod/llmf): This module provides local model management and provides an API webservice client for the llamacpp family
  * llava
  * [whisper](https://www.x-cmd.com/mod/whisper): Local AI speech recognition
* Applications:
  * tran: Translation module suitable for various formats and batch processing environments (TODO)
  * txt: Manage text content via the command line
  * md: Preview Markdown documents more elegantly with syntax highlighting. (TODO)
  * chat: Command line tool for Chatgpt
  * coco: coco provides code-related operations; our language module provides `,` and `,,` support
  * co: Short for copilot, it generates shell commands that can be executed locally, preferably in one line of code

## Related [AI/LLM packages](https://www.x-cmd.com/pkg/whispercpp) 

* [how2](https://www.x-cmd.com/pkg/how2): how2 is a tool for finding the easiest way to do something in a Unix shell.
* [catai](https://www.x-cmd.com/pkg/catai): CatAI is a command-line software developed based on TypeScript, which  allows users to run GGUF (Generalized Galerkin Unstructured Finite  element) models on the computer through a chat interface.
* [whispercpp](https://www.x-cmd.com/pkg/whispercpp): whisper.cpp is a lightweight intelligent speech recognition library  written in C/C++, a port of OpenAI's Whisper model, designed to achieve  audio-to-text functionality through deep learning models.
* llamafile:

## TODO 

There are so many AI software appearing now that it is difficult for us to  integrate them all into pkg. Here we list the AI tools that have not  been integrated, and users can also refer to:

* [LocalAI](https://localai.io/basics/getting_started/)

---

# Imperative Interaction, CLI/TUI Design, and LLM 

In an era dominated by Graphical User Interfaces (GUIs), Command Line  Interfaces (CLIs) and Text User Interfaces (TUIs) might seem like  "old-fashioned" choices. However, they still demonstrate unique  advantages in specific scenarios. X-CMD, as a platform dedicated to  enhancing the command-line experience and efficiency, has its own  perspectives on CLI/TUI design and actively explores the possibilities  of integrating them with emerging LLM technology.

We are frequently asked the following core questions:

1. Graphical operating systems have been widespread for many years, so why do we still emphasize and use CLI/TUI?
2. Since X-CMD develops TUIs, why doesn't it make the TUI functionalities of  each module as powerful and independent as other open-source projects?
3. X-CMD seems to be involved in multiple domains (such as file management). What exactly are the boundaries of X-CMD?

This article aims to delve into these questions, elaborate on X-CMD's  philosophy regarding imperative interaction and CLI/TUI design, and  discuss how we view its future synergy with LLMs.

## TLDR 

Brief answers to the questions above:

1. **Why use CLI/TUI?** We do not believe that only CLI or GUI are the two extreme choices. X-CMD advocates for a **multimodal interaction solution**: CLI + TUI + Desktop GUI + Web GUI, leveraging the strengths of each for different scenarios. CLI/TUI offers unparalleled advantages over GUI in terms of automation, remote operations, resource efficiency, and  precise control.
2. **Why doesn't X-CMD's TUI aim for comprehensiveness?** The core of X-CMD lies in **imperative language interaction**. Imperative language possesses the unambiguity of programming languages  while being close to natural language, serving as the foundation for  efficient, repeatable, and easily scriptable interaction. The TUIs  developed by X-CMD are **lightweight, single-purpose**  auxiliary tools. They are components of the command-line workflow, not  independent, heavyweight applications. This design philosophy allows  them to be easily used in constrained environments like containers and  remote servers, and integrates them tightly with imperative interaction.
3. **What are X-CMD's boundaries?** X-CMD's boundary is defined by providing a **consistent imperative interaction layer** and a series of **lightweight CLI/TUI tools tailored for specific scenarios**. Some of these tools are designed for human users, while others are  specifically for LLM Agents. We focus on providing solutions to connect, enhance, and simplify existing tools, rather than rebuilding complex  applications that already exist.

## Graphical operating systems have been widespread for many years, so why do we still emphasize and use CLI/TUI? 

Indeed, GUIs have significantly lowered the barrier to computer use and provide intuitive visual feedback. However, for many users who require  efficient, repetitive operations, remote management, or work in  resource-constrained environments, CLI/TUI remains an indispensable  tool.

### Core Advantages of CLI/TUI 

1. **Efficiency and Speed:** For users familiar with commands, typing commands via the keyboard is  often faster than navigating with a mouse. Batch processing and  automation scripts are particular strengths of the CLI.
2. **Automation and Repeatability:** Command sequences can be easily saved as scripts, enabling task  automation and standardization, ensuring the repeatability of  operations. This is crucial for fields like development, operations, and data processing.
3. **Remote Access and Management:** In remote servers or headless systems, CLI/TUI is the primary mode of  interaction. Tools like SSH make remote command-line operations  extremely convenient and efficient.
4. **Resource Efficiency:** CLI/TUI applications typically consume fewer system resources (CPU,  memory, bandwidth) than GUI applications, which is a significant  advantage in resource-constrained environments (such as containers,  embedded devices).
5. **Precise Control:** Commands  provide low-level, fine-grained control over systems and applications,  which is often difficult to achieve with many GUIs.

### Challenges Faced by CLI/TUI: Design Inconsistency 

Despite numerous advantages, many users find the command line "difficult to use," largely due to its **lack of design consistency**. Different commands have different parameter styles, and different TUI  applications have different shortcut keys and interaction logic. Imagine if the "close" button position and icon were different for every  application on a desktop system – the user experience would be  disastrous. The GUI world has partially solved this problem through  design guidelines (like Apple's HIG), but in the command world, such  consistency is scarce.

### X-CMD's Multimodal and Consistency Exploration 

X-CMD does not believe users must choose between CLI and GUI. We advocate for a **multimodal interaction solution**:

* **CLI:** As the core, providing precise, scriptable operations.
* **TUI:** As a supplement to the CLI, providing lightweight interaction when  minimal visual assistance is needed (e.g., multi-column file lists,  progress bars, simple selections).
* **Desktop GUI / Web GUI:** Used when complex visual presentation, rich media, or collaborative scenarios are required.

To address the consistency issue of CLI/TUI, X-CMD attempts to enhance the user experience through the following approaches:

1. **Shell Wrapping and Modularity:** Through a unified `x` command entry point and modular design, we strive to provide greater  consistency in command structure, parameter styles, and terminology.

2. Lightweight TUI Design Philosophy:

    Our TUI applications follow a unified set of design principles: 

   * **Clear Goal, Single Function:** Each TUI solves a specific problem, avoiding feature bloat.
   * **Simple Operation Flow, Few Shortcuts:** Lowering the learning curve, core operations are intuitive and easy to understand.
   * **Design Reuse Across Modules/Applications:** Wherever possible, similar layouts, navigation, and interaction patterns are adopted across different TUIs.
   * **Non-Fullscreen Design Priority:** Most TUIs are designed to be non-fullscreen, preserving the terminal  context, making them more like "widgets" within the command-line  workflow.
   * **Minimal Dependencies:** Efforts are  made to avoid relying on complex binary software that requires extra  installation, ensuring high availability of applications in various  environments (including containers, remote servers).

This design philosophy means that while X-CMD's TUI applications are  relatively simple in function, they possess stronger adaptability and  consistency, integrating better into the command-line workflow. They are not intended to replace powerful independent TUI applications (like `htop`, `ranger`), but rather to provide a more convenient and consistent option in simple scenarios or constrained environments.

## The Core of X-CMD: Imperative Language Interaction and Lightweight Toolset 

As mentioned earlier, the core of X-CMD is not about building comprehensive applications, but about **improving the efficiency and experience of imperative language interaction**.

Imperative language (like Shell scripts) is one of the most fundamental ways to  interact with computers; it is powerful, flexible, and unambiguous.  X-CMD is dedicated to:

1. **Providing a more user-friendly and consistent command interface:** Through modularization and wrapping, making complex or stylistically  varied underlying commands easier to discover, understand, and use.
2. **Building lightweight, high-efficiency tools:** Developing a series of CLI/TUI tools driven by imperative language,  targeting specific pain points. The design philosophy of these tools is  "small and beautiful," focusing on doing one thing well and being  combinable with other commands (Unix philosophy).
3. **Connecting and Orchestrating Existing Tools:** X-CMD's `pkg` and `env` capabilities make managing and using various third-party command-line  tools more convenient, integrating them into X-CMD's consistent  framework.

Therefore, the boundaries of X-CMD are:

* **Not Reinventing the Wheel:** For existing and powerful tools (like Git, Docker, kubectl), X-CMD  primarily provides a more friendly entry point, a more consistent  parameter style, or auxiliary TUI tools, rather than implementing their  core functionality from scratch.
* **Focusing on Connection and Enhancement:** X-CMD acts as a "connector" and "enhancer," allowing users to use  various command-line tools more smoothly and string them together  through scripts.
* **Developing Lightweight Tools for Specific Scenarios:** Especially in scenarios requiring simple interaction, remote  availability, or providing structured interfaces for LLM Agents, X-CMD  will develop its own CLI/TUI tools.

## How to Use X-CMD Efficiently 

Understanding X-CMD's philosophy, here are some suggested usage methods:

### 1. Get a General Overview, Build a Cognitive Map 

* Browse the list of X-CMD modules (`x mod`) and packages (`x pkg`), and watch related videos and documentation.
* Focus on what problems each module or package can solve and what core capabilities they provide.
* There's no need to memorize all commands and parameters initially; just get a  general understanding of X-CMD's scope. This helps you know if X-CMD  might offer a solution when you encounter a problem.

### 2. Search as Needed, Quickly Locate 

* **Utilize Built-in Help:** X-CMD modules and commands typically provide detailed help information. Use `x <module> -h` or `x <module> <command> -h` to quickly view usage, parameters, and examples. We are also working to provide more user-friendly `tldr`-style brief help.

* Consult Official Documentation:

   The X-CMD official website is the primary source for detailed information. 

  * [x-cmd mod](https://x-cmd.com/mod): Introduction to modules developed by the X-CMD team.
  * [x-cmd pkg](https://x-cmd.com/pkg): Packages provided by X-CMD through `env` and their introductions.
  * [Documentation Center](https://x-cmd.com/docs): More in-depth usage guides and concept explanations.

* **Utilize Search:** The official website provides a search function, and you can also  combine it with search engines (like Google) by searching for `x-cmd <keyword>` to find relevant resources.

* **Use URLs for Quick Access:** The official website's URL design is intuitive, for example, `x-cmd.com/mod/uptime` directly accesses the uptime module introduction, and `x-cmd.com/pkg/jq` directly accesses the jq package introduction.

### 3. Integrate into Workflow, Continuously Improve 

* Try applying X-CMD modules and tools to your daily work to solve practical problems.
* Utilize X-CMD's scripting capabilities to automate repetitive tasks.
* As you use it more, you will gradually become familiar with commonly used  modules and commands, and your efficiency will naturally improve.

## A Slightly Further Future: Synergy Between LLM and Imperative Language 

We believe that imperative language is not only an efficient way for  humans to interact with computers but also an ideal interface for future LLM Agents to interact with computer systems.

### Friction Between LLM and Complex GUI 

Many modern GUI applications, especially web applications, have increasingly complex interface designs, with feature entry points hidden deeper, and even frequent redesigns, often for visual effect or commercial  purposes. This not only confuses human users but also poses a  significant challenge for automation tools (like RPA) and future LLM  Agents that rely on fixed interface elements and workflows. LLMs are  good at understanding natural language and generating text, but directly operating a variable, complex graphical interface is difficult and  unreliable.

### Imperative Language: The Ideal Interface for LLM 

In contrast, imperative language provides LLMs with a **structured, unambiguous, and stable** interaction interface:

1. **Precision:** Commands have clear syntax and semantics, avoiding the ambiguity of  natural language. LLMs can generate precise commands to execute specific tasks.
2. **Parsability:** Command output is usually structured text, which LLMs can parse and understand more easily.
3. **Composability:** Complex tasks can be accomplished by combining simple commands, which  aligns with LLMs' chain-of-thought and planning capabilities.
4. **Scriptability:** LLMs can generate and understand scripts, enabling more complex automation workflows.
5. **Stability:** Command interfaces are typically much more stable than GUI interfaces,  reducing the risk of LLM Agents failing due to interface changes.

### How X-CMD Empowers LLM Agents 

X-CMD's design philosophy naturally aligns with the needs of LLM Agents:

1. **Consistent Command Interface:** The unified, consistent command style provided by X-CMD reduces the  difficulty for LLMs to understand and generate commands. LLMs do not  need to learn countless different command parameter styles; they only  need to master the X-CMD pattern.
2. **Structured Help and Documentation:** X-CMD's built-in help and online documentation provide LLMs with a  rich, structured source of knowledge, helping them understand command  functions and usage.
3. **Lightweight Toolset:** The  single-purpose lightweight tools provided by X-CMD offer LLM Agents  "atomic" operations for executing specific tasks. For example, a file  operation Agent could call `x ls` to get a file list (potentially assisted by a TUI for display to the user or internal parsing), call `x cp` for copying, call `x rm` for deleting, etc.
4. **Tools Specifically Designed for Agents:** We are exploring the development of some CLI/TUI tools specifically  designed for LLM Agents. These might have output formats that are easier for machines to parse or provide more granular control options.

### Vision: LLM as a Command-Line Copilot 

We envision a future where LLMs can act as the user's "command-line  copilot." Users can describe tasks in natural language, and the LLM will translate them into X-CMD command sequences, execute them, and explain  the results. When user confirmation or information is needed, X-CMD's  lightweight TUIs can provide a concise interaction interface.

For example:

* User: "Help me find all `.md` files modified last week and copy them to the `backup` directory."
* LLM Agent (via X-CMD): 
  * Generates and executes `x find . -mtime -7 -name '*.md'`
  * Parses the output, possibly using `x tui select` to let the user confirm the file list.
  * Generates and executes `x mkdir backup` (if the directory doesn't exist).
  * Generates and executes `x cp <list of found files> backup/`.
  * Reports the operation results to the user.

In this process, X-CMD provides a consistent, reliable command interface  and toolset that is easy for LLMs to understand and operate, greatly  enhancing the capabilities and reliability of LLM Agents.

## Conclusion 

CLI/TUI still holds irreplaceable value in automation, efficiency, and remote  management. X-CMD is dedicated to lowering the barrier to command-line  use and improving user efficiency by providing a consistent imperative  interaction layer and lightweight CLI/TUI tools. Looking ahead, we  believe that imperative language will become a key interface for  efficient and reliable interaction between LLM Agents and computer  systems, and X-CMD's design philosophy and toolset will play an  important role in this synergistic model, jointly building a more  intelligent and efficient human-computer collaboration method.

---

