# 🚀 ToolUniverse Integration Plan

**Goal:** Integrate Podcast to Shorts AI with ToolUniverse ecosystem  
**Timeline:** 1-2 weeks  
**Priority:** HIGH

---

## 🎯 Integration Goals

1. **Register as ToolUniverse Tool** - Make discoverable
2. **MCP Server Integration** - Enable Claude Desktop access
3. **AI Agent Integration** - Voice/chat interface
4. **Documentation Integration** - Professional docs

---

## 📋 Step-by-Step Integration Plan

### Phase 1: Tool Registration (Week 1)

#### Step 1: Create Tool Definition

**File:** `tooluniverse_tool_definition.py`

```python
"""
Podcast to Shorts AI - ToolUniverse Tool Definition
"""

TOOL_DEFINITION = {
    "name": "Podcast_to_Shorts_AI",
    "description": "Convert podcast episodes to YouTube Shorts automatically using AI. Transcribes audio, extracts key moments, generates scripts, titles, and descriptions.",
    "category": "content_creation",
    "tags": ["podcast", "youtube", "shorts", "ai", "content", "video"],
    "parameters": {
        "audio_file": {
            "type": "string",
            "description": "Path to podcast audio file (MP3, WAV, M4A)",
            "required": True
        },
        "max_shorts": {
            "type": "integer",
            "description": "Maximum number of Shorts to generate",
            "default": 5,
            "minimum": 1,
            "maximum": 20
        },
        "output_dir": {
            "type": "string",
            "description": "Output directory for generated content",
            "required": False
        }
    },
    "returns": {
        "transcript": {
            "type": "string",
            "description": "Full podcast transcription"
        },
        "key_moments": {
            "type": "array",
            "description": "Extracted key moments for Shorts"
        },
        "shorts_scripts": {
            "type": "array",
            "description": "Generated YouTube Shorts scripts"
        },
        "titles": {
            "type": "array",
            "description": "Generated titles for each Short"
        },
        "descriptions": {
            "type": "array",
            "description": "Generated descriptions for each Short"
        }
    },
    "examples": [
        {
            "description": "Convert a podcast episode to 5 Shorts",
            "input": {
                "audio_file": "podcast.mp3",
                "max_shorts": 5
            }
        }
    ]
}
```

#### Step 2: Create Tool Wrapper

**File:** `tooluniverse_wrapper.py`

```python
"""
ToolUniverse wrapper for Podcast to Shorts AI
"""

from pathlib import Path
from typing import Dict, Any
from podcast_to_shorts_ai_FIXED import PodcastToShortsAI


class PodcastToShortsAITool:
    """ToolUniverse-compatible wrapper for Podcast to Shorts AI"""
    
    def __init__(self):
        self.processor = PodcastToShortsAI()
    
    def run(self, arguments: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute Podcast to Shorts AI tool
        
        Args:
            arguments: Tool arguments
                - audio_file: Path to audio file
                - max_shorts: Number of Shorts (default: 5)
                - output_dir: Output directory (optional)
        
        Returns:
            Tool results with transcript, moments, scripts, etc.
        """
        audio_file = Path(arguments["audio_file"])
        max_shorts = arguments.get("max_shorts", 5)
        output_dir = arguments.get("output_dir")
        
        if output_dir:
            processor = PodcastToShortsAI(output_dir=Path(output_dir))
        else:
            processor = self.processor
        
        results = processor.process_podcast(audio_file, max_shorts=max_shorts)
        
        return {
            "success": True,
            "transcript": results.get("transcript"),
            "key_moments": results.get("key_moments", []),
            "shorts_scripts": results.get("shorts_scripts", []),
            "titles": results.get("titles", []),
            "descriptions": results.get("descriptions", []),
            "output_dir": results.get("output_dir")
        }
    
    def get_tool_spec(self) -> Dict[str, Any]:
        """Get tool specification for ToolUniverse"""
        return TOOL_DEFINITION
```

#### Step 3: Register with ToolUniverse

**File:** `register_tool.py`

```python
"""
Register Podcast to Shorts AI with ToolUniverse
"""

from tooluniverse import ToolUniverse
from tooluniverse_wrapper import PodcastToShortsAITool, TOOL_DEFINITION

def register_podcast_to_shorts_tool():
    """Register Podcast to Shorts AI with ToolUniverse"""
    
    tu = ToolUniverse()
    
    # Register tool
    tu.register_tool(
        name="Podcast_to_Shorts_AI",
        tool_class=PodcastToShortsAITool,
        tool_spec=TOOL_DEFINITION
    )
    
    print("✅ Podcast to Shorts AI registered with ToolUniverse!")
    return tu

if __name__ == "__main__":
    tu = register_podcast_to_shorts_tool()
    
    # Test discovery
    tools = tu.run({
        "name": "Tool_Finder_Keyword",
        "arguments": {
            "description": "convert podcast to youtube shorts",
            "limit": 10
        }
    })
    
    print(f"Found {len(tools)} related tools")
```

---

### Phase 2: MCP Server Integration (Week 1-2)

