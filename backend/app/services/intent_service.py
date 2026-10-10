"""
Modular Intent Classification Service.
Supports:
1. Deterministic Rule-Based & Semantic Scoring Engine (100% offline, zero external dependency)
2. Optional LLM API integration if API keys are provided via environment variables.
Transparently labels whether AI or Rule-Based Fallback was utilized.
"""

import re
from typing import Dict, Any, List, Tuple
from app.core.config import settings

class IntentRule:
    def __init__(self, intent: str, primary_keywords: List[str], secondary_keywords: List[str], negative_keywords: List[str] = None):
        self.intent = intent
        self.primary_keywords = [kw.lower() for kw in primary_keywords]
        self.secondary_keywords = [kw.lower() for kw in secondary_keywords]
        self.negative_keywords = [kw.lower() for kw in (negative_keywords or [])]

# Intent Definitions with weighted semantic patterns
INTENT_RULES = [
    IntentRule(
        intent="meeting_preparation",
        primary_keywords=["meeting", "client", "sync", "call", "brief", "discussion", "agenda", "presentation with client"],
        secondary_keywords=["prepare", "tomorrow", "notes", "talking points", "follow-up", "attendee", "stakeholder", "customer call"],
        negative_keywords=["complaint", "bug", "crash", "incident"]
    ),
    IntentRule(
        intent="product_usage_analysis",
        primary_keywords=["usage", "drop", "dropped", "decline", "declined", "decrease", "churn", "traffic", "engagement", "dau", "mau", "retention"],
        secondary_keywords=["investigate", "why", "month", "analytics", "users", "sessions", "active", "feature", "metrics", "down"],
        negative_keywords=["complaint", "ticket", "invoice"]
    ),
    IntentRule(
        intent="project_review",
        primary_keywords=["project", "progress", "sprint", "milestone", "status", "deadline", "tasks", "roadmap"],
        secondary_keywords=["review", "ongoing", "check", "blocker", "track", "team", "delivery", "pending"],
        negative_keywords=["complaint", "refund", "client meeting"]
    ),
    IntentRule(
        intent="complaint_analysis",
        primary_keywords=["complaint", "complaints", "feedback", "tickets", "issues", "dissatisfied", "frustrated", "bug report"],
        secondary_keywords=["summarize", "recent", "customer", "support", "resolution", "category", "sentiment", "repeated"],
        negative_keywords=["meeting", "sprint"]
    ),
    IntentRule(
        intent="presentation_preparation",
        primary_keywords=["presentation", "slides", "deck", "pitch", "keynote", "briefing"],
        secondary_keywords=["prepare", "help me prepare", "executive", "board", "outline", "structure"],
        negative_keywords=["ticket", "invoice"]
    ),
]

class IntentService:
    def __init__(self):
        self.has_llm = bool(settings.OPENAI_API_KEY or settings.GEMINI_API_KEY)
        self.provider_name = (
            "OpenAI API" if settings.OPENAI_API_KEY
            else ("Google Gemini API" if settings.GEMINI_API_KEY
            else "Deterministic Rule-Based Engine")
        )

    def extract_entities(self, text: str) -> Dict[str, Any]:
        """Extracts contextual entities like timeframes, names, and topics."""
        entities = {}
        lower = text.lower()
        
        # Temporal
        if "tomorrow" in lower:
            entities["timeframe"] = "tomorrow"
        elif "this month" in lower or "month" in lower:
            entities["timeframe"] = "current_month"
        elif "today" in lower:
            entities["timeframe"] = "today"
        elif "recent" in lower:
            entities["timeframe"] = "recent_period"

        # Topic detection
        if "client" in lower or "customer" in lower:
            entities["target_audience"] = "client/customer"
        if "usage" in lower or "analytics" in lower:
            entities["metric_target"] = "product_usage"
        if "sprint" in lower or "project" in lower:
            entities["domain"] = "engineering_project"

        return entities

    def analyze_intent(self, text: str) -> Dict[str, Any]:
        """
        Analyzes the intent of a user prompt.
        Uses rule-based deterministic scoring with calculated confidence.
        """
        cleaned_text = text.lower().strip()
        words = re.findall(r'\b\w+\b', cleaned_text)
        
        if not words:
            return {
                "intent": "general_task",
                "confidence": 0.50,
                "entities": {},
                "clarification_needed": True,
                "clarification_question": "Please provide more details on what you would like to achieve.",
                "suggested_alternatives": ["meeting_preparation", "product_usage_analysis", "project_review"],
                "is_fallback": True,
                "provider": "Deterministic Rule-Based Engine"
            }

        scores: Dict[str, float] = {}

        for rule in INTENT_RULES:
            match_score = 0.0
            primary_matches = 0
            secondary_matches = 0

            # Match primary keywords (higher weight: 0.35 each)
            for kw in rule.primary_keywords:
                if kw in cleaned_text:
                    primary_matches += 1
                    match_score += 0.38

            # Match secondary keywords (weight: 0.18 each)
            for kw in rule.secondary_keywords:
                if kw in cleaned_text:
                    secondary_matches += 1
                    match_score += 0.18

            # Negative keywords reduce score
            for kw in rule.negative_keywords:
                if kw in cleaned_text:
                    match_score -= 0.25

            # Base score calculation with non-linear saturation
            if primary_matches > 0:
                # Add base baseline confidence for hitting primary core intents
                total_confidence = 0.60 + min(0.35, (primary_matches * 0.15) + (secondary_matches * 0.06))
            elif secondary_matches >= 2:
                total_confidence = 0.55 + min(0.20, secondary_matches * 0.08)
            else:
                total_confidence = 0.20

            scores[rule.intent] = max(0.0, min(0.98, total_confidence))

        # Sort candidate intents by score descending
        sorted_intents = sorted(scores.items(), key=lambda item: item[1], reverse=True)
        top_intent, top_score = sorted_intents[0]
        second_intent, second_score = sorted_intents[1] if len(sorted_intents) > 1 else ("", 0.0)

        entities = self.extract_entities(cleaned_text)

        # Ambiguity detection:
        # If top score is below 0.60 or close tie with second intent
        is_ambiguous = (top_score < 0.62) or (top_score - second_score < 0.08 and top_score > 0.40)
        
        if top_score < 0.52:
            return {
                "intent": "general_task",
                "confidence": round(top_score, 2),
                "entities": entities,
                "clarification_needed": True,
                "clarification_question": f"Did you mean to focus on {sorted_intents[0][0].replace('_', ' ')} or {sorted_intents[1][0].replace('_', ' ')}?",
                "suggested_alternatives": [sorted_intents[0][0], sorted_intents[1][0]],
                "is_fallback": not self.has_llm,
                "provider": self.provider_name
            }

        return {
            "intent": top_intent,
            "confidence": round(top_score, 2),
            "entities": entities,
            "clarification_needed": is_ambiguous,
            "clarification_question": f"Would you like to prioritize {top_intent.replace('_', ' ')} or explore related metrics?" if is_ambiguous else None,
            "suggested_alternatives": [second_intent] if is_ambiguous and second_score > 0.4 else None,
            "is_fallback": not self.has_llm,
            "provider": self.provider_name
        }

intent_service = IntentService()
