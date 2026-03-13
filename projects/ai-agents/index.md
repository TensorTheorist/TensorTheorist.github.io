# AI Agent Framework

*Category: AI*
*GitHub: https://github.com/TensorTheorist/ai-agents*
*Technologies: Python, LangChain, OpenAI, Redis*

Build autonomous AI agents with tool use and multi-step reasoning.

## Agent Types

- **ReAct Agent** - Reasoning + Acting
- **Plan-and-Execute** - Planning before execution
- **Tool-Augmented** - Agents with external tools

## Quick Start

```python
from agents import Agent, Tool

# Define tools
@Tool
def search_web(query: str) -> str:
    """Search the web for information."""
    return web_search(query)

@Tool
def calculate(expression: str) -> float:
    """Evaluate a mathematical expression."""
    return eval(expression)

# Create agent
agent = Agent(
    model="gpt-4",
    tools=[search_web, calculate],
    memory="redis://localhost:6379"
)

# Run
result = agent.run(
    "What is the population of France multiplied by 2?"
)
```

## Memory Systems

- **Short-term**: Conversation buffer
- **Long-term**: Vector store for semantic retrieval
- **Working memory**: Scratchpad for reasoning

## Agent Architecture

```
┌─────────────────────────────────────────┐
│              Agent Core                 │
├─────────────────────────────────────────┤
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  │
│  │ Planner │  │Executor │  │ Memory  │  │
│  └────┬────┘  └────┬────┘  └────┬────┘  │
│       │            │            │       │
│       └───────────-┼────────────┘       │
│                    │                    │
├─────────────────────────────────────────┤
│              Tool Registry              │
│  [Search] [Calculate] [Code] [API]      │
└─────────────────────────────────────────┘
```

## Custom Tool Creation

```python
from agents import Tool, ToolResult

@Tool(
    name="database_query",
    description="Execute SQL queries on the database",
    parameters={
        "query": {"type": "string", "description": "SQL query"}
    }
)
def database_query(query: str) -> ToolResult:
    result = db.execute(query)
    return ToolResult(
        success=True,
        data=result.fetchall()
    )
```
