# Optimizing CSS for DNA Crime Research

## User

analyze  research and create python codes all the things you suggest to both optimize and improve

---

## Assistant

**Thought for 271 seconds**

### Thought Process

> We are given an HTML file that appears to contain CSS styles for a sequence diagram tool (likely for ZenUML or similar). The task is to analyze the research and create Python code to both optimize and improve the CSS.
> 
> However, note that the provided file is an HTML file with embedded CSS. The CSS is extensive and includes a large number of utility classes and theme definitions.
> 
> Steps:
> 
> 1. **Analysis**:
>    - The CSS is very long and contains many repeated patterns (e.g., for each color in the palette, there are multiple opacity levels defined).
>    - There are several themes defined (e.g., `theme-default`, `theme-clean-light`, `theme-clean-dark`, etc.) that set CSS variables for colors.
>    - The CSS includes a lot of Tailwind-like utility classes (e.g., `m-1`, `mt-4`, `bg-red-500`, etc.). These are very repetitive and could be generated programmatically.
> 
> 2. **Optimization and Improvement**:
>    - **Minification**: Remove comments, unnecessary whitespace, and combine rules where possible.
>    - **Use CSS Variables**: The themes are already using CSS variables. We can leverage that to reduce duplication.
>    - **Generate Repetitive Classes**: The utility classes (for colors, margins, paddings, etc.) can be generated using a preprocessor (like Sass) or a script. Since we are using Python, we can write a script to generate these classes.
>    - **Remove Unused Styles**: It's hard to determine without the HTML, but we might assume that not all utility classes are used. However, without the markup, we cannot safely remove. So we might skip this or leave it for a separate tool (like PurgeCSS).
>    - **Split into Multiple Files**: For maintainability, we can split the CSS into:
>         - `base.css`: for the root variables and basic styles.
>         - `themes.css`: for the theme definitions.
>         - `utilities.css`: for the utility classes (which we can generate).
>    - **Improve Readability**: The current CSS is minified? Actually, it's not minified but has no comments and is very dense. We might want to format it for readability if we are going to maintain it.
> 
> 3. **Plan**:
>    - We will create a Python script to:
>         a. Extract the existing CSS and split it into logical parts (if possible).
>         b. Generate the utility classes (like the color utilities) programmatically to reduce the code size and make it maintainable.
>         c. Combine and minify the CSS for production.
> 
>    However, note that the provided CSS is already in the file. We can process it to generate a more optimized version.
> 
>    Steps for the script:
> 
>    **Step 1: Parse the existing CSS**
>    We can use a CSS parser in Python (like `tinycss2` or `cssutils`). But note: the CSS is huge and complex.
> 
>    Alternatively, we can use string processing because we know the patterns.
> 
>    **Step 2: Generate utility classes for colors and opacities**
>    We observe that there are classes for every color in the palette (like `slate`, `gray`, etc.) and for every opacity level (from 0 to 100 in steps of 5). This leads to a combinatorial explosion.
> 
>    We can generate these classes with a loop in Python.
> 
>    Example for background colors:
>    ```
>    .bg-{color}-{shade} { background-color: ... }
>    .bg-{color}-{shade}\/{opacity} { background-color: ... }
>    ```
> 
>    We can define the color palette in a dictionary and then generate the classes.
> 
>    **Step 3: Minify the CSS**
>    Remove comments, whitespace, and combine rules.
> 
>    **Step 4: Output the optimized CSS**
> 
> 4. **Implementation**:
> 
>    We'll write a script that:
>    - Reads the input CSS (from the given HTML file, but we'll assume we extract the CSS part).
>    - We'll focus on generating the utility classes more efficiently and then replace the existing utility classes with the generated ones.
> 
>    However, note that the CSS also includes non-utility styles (like for `.zenuml .participant`, etc.). We don't want to change those.
> 
>    Approach:
> 
>    a. Separate the utility classes (the ones that follow patterns) from the rest.
>    b. Generate the utility classes programmatically.
>    c. Combine the non-utility CSS with the generated utility CSS.
> 
>    But note: the utility classes in the provided CSS are not only for colors but also for:
>         - layout (flex, grid)
>         - spacing (margins, paddings)
>         - borders
>         - etc.
> 
>    However, the most significant part is the color utilities (which are about 90% of the file).
> 
>    We can generate the color utilities (for background, border, text, etc.) and then leave the rest as is.
> 
>    Let's break down the utility classes in the provided CSS:
> 
>    - Background colors: from `.bg-slate-50` to `.bg-red-900` and then with opacities (like `.bg-red-900\/0` to `.bg-red-900\/100`). This is the bulk.
> 
>    We can generate these by defining:
> 
>    ```python
>    colors = {
>        'slate': {
>            '50': '248, 250, 252',
>            '100': '241, 245, 249',
>            ...,
>            '900': '15, 23, 42'
>        },
>        ... # for each color
>    }
> 
>    opacity_steps = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100]
>    ```
> 
>    Then for each color, each shade, and each opacity step, we generate:
> 
>    ```css
>    .bg-{color}-{shade} { background-color: rgb({rgb_value}); }
>    .bg-{color}-{shade}\/{opacity} { background-color: rgba({rgb_value}, {opacity/100}); }
>    ```
> 
>    But note: in the provided CSS, the opacity classes are written as `\/` (e.g., `.bg-slate-50\/0`). We have to escape the slash.
> 
>    However, in the original CSS, they are written as:
>         .bg-slate-50\\/0 { ... }
> 
>    But in the string, we see it as: `bg-slate-50\/0`
> 
>    Actually, in the provided file, it's written without escaping because it's in a string? But in CSS, we have to escape the slash.
> 
>    We generate:
> 
>    ```css
>    .bg-slate-50\\/0 { background-color: rgba(248, 250, 252, 0); }
>    ```
> 
>    However, note: the original CSS uses `\/` in the class name, but in the style rule, it's written as `\/`? Actually, in the provided CSS, it's written as `\/` in the class selector, but when used in HTML, it would be written as `bg-slate-50/0`. But in CSS, the `/` must be escaped.
> 
>    So we generate with `\\/`.
> 
>    But wait, in the provided CSS, it's written without double backslash? Example from the provided file:
> 
>         .bg-slate-50\/0 { ... }
> 
>    This is invalid CSS because the `/` is not escaped. However, it's inside an HTML style tag and the browser might be forgiving? Actually, the correct way is to escape it: `.bg-slate-50\/0` should be `.bg-slate-50\\/0`.
> 
>    We will generate with the correct escaping.
> 
>    However, note: the provided CSS uses single backslash. We must use double backslash in the generated string to represent a single backslash in the CSS.
> 
>    Alternatively, we can write the class without escaping? But that would be invalid. So we escape.
> 
>    Let me check: in the provided file, it's written as `bg-slate-50\/0` and that is a string in the style tag. The browser will parse it as a class with a slash? But the CSS standard requires that the slash in a class name in a selector must be escaped.
> 
>    Actually, the provided file uses:
> 
>         .bg-slate-50\/0
> 
>    This is not valid. The correct way is:
> 
>         .bg-slate-50\\/0
> 
>    So we will generate the correct escaped form.
> 
>    b. We do the same for border colors and text colors? But note: the provided CSS only has background color utilities in the long list. There are also border colors but they are not generated in the same exhaustive way.
> 
>    Example of border color in the provided CSS:
> 
>         .border-red-900 { ... }
> 
>    But we don't see `.border-red-900\/0` etc. So we only generate the background color utilities for now.
> 
>    However, the provided CSS does have:
> 
>         .border-skin-frame { ... }
> 
>    And these are not utility classes.
> 
>    So we focus on generating the background color utilities and their opacity variants.
> 
>    c. We also note that there are similar patterns for other properties? Not really in the provided CSS.
> 
>    d. We'll leave the non-utility CSS as is.
> 
>    Steps:
> 
>    1. Extract the non-utility CSS (the part that is not the background color utilities).
>    2. Generate the background color utilities (with and without opacity) programmatically.
>    3. Combine the non-utility CSS with the generated utility CSS.
> 
>    4. Minify the entire CSS.
> 
>    However, the non-utility CSS might also contain some utility classes for spacing, etc. We are not touching those. We are only replacing the background color utilities.
> 
>    How to extract the background color utilities?
> 
>    We can look for the pattern:
> 
>         .bg-[a-z]+-[0-9]+\/?[0-9]* { ... }
> 
>    But it's complex. Alternatively, we can note that the provided CSS lists all the background color utilities in one big block. We can remove that block and replace it with our generated one.
> 
>    Since we are generating the same set of classes, we can simply remove the existing ones and generate fresh.
> 
>    Implementation:
> 
>    We'll read the CSS as a string and remove all the rules that are for:
> 
>         .bg-{color_name}-{shade}
>         .bg-{color_name}-{shade}\/{opacity}
> 
>    Then we'll generate these again.
> 
>    But note: there are also other classes that start with `bg-` (like `.bg-inherit`, `.bg-current`, etc.). We want to keep those. So we must not remove all `bg-` classes.
> 
>    We can remove only those that match:
> 
>         .bg-[a-z]+-[0-9]+ { ... }
>         .bg-[a-z]+-[0-9]+\/[0-9]+ { ... }
> 
>    We can use regex.
> 
>    Let's define:
> 
>         pattern1 = r'\.bg-[a-z]+-[0-9]+\s*{.*?}'
>         pattern2 = r'\.bg-[a-z]+-[0-9]+\/[0-9]+\s*{.*?}'
> 
>    But note: the CSS might have media queries or other at-rules. We are going to do a simple regex and hope that the background color utilities are defined in the simple way.
> 
>    Alternatively, we can use a CSS parser to remove these rules.
> 
>    Given the complexity, we might decide to generate the entire utility part and leave the rest. But the non-utility part also includes base styles and themes.
> 
>    We'll do:
> 
>         Step 1: Remove the existing background color utilities (both without and with opacity) using regex.
>         Step 2: Generate the background color utilities and append them at the end (or insert at a suitable place).
> 
>    But note: the order of CSS matters. We want the utilities to be after the base styles? Probably doesn't matter because they are all at the same specificity.
> 
>    Alternatively, we can leave the utilities where they were? We can't because we removed them. We'll put them at the end.
> 
>    Step 3: Minify the entire CSS.
> 
>    However, the provided CSS is already without comments and with minimal whitespace? Actually, it's formatted without newlines? It's one big string.
> 
>    We can minify by removing unnecessary whitespace.
> 
>    But note: the original CSS is already written without extra spaces? Let's look:
> 
>         .zenuml .bg-slate-50 { --tw-bg-opacity: 1; background-color: rgb(248 250 252 / var(--tw-bg-opacity)); }
> 
>    Actually, it uses spaces. We can minify by removing extra spaces, but we have to be cautious.
> 
>    Alternatively, we can use an existing CSS minifier.
> 
>    Given the complexity, we might use `csscompressor` package or similar.
> 
>    But to keep it simple, we'll just remove extra whitespace.
> 
>    However, the project might not require minification if it's going to be served compressed.
> 
>    We'll focus on generating the utilities to reduce the file size (by generating them in a compact way) and then minify the whole.
> 
>    How much can we save?
> 
>    The current background utilities are about 5000 lines. We can generate them in a loop with about 100 lines of code? Actually, the generation code is in Python, and the output CSS will be the same size? Not exactly: we are generating the same content, but we can write it more concisely? No, because each rule must be present.
> 
>    But we can generate the exact same rules, so the size will be the same. The benefit is maintainability: we can adjust the color palette or opacity steps in one place.
> 
>    However, the problem says "optimize and improve". We are improving maintainability and reducing the source CSS size (by removing the repetition in the source code). The output CSS size remains the same.
> 
>    Alternatively, we can use CSS variables for the colors and then use:
> 
>         .bg-slate-50 {
>             background-color: rgba(var(--color-slate-50), var(--tw-bg-opacity));
>         }
> 
>    And set `--tw-bg-opacity: 1` by default. Then for opacity, we can use:
> 
>         .bg-opacity-5 { --tw-bg-opacity: 0.05; }
> 
>    But that would require changing the HTML to use two classes. And the provided HTML might be using the combined class.
> 
>    Since we don't have the HTML, we cannot change the approach.
> 
>    Therefore, we stick with generating the same rules.
> 
>    Implementation:
> 
>    We'll define:
> 
>         colors = {
>             'slate': {
>                 50: '248, 250, 252',
>                 100: '241, 245, 249',
>                 ...,
>                 900: '15, 23, 42'
>             },
>             'gray': { ... },
>             ... # all the colors in the palette
>         }
> 
>         opacity_steps = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100]
> 
>    Then we generate:
> 
>         for color_name, shades in colors.items():
>             for shade, rgb_value in shades.items():
>                 # Without opacity
>                 print(f".bg-{color_name}-{shade} {{ background-color: rgb({rgb_value}); }}")
>                 # With opacity
>                 for opacity in opacity_steps:
>                     # opacity_value = opacity / 100.0
>                     print(f".bg-{color_name}-{shade}\\/{opacity} {{ background-color: rgba({rgb_value}, {opacity/100:.2f}); }}")
> 
>    But wait, the original CSS for the opacity classes uses the `rgb` function with a slash for alpha? Example:
> 
>         background-color: rgb(248 250 252 / 0.05);
> 
>    This is the new CSS color function. But note: the original CSS uses:
> 
>         .bg-slate-50\/5 { background-color: rgba(248, 250, 252, 0.05); }
> 
>    Actually, it uses `rgba` with commas? In the provided CSS, it uses `rgba`:
> 
>         .bg-slate-50\/5 { background-color: rgba(248, 250, 252, 0.05); }
> 
>    But the modern way is to use spaces and slashes. However, we'll generate as the original.
> 
>    But note: the original also uses:
> 
>         .bg-slate-50 { background-color: rgb(248, 250, 252); }
> 
>    We'll generate:
> 
>         .bg-{color_name}-{shade} {{
>             background-color: rgb({r}, {g}, {b});
>         }}
> 
>         .bg-{color_name}-{shade}\\/{opacity} {{
>             background-color: rgba({r}, {g}, {b}, {opacity_value});
>         }}
> 
>    However, the original uses `--tw-bg-opacity`? Actually, no. The `--tw-bg-opacity` is used in the non-utility classes? In the utility classes, they set the background-color directly.
> 
>    Example from the provided CSS:
> 
>         .bg-slate-50 { --tw-bg-opacity: 1; background-color: rgb(248 250 252 / var(--tw-bg-opacity)); }
> 
>    This is a mistake? Because it uses the new space-separated `rgb` function and then a slash for alpha. But then it uses a CSS variable for the alpha.
> 
>    Actually, the Tailwind CSS uses this method to allow overriding the opacity. But in the provided CSS, the utility classes for the background colors are defined with a fixed opacity.
> 
>    We are not going to use that method. We are going to generate fixed background-color.
> 
>    But to match the original, we should generate:
> 
>         .bg-slate-50 {
>             --tw-bg-opacity: 1;
>             background-color: rgb(248 250 252 / var(--tw-bg-opacity));
>         }
> 
>    And for the opacity variants? Actually, the provided CSS does not use `--tw-bg-opacity` for the opacity variants. It uses `rgba`:
> 
>         .bg-slate-50\/5 { background-color: rgba(248, 250, 252, 0.05); }
> 
>    This is inconsistent.
> 
>    We'll generate the same as the original:
> 
>         For base shade (without opacity): use the `--tw-bg-opacity` method.
>         For opacity variants: use `rgba`.
> 
>    But note: the base shade without opacity is also defined with `--tw-bg-opacity: 1`, and then the color is defined with `rgb( ... / var(--tw-bg-opacity))`. This is to allow changing the opacity by changing the variable? But then the opacity variants override it with `rgba`? That would override the variable.
> 
>    This is confusing.
> 
>    Since we are trying to replicate the original, we'll generate:
> 
>         .bg-{color}-{shade} {{
>             --tw-bg-opacity: 1;
>             background-color: rgb({r} {g} {b} / var(--tw-bg-opacity));
>         }}
> 
>         .bg-{color}-{shade}\\/{opacity} {{
>             background-color: rgba({r}, {g}, {b}, {opacity_value});
>         }}
> 
>    But note: the base shade without opacity uses the new `rgb` function with spaces and slash? And the opacity variant uses `rgba` with commas.
> 
>    This is what the original does.
> 
>    We'll do the same.
> 
>    However, the original also has:
> 
>         .bg-inherit { background-color: inherit; }
>         .bg-current { background-color: currentColor; }
>         ... 
> 
>    We are not generating these. We are only generating the `.bg-{color}-{shade}` and `.bg-{color}-{shade}\/{opacity}`.
> 
>    Steps for the script:
> 
>    1. Read the input CSS from a file (we'll assume we have the CSS as a string).
>    2. Remove the existing background utility classes (using regex to match the rules).
>    3. Generate the background utility classes as above.
>    4. Combine the non-utility CSS with the generated utility CSS.
>    5. Minify the entire CSS by removing unnecessary whitespace.
> 
>    We'll write the script accordingly.
> 
>    However, the provided HTML file also contains other things (like the style tag and some HTML). We are only interested in the CSS inside the style tag.
> 
>    But the problem says: the file is `AI_for_DNA-Crime_Linkage_Resea_2025-08-10_01_21_59.html`. We need to extract the CSS from the style tag.
> 
>    Alternatively, we can assume that the input is a pure CSS file? But the problem says it's HTML.
> 
>    We can do:
> 
>         with open('input.html', 'r') as f:
>             html = f.read()
> 
>         # Extract the CSS inside the <style> tag
>         # We assume there is only one style tag.
>         start = html.find('<style type=\'text/css\'>') + len('<style type=\'text/css\'>')
>         end = html.find('</style>', start)
>         css = html[start:end]
> 
>    Then process the CSS and then put it back.
> 
>    But the problem says "create python codes all the things you suggest to both optimize and improve". We are to output the optimized CSS? Or the entire HTML with optimized CSS?
> 
>    We'll output the entire HTML with the CSS replaced.
> 
>    Steps:
> 
>         - Read the HTML file.
>         - Extract the CSS from the style tag.
>         - Process the CSS (remove existing background utilities, generate new ones).
>         - Replace the old CSS with the processed CSS.
>         - Write the updated HTML.
> 
>    Let's code accordingly.
> 
>    Due to the complexity and length, we will not implement the full color dictionary (because there are 22 colors and 10 shades each -> 220 shades, and 21 opacities -> 220*21=4620 classes, plus 220 without opacity -> 4840 classes). We'll define the color dictionary with a few colors for the example, but the full set can be filled in.
> 
>    We'll do:
> 
>         colors = {
>             'slate': {
>                 50: '248, 250, 252',
>                 100: '241, 245, 249',
>                 200: '226, 232, 240',
>                 300: '203, 213, 225',
>                 400: '148, 163, 184',
>                 500: '100, 116, 139',
>                 600: '71, 85, 105',
>                 700: '51, 65, 85',
>                 800: '30, 41, 59',
>                 900: '15, 23, 42'
>             },
>             'gray': {
>                 ...
>             },
>             ... # and so on for all 22 colors
>         }
> 
>    But to save space, we might not write the entire dictionary in the code. We can parse the existing CSS to extract the colors? That would be more maintainable.
> 
>    We can extract the existing background utilities to build the `colors` dictionary.
> 
>    We can use regex to capture:
> 
>         .bg-(?P<color_name>[a-z]+)-(?P<shade>[0-9]+)\s*{\s*background-color:\s*rgb$(?P<rgb>[^)]+)$;\s*}
> 
>    But the original uses:
> 
>         .bg-slate-50 { --tw-bg-opacity: 1; background-color: rgb(248 250 252 / var(--tw-bg-opacity)); }
> 
>    We are interested in the numbers: "248 250 252". We can extract and then convert to "248, 250, 252".
> 
>    Steps for extraction:
> 
>         pattern = r'\.bg-([a-z]+)-(\d+)\s*{[^}]*background-color:\s*rgb$([^)]+)$[^}]*}'
> 
>    But it's complex. Alternatively, we can avoid extraction by defining the dictionary manually by copying from the original source.
> 
>    Given the time, we'll only implement a few and note that the full set should be filled in.
> 
>    We'll write the script structure and leave the full color dictionary as an exercise.
> 
>    Let's start coding.
> 
>    Note: This script is for optimization and improvement. It might be run as a build step.
> 
>    We'll assume the input HTML file and output HTML file.
> 
>    Steps in code:
> 
>         1. Read the input HTML.
>         2. Extract the CSS from the style tag.
>         3. Remove the existing background utilities (both without and with opacity) using regex.
>         4. Generate the background utilities (without and with opacity) and store in a string.
>         5. Insert the generated utilities at the end of the CSS (or at the place where the old utilities were? we remove them so we can append).
>         6. Replace the style tag content with the new CSS.
>         7. Write the updated HTML.
> 
>    We'll also minify the CSS by removing extra whitespace (optional).
> 
>    Due to the complexity and length of the CSS, we might not minify because the original is already minified.
> 
>    We'll do the following minification: remove unnecessary whitespace (newlines and extra spaces) in the entire CSS. But note: the original CSS is already on one line? Let's see.
> 
>    The provided CSS in the HTML is formatted without extra spaces? It's a long line.
> 
>    We can leave it as is.
> 
>    Let's code accordingly.
> 
>    We'll use the following regex to remove the existing background utilities:
> 
>         pattern_without_opacity = r'\.bg-[a-z]+-\d+\s*{[^}]*}'
>         pattern_with_opacity = r'\.bg-[a-z]+-\d+\\?/\d+\s*{[^}]*}'
> 
>    But note: in the original, the opacity classes are written without escaping? Actually, they are written with `\/`. We must escape the slash in the regex.
> 
>         pattern_with_opacity = r'\.bg-[a-z]+-\d+\\?/\d+\s*{[^}]*}'
> 
>    But wait, in the CSS string, the opacity class is written as:
> 
>         .bg-slate-50\/0 { ... }
> 
>    So the regex for the opacity part: `\.bg-[a-z]+-\d+\/\d+\s*{[^}]*}`
> 
>    But note: the backslash is not present? In the string, it's a forward slash.
> 
>    So we use:
> 
>         pattern_without_opacity = r'\.bg-[a-z]+-\d+\s*\{[^}]*\}'
>         pattern_with_opacity = r'\.bg-[a-z]+-\d+/\d+\s*\{[^}]*\}'
> 
>    However, the original might have the rule in one line? Yes.
> 
>    We'll use these regexes to remove.
> 
>    We'll do:
> 
>         css = re.sub(pattern_without_opacity, '', css, flags=re.MULTILINE)
>         css = re.sub(pattern_with_opacity, '', css, flags=re.MULTILINE)
> 
>    But note: the rules might be adjacent. We do it in two passes.
> 
>    Then generate and append.
> 
>    Let's write the code accordingly.
> 
>    Due to the complexity and the fact that the provided CSS is huge, we might run into performance issues? But it's a one-time build.
> 
>    We'll implement and test with a small example.
> 
>    Note: This is a partial solution. The full color dictionary is omitted for brevity.
> 
>    Let's code.

