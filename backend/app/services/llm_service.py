"""
LLM Service for SmartSpace AI.
Modular AI assistant powered by Google Gemini (default) or OpenAI.
Provider is selected via AI_PROVIDER environment variable.
API keys are NEVER logged, returned to frontend, or exposed in any response.
"""

import os
import time
from typing import Optional
from app.core.config import settings

# ─────────────────────────────────────────────────────────────────────────────
# SmartSpace AI System Prompt
# Context-rich so the LLM understands the full application without hallucinating
# ─────────────────────────────────────────────────────────────────────────────

SYSTEM_PROMPT = """
You are the SmartSpace AI Assistant — an intelligent, context-aware AI built into
the SmartSpace AI (Intent-to-Interface: Adaptive AI Workspace) application.

## About SmartSpace AI
SmartSpace AI is an adaptive full-stack workspace application that detects a user's
natural language goal and dynamically reconfigures its UI widgets, analytics charts,
risk registers, and recommended action plans to match that exact goal.

Key features:
- Intelligent Command Bar: Users type or speak a goal in natural language.
- Adaptive Layout Engine: Dynamically selects, sizes, and explains widgets.
- 4 built-in demo scenarios:
  1. Client Meeting Preparation – Client overview, SLA risks, meeting briefs.
  2. Product Usage Decline Investigation – Telemetry charts, feature adoption.
  3. Project Progress Review – Sprint velocity, burndown, task CRUD.
  4. Customer Complaints Summary – 142-ticket synthesis, remediation plans.
- Persistent storage via PostgreSQL (Supabase) + SQLAlchemy ORM.
- Full CRUD task history and saved workspaces.
- Light/dark mode, widget hide/restore controls.
- FastAPI backend + React 19 + TypeScript + Tailwind CSS + Framer Motion frontend.

## Your Role as AI Assistant
- Answer user questions about how SmartSpace AI works.
- Help users navigate and use features effectively.
- Provide clear, actionable, context-aware answers.
- Use database context when provided — NEVER fabricate data not given to you.
- When information is unavailable, say clearly: "I don't have that information available right now."
- NEVER reveal API keys, database passwords, connection strings, tokens, or any secrets.
- NEVER expose internal implementation details that are security-sensitive.
- Be concise, professional, and helpful.
- Format responses clearly using markdown-style text when useful.

## Boundaries
- Do not make up tasks, users, metrics, or workspace data that was not explicitly provided.
- If database context is given in the user message, use ONLY that context.
- If asked for something outside SmartSpace AI, politely redirect to relevant features.
"""

# ─────────────────────────────────────────────────────────────────────────────
# Provider Registry — Add new providers here without touching endpoint logic
# ─────────────────────────────────────────────────────────────────────────────

class LLMError(Exception):
    """Custom exception for LLM errors with safe, non-sensitive messages."""
    def __init__(self, message: str, status_code: int = 500):
        self.message = message
        self.status_code = status_code
        super().__init__(message)


class GeminiProvider:
    """Google Gemini AI provider using google-generativeai SDK."""

    def __init__(self):
        self._client = None
        self._model_name = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")

    def _get_client(self):
        if self._client is None:
            api_key = settings.GEMINI_API_KEY
            if not api_key:
                raise LLMError(
                    "Gemini API key is not configured. Please set GEMINI_API_KEY in your environment.",
                    status_code=503
                )
            try:
                import google.generativeai as genai
                genai.configure(api_key=api_key)
                self._client = genai.GenerativeModel(
                    model_name=self._model_name,
                    system_instruction=SYSTEM_PROMPT
                )
            except ImportError:
                raise LLMError(
                    "google-generativeai package is not installed. Run: pip install google-generativeai",
                    status_code=503
                )
        return self._client

    def chat(self, message: str, context: Optional[str] = None) -> str:
        client = self._get_client()

        # Build the full user message with optional DB context
        full_message = message
        if context:
            full_message = (
                f"[DATABASE CONTEXT — use this data to answer the question below]\n"
                f"{context}\n\n"
                f"[USER QUESTION]\n{message}"
            )

        try:
            response = client.generate_content(
                full_message,
                generation_config={
                    "max_output_tokens": 1024,
                    "temperature": 0.7,
                }
            )
            if not response.text:
                raise LLMError("The AI returned an empty response. Please try again.", 502)
            return response.text.strip()

        except LLMError:
            raise
        except Exception as e:
            err_str = str(e).lower()
            if "quota" in err_str or "rate" in err_str or "429" in err_str:
                raise LLMError(
                    "Rate limit reached. Please wait a moment and try again.",
                    status_code=429
                )
            elif "timeout" in err_str or "deadline" in err_str:
                raise LLMError(
                    "The AI request timed out. Please try again.",
                    status_code=504
                )
            elif "api_key" in err_str or "auth" in err_str or "invalid" in err_str:
                raise LLMError(
                    "AI service authentication failed. Please check your API key configuration.",
                    status_code=401
                )
            else:
                raise LLMError(
                    "AI service encountered an unexpected error. Please try again later.",
                    status_code=502
                )


