import asyncio
import os
from typing import AsyncIterator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from google.antigravity import Agent, LocalAgentConfig

app = FastAPI(title="POLY Agent API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SYSTEM_PROMPT = """You are POLY, an autonomous software agent.
Be concise and action-oriented. Inspect the workspace before making assumptions.
Explain progress through short status messages. Never expose private chain-of-thought;
only provide concise summaries of reasoning, tool activity, and results.
"""


class ChatRequest(BaseModel):
    message: str


async def stream_agent(message: str) -> AsyncIterator[str]:
    config = LocalAgentConfig(system_instruction=SYSTEM_PROMPT)
    async with Agent(config) as agent:
        response = await agent.chat(message)
        text = await response.text()
        for chunk in text.splitlines() or [text]:
            yield f"data: {chunk}\n\n"
            await asyncio.sleep(0)
        yield "data: [DONE]\n\n"


@app.get("/health")
async def health():
    return {"status": "ok", "agent": "poly"}


@app.post("/chat")
async def chat(request: ChatRequest):
    return StreamingResponse(stream_agent(request.message), media_type="text/event-stream")