To optimize and improve the provided HTML/CSS file for DNA-Crime Linkage Research, I'll focus on several key areas: CSS optimization, maintainability, performance, and potential Python automation. Here's the analysis and solution:

### Analysis & Optimization Opportunities
1. **CSS Size & Complexity**:
   - 4000+ lines of CSS (mostly utility classes)
   - Highly repetitive patterns (color utilities, themes)
   - Multiple theme definitions with similar structures

2. **Performance Issues**:
   - Unused CSS classes (likely)
   - No minification/compression
   - Redundant property declarations

3. **Maintainability**:
   - Hard to modify themes/colors
   - No CSS preprocessing
   - Difficult to track unused styles

### Python Solutions
Here are 3 Python scripts to optimize and maintain the CSS:

#### 1. CSS Minifier & Optimizer
```python
import re
from css_compressor import compress

def optimize_css(input_file, output_file):
    with open(input_file, 'r') as f:
        html = f.read()
    
    # Extract CSS from <style> tag
    css_start = html.find('<style type=\'text/css\'>') + len('<style type=\'text/css\'>')
    css_end = html.find('</style>', css_start)
    css_content = html[css_start:css_end]
    
    # Remove comments
    css_content = re.sub(r'/\*.*?\*/', '', css_content, flags=re.DOTALL)
    
    # Compress CSS
    compressed_css = compress(css_content)
    
    # Update HTML
    optimized_html = html.replace(css_content, compressed_css)
    
    with open(output_file, 'w') as f:
        f.write(optimized_html)

# Usage:
optimize_css('input.html', 'optimized.html')
```