#### Step 1: Create MCP Server

**File:** `mcp_server.py`

```python
"""
MCP Server for Podcast to Shorts AI
Enables Claude Desktop integration
"""

from mcp.server import Server
from mcp.types import Tool, TextContent
from tooluniverse_wrapper import PodcastToShortsAITool

app = Server("podcast-to-shorts-ai")

tool_wrapper = PodcastToShortsAITool()

@app.list_tools()
async def list_tools() -> list[Tool]:
    """List available tools"""
    return [
        Tool(
            name="podcast_to_shorts",
            description="Convert podcast episodes to YouTube Shorts automatically",
            inputSchema={
                "type": "object",
                "properties": {
                    "audio_file": {
                        "type": "string",
                        "description": "Path to audio file"
                    },
                    "max_shorts": {
                        "type": "integer",
                        "description": "Number of Shorts to generate",
                        "default": 5
                    }
                },
                "required": ["audio_file"]
            }
        )
    ]

@app.call_tool()
async def call_tool(name: str, arguments: dict) -> list[TextContent]:
    """Execute tool"""
    if name == "podcast_to_shorts":
        results = tool_wrapper.run(arguments)
        return [
            TextContent(
                type="text",
                text=f"✅ Generated {len(results['shorts_scripts'])} Shorts scripts!\n\n"
                     f"Output directory: {results['output_dir']}\n\n"
                     f"Review the scripts in the output directory."
            )
        ]
    else:
        raise ValueError(f"Unknown tool: {name}")

if __name__ == "__main__":
    import asyncio
    from mcp.server.stdio import stdio_server
    
    async def main():
        async with stdio_server() as (read_stream, write_stream):
            await app.run(read_stream, write_stream)
    
    asyncio.run(main())
```

#### Step 2: Configure Claude Desktop

**File:** `claude_desktop_config.json`

```json
{
  "mcpServers": {
    "podcast-to-shorts-ai": {
      "command": "python",
      "args": ["/path/to/mcp_server.py"],
      "env": {
        "OPENAI_API_KEY": "${OPENAI_API_KEY}"
      }
    }
  }
}
```

**Location:** `~/Library/Application Support/Claude/claude_desktop_config.json` (Mac)

---

### Phase 3: Documentation Integration (Week 2)

#### Step 1: Adapt Sphinx Config

**File:** `docs/conf_tooluniverse.py`

```python
# Based on ToolUniverse's docs/conf.py

extensions = [
    'sphinx.ext.autodoc',
    'sphinx.ext.viewcode',
    'sphinx.ext.napoleon',
    'myst_parser',
]

# Add ToolUniverse-style documentation
html_theme = 'sphinx_rtd_theme'
```

#### Step 2: Generate Tool Reference

**File:** `docs/generate_tool_reference.py`

```python
"""
Generate tool reference documentation
Based on ToolUniverse's doc generation
"""

from tooluniverse_wrapper import TOOL_DEFINITION

def generate_tool_reference():
    """Generate tool reference docs"""
    # Use ToolUniverse patterns
    # Generate API reference
    # Create examples
    pass
```

---

## 🧪 Testing Integration

### Test 1: Tool Discovery

```python
from tooluniverse import ToolUniverse

tu = ToolUniverse()
tu.load_tools()

# Discover Podcast to Shorts AI
tools = tu.run({
    "name": "Tool_Finder_Keyword",
    "arguments": {
        "description": "convert podcast to youtube shorts",
        "limit": 10
    }
})

assert "Podcast_to_Shorts_AI" in [t["name"] for t in tools]
```

### Test 2: Tool Execution

```python
from tooluniverse_wrapper import PodcastToShortsAITool

tool = PodcastToShortsAITool()
results = tool.run({
    "audio_file": "test_podcast.mp3",
    "max_shorts": 5
})

assert results["success"] == True
assert len(results["shorts_scripts"]) == 5
```

### Test 3: MCP Integration

```bash
# Test MCP server
python mcp_server.py

# Should respond to MCP protocol
```

---

## 📋 Integration Checklist

### Week 1:
- [ ] Create tool definition
- [ ] Create tool wrapper
- [ ] Register with ToolUniverse
- [ ] Test tool discovery
- [ ] Test tool execution

### Week 2:
- [ ] Create MCP server
- [ ] Configure Claude Desktop
- [ ] Test Claude integration
- [ ] Adapt documentation
- [ ] Generate tool reference

### Week 3:
- [ ] Test end-to-end
- [ ] Document integration
- [ ] Create examples
- [ ] Deploy

---

## 🎯 Success Criteria

- ✅ Tool discoverable via ToolUniverse
- ✅ Works with Claude Desktop
- ✅ Natural language queries work
- ✅ Documentation integrated
- ✅ Examples provided

---

## 📚 Resources

- ToolUniverse Docs: https://zitniklab.hms.harvard.edu/ToolUniverse/
- MCP Protocol: https://modelcontextprotocol.io/
- ToolUniverse GitHub: https://github.com/AvaTar-ArTs/ToolUniverse

---

**Ready to integrate!** 🚀
