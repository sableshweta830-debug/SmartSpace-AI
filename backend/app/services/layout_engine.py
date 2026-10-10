"""
Adaptive Layout Engine.
Selects, prioritizes, sizes, and explains UI components based on detected user intent.
"""

from typing import Dict, Any, List, Tuple
from app.schemas.schemas import WidgetConfig

# Layout blueprints for each supported intent
INTENT_LAYOUT_BLUEPRINTS: Dict[str, Dict[str, Any]] = {
    "meeting_preparation": {
        "title": "Prepare for Client Meeting",
        "summary": "Review client profile, recent communications, SLA commitments, and high-priority discussion topics.",
        "widgets": [
            {
                "id": "w_client_overview",
                "type": "ClientOverviewWidget",
                "title": "Client Overview & Account Status",
                "priority": 1,
                "size": "large",
                "category": "relationship",
                "description": "Key client metadata, contract size, and active project health.",
                "explanation": "Client Overview is displayed to provide essential background context on the account, tier, and relationship health."
            },
            {
                "id": "w_recent_communications",
                "type": "CommunicationWidget",
                "title": "Recent Communications",
                "priority": 2,
                "size": "medium",
                "category": "communication",
                "description": "Latest emails, threads, and pending response actions.",
                "explanation": "Recent Communications is displayed because reviewing client discussions and unanswered questions prevents surprises during the meeting."
            },
            {
                "id": "w_meeting_notes",
                "type": "MeetingNotesWidget",
                "title": "Previous Meeting Summary & Follow-ups",
                "priority": 3,
                "size": "medium",
                "category": "history",
                "description": "Decisions and follow-up commitments from the last session.",
                "explanation": "Previous Meeting Summary is displayed so you can follow up on past commitments and demonstrate accountability."
            },
            {
                "id": "w_open_issues",
                "type": "OpenIssuesWidget",
                "title": "Open Issues & SLA Risks",
                "priority": 4,
                "size": "medium",
                "category": "risks",
                "description": "Active support tickets, latency incidents, and status.",
                "explanation": "Open Issues is displayed to highlight technical blockers and SLA concerns before speaking with the stakeholder."
            },
            {
                "id": "w_talking_points",
                "type": "TalkingPointsWidget",
                "title": "Suggested Talking Points",
                "priority": 5,
                "size": "large",
                "category": "strategy",
                "description": "Tailored talking points, risk responses, and questions to ask.",
                "explanation": "Suggested Talking Points are generated to structure the discussion toward strategic value and contract renewal."
            },
            {
                "id": "w_recommended_actions",
                "type": "RecommendedActionsWidget",
                "title": "Meeting Preparation Checklist",
                "priority": 6,
                "size": "medium",
                "category": "actions",
                "description": "Interactive action checklist and meeting brief generator.",
                "explanation": "Recommended Actions provides actionable verification items and quick brief generation before the call starts."
            }
        ],
        "overall_explanation": "These components were arranged to give you a complete 360-degree briefing on Acme Global Solutions: account status first, recent interactions and SLA issues second, followed by talking points and an actionable checklist.",
        "available_info": [
            "Contract renewal date and ACV ($420k)",
            "Email threads from Sarah Jenkins (VP Tech)",
            "SLA latency ticket details & Redis remediation status",
            "Previous meeting decisions from Sept 28"
        ],
        "missing_info": [
            "Live attendee calendar RSVPs",
            "Legal counsel notes on procurement contract addendum"
        ],
        "recommended_next_step": "Click 'Generate Sample Meeting Brief' and confirm the 2:00 PM agenda with Sarah Jenkins."
    },

    "product_usage_analysis": {
        "title": "Investigate Product Usage Decline",
        "summary": "Deep-dive into 30-day telemetry, drop-off timelines, feature adoption trends, and root-cause hypotheses.",
        "widgets": [
            {
                "id": "w_usage_overview",
                "type": "MetricCard",
                "title": "Usage Overview & MoM Variance",
                "priority": 1,
                "size": "full",
                "category": "metrics",
                "description": "DAU, monthly session volume, and engagement variance metrics.",
                "explanation": "Usage Overview is placed at the top to immediately quantify the exact scale and severity of the usage decline."
            },
            {
                "id": "w_usage_trend",
                "type": "LineChartWidget",
                "title": "Usage Trend Timeline (30 Days)",
                "priority": 2,
                "size": "large",
                "category": "analytics",
                "description": "Daily active user trajectory compared to historical baseline.",
                "explanation": "Usage Trends is displayed because comparing daily activity against baseline pinpoints the exact date (Day 14) the drop began."
            },
            {
                "id": "w_feature_adoption",
                "type": "BarChartWidget",
                "title": "Feature Adoption Breakdown",
                "priority": 3,
                "size": "medium",
                "category": "features",
                "description": "Adoption rates of top-used vs under-utilized product capabilities.",
                "explanation": "Feature Adoption helps isolate whether the drop is widespread across the app or concentrated in specific capabilities."
            },
            {
                "id": "w_potential_causes",
                "type": "ExplanationPanel",
                "title": "Potential Causes & Hypotheses",
                "priority": 4,
                "size": "medium",
                "category": "diagnostics",
                "description": "Measured release anomalies vs AI-generated hypotheses.",
                "explanation": "Potential Causes presents diagnostic hypotheses correlating release v2.4 deployment with navigation drop-offs."
            },
            {
                "id": "w_segment_analysis",
                "type": "PieChartWidget",
                "title": "Cohort & Segment Breakdown",
                "priority": 5,
                "size": "medium",
                "category": "segments",
                "description": "Usage drop impact across Enterprise, SMB, and Self-serve cohorts.",
                "explanation": "Segment Analysis reveals that Self-serve users experienced the steepest drop (-31.4%) while Enterprise stayed stable (-4.2%)."
            },
            {
                "id": "w_recommended_actions",
                "type": "RecommendedActionsWidget",
                "title": "Investigation Action Plan",
                "priority": 6,
                "size": "medium",
                "category": "actions",
                "description": "Recommended diagnostic steps, logs audits, and A/B rollback tests.",
                "explanation": "Investigation Action Plan guides your next analytical steps to validate the hypotheses."
            }
        ],
        "overall_explanation": "The workspace prioritizes quantitative telemetry and time-series charts to locate the drop date, followed by feature and cohort breakdowns, root-cause hypotheses, and investigation actions.",
        "available_info": [
            "30-day DAU and session event stream telemetry",
            "v2.4 deployment timestamp correlation",
            "EU cluster auth latency error logs",
            "User cohort segmentation data"
        ],
        "missing_info": [
            "Direct user exit survey qualitative feedback",
            "Competitor pricing or market movement logs"
        ],
        "recommended_next_step": "Audit navigation bounce rates for the v2.4 release and check EU auth latency cluster fix."
    },

    "project_review": {
        "title": "Review Ongoing Project Progress",
        "summary": "Track milestone completion rate, task distribution, critical blockers, and team activity for Nova Core Platform.",
        "widgets": [
            {
                "id": "w_project_progress",
                "type": "ProjectProgressWidget",
                "title": "Project Health & Completion Progress",
                "priority": 1,
                "size": "large",
                "category": "progress",
                "description": "Overall velocity, target delivery timeline, and milestone burnup.",
                "explanation": "Project Health is positioned first to give a fast snapshot of velocity and overall completion percentage (68%)."
            },
            {
                "id": "w_task_distribution",
                "type": "PieChartWidget",
                "title": "Task Status Distribution",
                "priority": 2,
                "size": "medium",
                "category": "tasks",
                "description": "Ratio of completed, in-progress, todo, and blocked tasks.",
                "explanation": "Task Status Distribution visualizes workload balance and immediately alerts to blocked items."
            },
            {
                "id": "w_deadlines",
                "type": "DeadlineWidget",
                "title": "Upcoming Milestone Deadlines",
                "priority": 3,
                "size": "medium",
                "category": "schedule",
                "description": "Countdown to code freezes, pen tests, and staging sign-offs.",
                "explanation": "Upcoming Deadlines keeps time-sensitive sprint milestones visible to prevent delivery slippage."
            },
            {
                "id": "w_task_list",
                "type": "TaskListWidget",
                "title": "Interactive Project Tasks",
                "priority": 4,
                "size": "large",
                "category": "execution",
                "description": "Database-backed tasks with real-time status toggling.",
                "explanation": "Interactive Task List lets you manage and update live sprint tasks directly from the workspace."
            },
            {
                "id": "w_blockers",
                "type": "OpenIssuesWidget",
                "title": "Active Blockers & High Risks",
                "priority": 5,
                "size": "medium",
                "category": "risks",
                "description": "Technical impediments, replication lag, and vendor dependencies.",
                "explanation": "Active Blockers is displayed prominently to bring immediate attention to items stopping team momentum."
            },
            {
                "id": "w_recommended_actions",
                "type": "RecommendedActionsWidget",
                "title": "Sprint Next Actions",
                "priority": 6,
                "size": "medium",
                "category": "actions",
                "description": "Priority engineering actions to maintain sprint delivery velocity.",
                "explanation": "Sprint Next Actions provides targeted priorities to resolve impediments and prepare for code freeze."
            }
        ],
        "overall_explanation": "Arranged to give engineering and product leads an immediate health check, sprint burndown, critical blockers, and interactive task management with persistent database synchronization.",
        "available_info": [
            "Nova Core Platform 68% completion metrics",
            "Sprint 14 deadline calendar and days remaining",
            "PostgreSQL replication lag blocker status",
            "Live interactive task list synced with SQLite"
        ],
        "missing_info": [
            "External vendor SLA guarantee on payment gateway sandbox update"
        ],
        "recommended_next_step": "Resolve PostgreSQL replica replication lag before the Sprint 14 code freeze on Oct 16."
    },

    "complaint_analysis": {
        "title": "Summarize Customer Complaints",
        "summary": "Analyze 142 support tickets, recurring churn drivers, priority breakdowns, and recommended service remediations.",
        "widgets": [
            {
                "id": "w_complaint_overview",
                "type": "ComplaintSummaryWidget",
                "title": "Customer Complaints Overview",
                "priority": 1,
                "size": "large",
                "category": "overview",
                "description": "Volume of tickets, resolution SLA, and customer satisfaction rating.",
                "explanation": "Complaint Overview summarizes volume (142 tickets) and key customer experience indices."
            },
            {
                "id": "w_complaint_categories",
                "type": "BarChartWidget",
                "title": "Complaint Categories & Distribution",
                "priority": 2,
                "size": "medium",
                "category": "categories",
                "description": "Billing, Webhook timeouts, Latency, and Login tickets.",
                "explanation": "Complaint Categories breaks down ticket frequency by operational department."
            },
            {
                "id": "w_repeated_issues",
                "type": "TalkingPointsWidget",
                "title": "Repeated Pain Points & Root Causes",
                "priority": 3,
                "size": "large",
                "category": "patterns",
                "description": "Top recurring issues, customer sentiment, and underlying triggers.",
                "explanation": "Repeated Pain Points isolates systemic issues like dropped Stripe billing alerts and webhook 504 timeouts."
            },
            {
                "id": "w_recommended_actions",
                "type": "RecommendedActionsWidget",
                "title": "Recommended Support Remediations",
                "priority": 4,
                "size": "medium",
                "category": "actions",
                "description": "Engineering and support team action items to eliminate recurring churn.",
                "explanation": "Recommended Remediations provides concrete fixes to resolve 62% of repetitive support volume."
            }
        ],
        "overall_explanation": "Arranged to highlight root causes and recurring friction, showing categorical distributions and specific engineering remediations.",
        "available_info": [
            "142 categorized customer complaint records",
            "Stripe billing webhook failure recurrence logs",
            "Resolution SLA averages and satisfaction ratings"
        ],
        "missing_info": [
            "Customer churn exit interviews for cancelled subscriptions"
        ],
        "recommended_next_step": "Deploy webhook retry worker with exponential backoff and add in-app 3D-Secure billing prompts."
    },

    "presentation_preparation": {
        "title": "Prepare Project Presentation",
        "summary": "Structure slide narrative, extract key performance metrics, and build executive presentation outline.",
        "widgets": [
            {
                "id": "w_presentation_overview",
                "type": "ClientOverviewWidget",
                "title": "Presentation Overview & Audience Brief",
                "priority": 1,
                "size": "medium",
                "category": "overview",
                "description": "Executive audience, allocated time, and core narrative goal.",
                "explanation": "Audience Brief establishes the scope and expectations for leadership review."
            },
            {
                "id": "w_presentation_outline",
                "type": "TalkingPointsWidget",
                "title": "Executive Slide Deck Outline",
                "priority": 2,
                "size": "large",
                "category": "outline",
                "description": "Slide-by-slide structure with talking points and key arguments.",
                "explanation": "Slide Outline organizes the 14-slide narrative to drive consensus and budget approval."
            },
            {
                "id": "w_presentation_metrics",
                "type": "MetricCard",
                "title": "Key Metrics to Showcase",
                "priority": 3,
                "size": "medium",
                "category": "metrics",
                "description": "Uptime SLA, ACV growth, and benchmark speedup stats.",
                "explanation": "Key Metrics highlights validated ROI data for executive confidence."
            },
            {
                "id": "w_recommended_actions",
                "type": "RecommendedActionsWidget",
                "title": "Presentation Checklist",
                "priority": 4,
                "size": "medium",
                "category": "actions",
                "description": "Rehearsal, slide deck review, and data export tasks.",
                "explanation": "Checklist provides structured steps before presenting to executive leadership."
            }
        ],
        "overall_explanation": "Configured to help build a compelling executive presentation with slide outline, verified metrics, and speaker checklist.",
        "available_info": [
            "14-slide presentation structure and audience profile",
            "Verified metrics (99.98% uptime, $420k ACV, 42% speedup)"
        ],
        "missing_info": [
            "Finance director sign-off on Q1 budget estimates"
        ],
        "recommended_next_step": "Export benchmark latency graphics and rehearse 15-minute dry-run."
    },

    "general_task": {
        "title": "Dynamic Adaptive Workspace",
        "summary": "A balanced workspace configured for versatile task planning and project monitoring.",
        "widgets": [
            {
                "id": "w_project_progress",
                "type": "ProjectProgressWidget",
                "title": "Active Project Snapshot",
                "priority": 1,
                "size": "large",
                "category": "progress",
                "description": "Current platform velocity and milestone progress.",
                "explanation": "Displayed to keep your core project goals visible while addressing miscellaneous tasks."
            },
            {
                "id": "w_task_list",
                "type": "TaskListWidget",
                "title": "Action Tasks",
                "priority": 2,
                "size": "medium",
                "category": "execution",
                "description": "Manage and track action items.",
                "explanation": "TaskListWidget allows immediate task creation and status tracking."
            },
            {
                "id": "w_deadlines",
                "type": "DeadlineWidget",
                "title": "Upcoming Deadlines",
                "priority": 3,
                "size": "medium",
                "category": "schedule",
                "description": "Approaching milestones and deliveries.",
                "explanation": "DeadlineWidget keeps imminent dates in view."
            },
            {
                "id": "w_recommended_actions",
                "type": "RecommendedActionsWidget",
                "title": "Suggested Next Actions",
                "priority": 4,
                "size": "medium",
                "category": "actions",
                "description": "Recommended focus actions.",
                "explanation": "Recommended Actions provides helpful starting steps."
            }
        ],
        "overall_explanation": "This general configuration provides essential project monitoring and task management widgets.",
        "available_info": ["Platform health overview", "Active sprint task list"],
        "missing_info": ["Specific task domain or detailed query requirements"],
        "recommended_next_step": "Try a more specific prompt or select one of the suggested demo scenarios."
    }
}