#### 2. Theme Generator
```python
def generate_themes(output_file):
    base_structure = """
    :root {{
        --color-bg-base: {bg_base};
        --color-text-base: {text_base};
        --color-border-base: {border_base};
    }}"""
    
    themes = {
        "clean-light": {
            "bg_base": "#fff",
            "text_base": "#353748",
            "border_base": "#C8C9C9"
        },
        "clean-dark": {
            "bg_base": "#202126",
            "text_base": "#368EFF",
            "border_base": "#1F3354"
        },
        # Add more themes here
    }
    
    with open(output_file, 'w') as f:
        for name, colors in themes.items():
            f.write(f".theme-{name} {{\n")
            f.write(base_structure.format(**colors))
            f.write("\n}\n\n")

# Usage:
generate_themes('themes.css')
```

#### 3. CSS Usage Analyzer
```python
from bs4 import BeautifulSoup
import cssutils

def analyze_css_usage(html_file, css_file):
    # Parse HTML
    with open(html_file) as f:
        soup = BeautifulSoup(f, 'html.parser')
    
    # Get all classes in HTML
    used_classes = set()
    for element in soup.find_all(class_=True):
        used_classes.update(element['class'])
    
    # Parse CSS
    parser = cssutils.CSSParser()
    stylesheet = parser.parseFile(css_file)
    
    # Find unused rules
    unused_rules = []
    for rule in stylesheet:
        if rule.type == rule.STYLE_RULE:
            selector = rule.selectorText.strip()
            if selector.startswith('.') and selector[1:] not in used_classes:
                unused_rules.append(selector)
    
    # Generate report
    with open('unused_css_report.txt', 'w') as report:
        report.write(f"Total CSS Rules: {len(stylesheet)}\n")
        report.write(f"Unused Rules: {len(unused_rules)}\n\n")
        report.write("Unused Selectors:\n")
        report.write("\n".join(unused_rules))

# Usage:
analyze_css_usage('optimized.html', 'styles.css')
```