class OpenAIProvider:
    """OpenAI provider — swap to this by setting AI_PROVIDER=openai in .env"""

    def __init__(self):
        self._client = None
        self._model_name = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

    def _get_client(self):
        if self._client is None:
            api_key = settings.OPENAI_API_KEY
            if not api_key:
                raise LLMError(
                    "OpenAI API key is not configured. Please set OPENAI_API_KEY in your environment.",
                    status_code=503
                )
            try:
                from openai import OpenAI
                self._client = OpenAI(api_key=api_key)
            except ImportError:
                raise LLMError(
                    "openai package is not installed. Run: pip install openai",
                    status_code=503
                )
        return self._client

    def chat(self, message: str, context: Optional[str] = None) -> str:
        client = self._get_client()

        full_message = message
        if context:
            full_message = (
                f"[DATABASE CONTEXT — use this data to answer the question below]\n"
                f"{context}\n\n"
                f"[USER QUESTION]\n{message}"
            )

        try:
            response = client.chat.completions.create(
                model=self._model_name,
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": full_message}
                ],
                max_tokens=1024,
                temperature=0.7
            )
            answer = response.choices[0].message.content
            if not answer:
                raise LLMError("The AI returned an empty response. Please try again.", 502)
            return answer.strip()

        except LLMError:
            raise
        except Exception as e:
            err_str = str(e).lower()
            if "rate" in err_str or "429" in err_str:
                raise LLMError("Rate limit reached. Please wait a moment and try again.", 429)
            elif "timeout" in err_str:
                raise LLMError("The AI request timed out. Please try again.", 504)
            elif "auth" in err_str or "invalid" in err_str or "api_key" in err_str:
                raise LLMError("AI service authentication failed. Please check your API key.", 401)
            else:
                raise LLMError("AI service encountered an unexpected error. Please try again later.", 502)


# ─────────────────────────────────────────────────────────────────────────────
# LLMService: Provider factory — change AI_PROVIDER env var to swap models
# ─────────────────────────────────────────────────────────────────────────────

class LLMService:
    """
    Modular LLM service. Switch providers via AI_PROVIDER environment variable.
    Supported: 'gemini' (default), 'openai'
    """

    def __init__(self):
        self._provider = None

    def _get_provider(self):
        if self._provider is None:
            provider_name = os.getenv("AI_PROVIDER", "gemini").lower().strip()
            if provider_name == "openai":
                self._provider = OpenAIProvider()
            else:
                self._provider = GeminiProvider()
        return self._provider

    def chat(self, message: str, context: Optional[str] = None) -> str:
        """
        Send a message to the configured LLM provider.
        Optionally attach sanitized database context.
        Returns the AI response as a plain string.
        """
        provider = self._get_provider()
        return provider.chat(message=message, context=context)

    def is_configured(self) -> bool:
        """Check if an API key is configured for the selected provider."""
        provider_name = os.getenv("AI_PROVIDER", "gemini").lower().strip()
        if provider_name == "openai":
            return bool(settings.OPENAI_API_KEY)
        return bool(settings.GEMINI_API_KEY)

    def get_provider_name(self) -> str:
        provider_name = os.getenv("AI_PROVIDER", "gemini").lower().strip()
        if provider_name == "openai":
            return f"OpenAI ({os.getenv('OPENAI_MODEL', 'gpt-4o-mini')})"
        return f"Google Gemini ({os.getenv('GEMINI_MODEL', 'gemini-1.5-flash')})"


# Singleton instance — import and use this throughout the app
llm_service = LLMService()