class LayoutEngine:
    def generate_layout(self, intent: str, confidence: float) -> Tuple[str, str, List[WidgetConfig], str, Dict[str, str], List[str], List[str], str]:
        """
        Generates layout configuration for the specified intent.
        Returns:
            task_title, summary, widgets, overall_explanation, explanations_per_widget, available_info, missing_info, recommended_next_step
        """
        blueprint = INTENT_LAYOUT_BLUEPRINTS.get(intent, INTENT_LAYOUT_BLUEPRINTS["general_task"])
        
        task_title = blueprint["title"]
        summary = blueprint["summary"]
        overall_explanation = blueprint["overall_explanation"]
        available_info = blueprint["available_info"]
        missing_info = blueprint["missing_info"]
        recommended_next_step = blueprint["recommended_next_step"]

        widgets = []
        explanations_per_widget = {}

        for w_data in blueprint["widgets"]:
            config = WidgetConfig(
                id=w_data["id"],
                type=w_data["type"],
                title=w_data["title"],
                priority=w_data["priority"],
                size=w_data.get("size", "medium"),
                category=w_data.get("category", "general"),
                description=w_data.get("description"),
                hidden=False
            )
            widgets.append(config)
            explanations_per_widget[w_data["id"]] = w_data["explanation"]

        return (
            task_title,
            summary,
            widgets,
            overall_explanation,
            explanations_per_widget,
            available_info,
            missing_info,
            recommended_next_step
        )

layout_engine = LayoutEngine()