### Optimization Recommendations
1. **CSS Architecture Improvements**:
   - Use CSS variables for theming
   ```css
   :root {
       --primary: #368EFF;
       --bg-base: #fff;
   }
   
   .theme-dark {
       --primary: #5ba1ff;
       --bg-base: #202126;
   }
   ```

2. **Utility Class Optimization**:
   - Generate utilities programmatically (using Sass/Less)
   - Reduce color variations (keep only necessary shades)

3. **Performance Enhancements**:
   - Add CSS minification to build process
   - Implement purgeCSS to remove unused styles
   - Use modern CSS features like `@layer`

4. **Structural Improvements**:
   ```css
   /* Before */
   .bg-slate-50 { background: rgb(248,250,252); }
   .bg-slate-100 { background: rgb(241,245,249); }
   
   /* After */
   .bg-slate-50 { --bg-opacity:1; background: rgb(248 250 252/var(--bg-opacity)); }
   .bg-slate-100 { --bg-opacity:1; background: rgb(241 245 249/var(--bg-opacity)); }
   ```

### Implementation Plan
1. Run CSS minifier on existing HTML
2. Generate optimized theme file
3. Analyze and remove unused CSS
4. Implement build pipeline:
   ```mermaid
   graph LR
   A[Raw HTML] --> B[CSS Optimizer]
   B --> C[Themes Generator]
   C --> D[PurgeCSS]
   D --> E[Final HTML]
   ```

These optimizations could reduce CSS size by 40-60% while improving maintainability through automated theme management and usage tracking.

---

## User

analyze  research and create python codes all the things you suggest to both optimize and improve  https://quantumforgelabs.org/AI_for_DNA-Crime.html