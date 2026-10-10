"""
Rich, high-quality, realistic demo datasets for Intent-to-Interface Adaptive AI Workspace.
All data is clearly identified as demo data.
"""

from typing import Dict, Any, List

DEFAULT_DASHBOARD_DATA: Dict[str, Any] = {
    "welcome": {
        "user_name": "Alex Mercer",
        "role": "Product & Engineering Lead",
        "greeting": "Welcome back, Alex. Your adaptive workspace is ready.",
        "subheading": "Tell the workspace what you want to accomplish today, and the entire interface will configure itself to your goal.",
    },
    "quick_stats": [
        {"id": "active_projects", "label": "Active Projects", "value": "4", "change": "+1 this month", "positive": True, "icon": "FolderKanban"},
        {"id": "open_tasks", "label": "Assigned Tasks", "value": "18", "change": "5 due this week", "positive": False, "icon": "CheckSquare"},
        {"id": "team_members", "label": "Active Collaborators", "value": "12", "change": "100% online", "positive": True, "icon": "Users"},
        {"id": "uptime", "label": "System Health", "value": "99.98%", "change": "Normal operational SLA", "positive": True, "icon": "Activity"},
    ],
    "quick_actions": [
        {"id": "action_meeting", "title": "Prepare Client Brief", "prompt": "Prepare for tomorrow's client meeting.", "badge": "Meeting", "icon": "Calendar"},
        {"id": "action_usage", "title": "Analyze Usage Drop", "prompt": "Investigate why product usage dropped this month.", "badge": "Analytics", "icon": "TrendingDown"},
        {"id": "action_project", "title": "Review Sprint Progress", "prompt": "Review the progress of our ongoing project.", "badge": "Project", "icon": "ListTodo"},
        {"id": "action_complaints", "title": "Audit Customer Issues", "prompt": "Summarize recent customer complaints.", "badge": "Support", "icon": "MessageSquareWarning"},
    ],
    "recent_activity": [
        {"id": "act_1", "time": "25 mins ago", "user": "Elena R.", "action": "pushed commit to staging", "project": "Nova Core Platform"},
        {"id": "act_2", "time": "1 hour ago", "user": "Marcus V.", "action": "resolved SLA latency ticket #402", "project": "Acme Integration"},
        {"id": "act_3", "time": "3 hours ago", "user": "Sarah Jenkins", "action": "replied with Q4 budget sign-off", "project": "Acme Global"},
        {"id": "act_4", "time": "Yesterday", "user": "Automated Alert", "action": "detected 18% DAU variance", "project": "Product Analytics"},
    ],
    "sample_analytics_preview": [
        {"name": "Week 1", "activeUsers": 21400, "sessions": 88000, "retention": 68},
        {"name": "Week 2", "activeUsers": 22100, "sessions": 92400, "retention": 71},
        {"name": "Week 3", "activeUsers": 18200, "sessions": 73200, "retention": 54},
        {"name": "Week 4", "activeUsers": 14280, "sessions": 59100, "retention": 41},
    ],
    "suggested_prompts": [
        "Prepare for tomorrow's client meeting.",
        "Investigate why product usage dropped this month.",
        "Review the progress of our ongoing project.",
        "Summarize recent customer complaints.",
        "Help me prepare a project presentation.",
    ]
}

CLIENT_MEETING_DATA: Dict[str, Any] = {
    "client_overview": {
        "client_name": "Acme Global Solutions",
        "industry": "Enterprise FinTech & Cloud Banking",
        "relationship_status": "Strategic Partner (Tier 1)",
        "account_manager": "Elena Rostova",
        "annual_contract_value": "$420,000 / yr",
        "renewal_date": "December 15, 2026",
        "current_projects": [
            {"name": "Core Banking API Modernization", "health": "On Track", "completion": "85%"},
            {"name": "Multi-Region Cloud Migration", "health": "At Risk", "completion": "62%"}
        ],
        "key_contacts": [
            {"name": "Sarah Jenkins", "role": "VP of Technology", "email": "s.jenkins@acmeglobal.com"},
            {"name": "David Chen", "role": "Principal Architect", "email": "d.chen@acmeglobal.com"}
        ]
    },
    "recent_communications": [
        {
            "id": "comm_1",
            "subject": "Re: Q4 Cloud Migration Milestone Sign-off",
            "sender": "Sarah Jenkins (VP Tech)",
            "timestamp": "Today, 10:14 AM",
            "channel": "Email",
            "summary": "Confirmed attendance for tomorrow's 2 PM sync. Emphasized urgency on reviewing API latency SLA metrics and approving the compute node expansion.",
            "pending_response": True
        },
        {
            "id": "comm_2",
            "subject": "Architecture Review: Database Sharding Strategy",
            "sender": "David Chen (Lead Architect)",
            "timestamp": "Yesterday, 4:30 PM",
            "channel": "Slack Thread",
            "summary": "Shared benchmark results for shard key re-distribution. Verified 35% latency improvement in staging.",
            "pending_response": False
        },
        {
            "id": "comm_3",
            "subject": "Support Ticket #4928 - API Rate Limiting Incident",
            "sender": "DevOps Operations",
            "timestamp": "2 days ago",
            "channel": "Jira / Zendesk",
            "summary": "Incident root cause identified as unindexed query in transaction ledger. Hotfix applied and tested.",
            "pending_response": False
        }
    ],
    "previous_meeting_summary": {
        "meeting_date": "September 28, 2026",
        "attendees": ["Alex Mercer", "Sarah Jenkins", "David Chen", "Marcus Vance"],
        "key_decisions": [
            "Approved dual-region active-passive rollout strategy for EMEA cluster",
            "Deferred legacy cold data archive pipeline to Q1 roadmap",
            "Agreed on 99.95% SLA target with financial rebate terms"
        ],
        "commitments": [
            "Our team will deliver finalized latency benchmark report before Oct 12",
            "Acme procurement will review updated cloud capacity rider"
        ],
        "outstanding_followups": [
            "Vendor ISO 27001 renewal certificate submission",
            "Disaster recovery runbook sign-off"
        ]
    },
    "open_issues": [
        {
            "id": "iss_1",
            "title": "API rate-limit latency spike during market opening",
            "priority": "High",
            "status": "In Progress",
            "suggested_action": "Deploy Redis caching layer for authorization token validation"
        },
        {
            "id": "iss_2",
            "title": "Pending Q4 license renewal authorization",
            "priority": "Medium",
            "status": "Open",
            "suggested_action": "Review contract addendum with Acme procurement officer"
        },
        {
            "id": "iss_3",
            "title": "SSO SAML Certificate rotation validation",
            "priority": "Low",
            "status": "Resolved",
            "suggested_action": "Verify staging IdP metadata sync"
        }
    ],
    "suggested_talking_points": [
        {
            "category": "Accomplishments",
            "topic": "Platform Stability & Performance",
            "detail": "Highlight 99.98% platform uptime over last quarter and 42% query performance gain from database refactoring."
        },
        {
            "category": "Risk Mitigation",
            "topic": "Peak-Hour Latency Remediation",
            "detail": "Present exact root cause analysis for the Sept 14 latency spike and showcase the Redis distributed token cache deployed."
        },
        {
            "category": "Commercial Alignment",
            "topic": "Q4 Capacity Expansion Rider",
            "detail": "Discuss 20% compute node scaling needed for Black Friday / year-end trading volume."
        },
        {
            "category": "Questions to Ask",
            "topic": "Deployment Window Preferences",
            "detail": "Ask Sarah Jenkins if Sunday 02:00 UTC maintenance window is acceptable for the European region cutover."
        }
    ],
    "recommended_actions": [
        {"id": "act_m_1", "title": "Review previous meeting notes & executive summary", "completed": False, "action_type": "checkbox"},
        {"id": "act_m_2", "title": "Confirm meeting agenda with Sarah Jenkins", "completed": False, "action_type": "checkbox"},
        {"id": "act_m_3", "title": "Prepare executive slide deck on performance benchmarks", "completed": False, "action_type": "checkbox"},
        {"id": "act_m_4", "title": "Generate sample meeting brief", "completed": False, "action_type": "button"},
        {"id": "act_m_5", "title": "Create post-meeting follow-up checklist", "completed": False, "action_type": "checkbox"}
    ]
}

PRODUCT_USAGE_DATA: Dict[str, Any] = {
    "usage_overview": {
        "metrics": [
            {"id": "dau", "label": "Daily Active Users (DAU)", "value": "14,280", "comparison": "-18.4% MoM", "previous": "17,500", "trend": "down"},
            {"id": "sessions", "label": "Monthly Session Count", "value": "89,450", "comparison": "-22.1% MoM", "previous": "114,800", "trend": "down"},
            {"id": "engagement", "label": "Engagement Rate", "value": "41.2%", "comparison": "-9.5% MoM", "previous": "45.5%", "trend": "down"},
            {"id": "avg_duration", "label": "Avg Session Duration", "value": "6m 12s", "comparison": "-14.0% MoM", "previous": "7m 13s", "trend": "down"}
        ],
        "measured_period": "Past 30 Days vs Previous Period",
        "data_status": "Measured from demo event stream telemetry"
    },
    "usage_trend_chart": [
        {"day": "Day 1", "currentPeriod": 21800, "previousPeriod": 20900},
        {"day": "Day 4", "currentPeriod": 22400, "previousPeriod": 21100},
        {"day": "Day 7", "currentPeriod": 21900, "previousPeriod": 21400},
        {"day": "Day 10", "currentPeriod": 22600, "previousPeriod": 21800},
        {"day": "Day 13", "currentPeriod": 22100, "previousPeriod": 21600},
        {"day": "Day 14 (v2.4 Deploy)", "currentPeriod": 19400, "previousPeriod": 21700},
        {"day": "Day 17", "currentPeriod": 17200, "previousPeriod": 21900},
        {"day": "Day 20", "currentPeriod": 16100, "previousPeriod": 22000},
        {"day": "Day 23", "currentPeriod": 15400, "previousPeriod": 22200},
        {"day": "Day 26", "currentPeriod": 14800, "previousPeriod": 22100},
        {"day": "Day 30", "currentPeriod": 14280, "previousPeriod": 22400}
    ],
    "feature_adoption": {
        "most_used": [
            {"feature": "Interactive Analytics Dashboard", "adoptionRate": 84, "monthlyEvents": "38,400", "change": "+2%"},
            {"feature": "Automated Report Generator", "adoptionRate": 72, "monthlyEvents": "29,100", "change": "-1%"},
            {"feature": "REST API Integration", "adoptionRate": 61, "monthlyEvents": "21,500", "change": "+5%"}
        ],
        "least_used": [
            {"feature": "Custom Webhook Builder", "adoptionRate": 14, "monthlyEvents": "3,200", "change": "-38%"},
            {"feature": "Legacy CSV Bulk Exporter", "adoptionRate": 8, "monthlyEvents": "1,400", "change": "-44%"},
            {"feature": "Mobile Push Notification Rules", "adoptionRate": 5, "monthlyEvents": "820", "change": "-12%"}
        ]
    },
    "potential_causes": [
        {
            "id": "cause_1",
            "type": "Data-Backed Finding",
            "title": "v2.4 Release Deployment Timing Correlation",
            "description": "Telemetry shows sharp drop began on Day 14 immediately following release v2.4 which redesigned the primary navigation and checkout export flow.",
            "confidence": "High (92%)",
            "supporting_data": "78% of exit bounces occurred on new navigation drawer"
        },
        {
            "id": "cause_2",
            "type": "Incident Finding",
            "title": "Authentication Latency Degraded on EU Cluster",
            "description": "Auth token verification latency increased from 85ms to 840ms between Day 14 and Day 18, leading to high user drop-offs before dashboard mount.",
            "confidence": "High (88%)",
            "supporting_data": "32 incident alerts logged in Sentry / CloudWatch"
        },
        {
            "id": "cause_3",
            "type": "AI-Generated Hypothesis",
            "title": "Email Digest Delivery Spam-Filter Throttling",
            "description": "Weekly automated digest email open rate dropped from 38% to 22%, reducing spontaneous re-engagement from casual users.",
            "confidence": "Moderate (64%)",
            "supporting_data": "Marketing telemetry reports lower click-to-open ratio"
        }
    ],
    "segment_analysis": [
        {"segment": "Enterprise Tier", "activeUsers": "6,400", "change": "-4.2%", "status": "Resilient", "color": "#10b981"},
        {"segment": "Mid-Market (SMB)", "activeUsers": "4,980", "change": "-15.8%", "status": "Moderate Decline", "color": "#f59e0b"},
        {"segment": "Self-Serve & Free Tier", "activeUsers": "2,900", "change": "-31.4%", "status": "Severe Churn", "color": "#ef4444"}
    ],
    "recommended_investigations": [
        {"id": "inv_1", "title": "Audit exit rates on v2.4 redesigned navigation drawer", "completed": False, "action_type": "checkbox"},
        {"id": "inv_2", "title": "Examine EU auth cluster latency metrics and deploy connection pool fix", "completed": False, "action_type": "checkbox"},
        {"id": "inv_3", "title": "Compare cohort retention between Enterprise and Self-serve users", "completed": False, "action_type": "checkbox"},
        {"id": "inv_4", "title": "A/B test simplified navigation rollback for 20% sample", "completed": False, "action_type": "checkbox"}
    ]
}

PROJECT_REVIEW_DATA: Dict[str, Any] = {
    "project_overview": {
        "project_name": "Nova Core Platform Modernization",
        "description": "Re-architecting monolithic services into modular microservices with real-time event streaming and high availability.",
        "lead": "Alex Mercer",
        "start_date": "August 1, 2026",
        "target_launch": "November 15, 2026",
        "overall_progress": 68,
        "health": "On Track with Minor Blockers"
    },
    "task_distribution": [
        {"name": "Completed", "value": 14, "color": "#10b981"},
        {"name": "In Progress", "value": 6, "color": "#3b82f6"},
        {"name": "Todo", "value": 3, "color": "#8b5cf6"},
        {"name": "Blocked", "value": 2, "color": "#ef4444"}
    ],
    "upcoming_deadlines": [
        {"id": "dl_1", "milestone": "Sprint 14 Code Freeze", "due": "Oct 16, 2026", "days_left": 5, "severity": "urgent"},
        {"id": "dl_2", "milestone": "Security Compliance & Pen Test", "due": "Oct 22, 2026", "days_left": 11, "severity": "normal"},
        {"id": "dl_3", "milestone": "Staging User Acceptance Testing", "due": "Oct 28, 2026", "days_left": 17, "severity": "normal"},
        {"id": "dl_4", "milestone": "Production v3.0 General Release", "due": "Nov 15, 2026", "days_left": 35, "severity": "normal"}
    ],
    "blockers_and_risks": [
        {
            "id": "blk_1",
            "title": "PostgreSQL read-replica replication lag exceeding 1.2s",
            "severity": "High",
            "owner": "Marcus Vance",
            "impact": "Impacting reporting dashboard sync accuracy",
            "status": "Active Blocker"
        },
        {
            "id": "blk_2",
            "title": "Third-party payment gateway sandbox certificate expiry",
            "severity": "Medium",
            "owner": "Elena Rostova",
            "impact": "Holding up checkout integration automated test suites",
            "status": "Awaiting Vendor"
        }
    ],
    "team_activity": [
        {"id": "act_1", "user": "Elena Rostova", "avatar": "ER", "action": "Merged PR #284: Optimize query caching in auth service", "time": "2 hours ago"},
        {"id": "act_2", "user": "Marcus Vance", "avatar": "MV", "action": "Updated replica connection pool timeout settings", "time": "4 hours ago"},
        {"id": "act_3", "user": "Chloe Adams", "avatar": "CA", "action": "Completed 18 test cases for billing webhooks", "time": "Yesterday"},
        {"id": "act_4", "user": "David Kim", "avatar": "DK", "action": "Deployed staging candidate build v2.9-rc4", "time": "2 days ago"}
    ],
    "recommended_actions": [
        {"id": "act_p_1", "title": "Resolve PostgreSQL replica replication lag before code freeze", "completed": False, "action_type": "checkbox"},
        {"id": "act_p_2", "title": "Review outstanding pull requests for Sprint 14", "completed": False, "action_type": "checkbox"},
        {"id": "act_p_3", "title": "Re-run sandbox payment gateway integration tests", "completed": False, "action_type": "checkbox"},
        {"id": "act_p_4", "title": "Schedule sprint retrospective for completed auth milestone", "completed": False, "action_type": "checkbox"}
    ]
}

CUSTOMER_COMPLAINTS_DATA: Dict[str, Any] = {
    "complaint_overview": {
        "total_tickets": 142,
        "resolution_rate": "76.4%",
        "avg_resolution_time": "4.2 hours",
        "customer_satisfaction": "3.8 / 5.0",
        "period": "Last 30 Days"
    },
    "categories": [
        {"name": "Billing & Invoicing", "count": 48, "percentage": 33.8, "color": "#ef4444"},
        {"name": "API & Webhook Timeouts", "count": 41, "percentage": 28.9, "color": "#f59e0b"},
        {"name": "Dashboard Latency", "count": 32, "percentage": 22.5, "color": "#3b82f6"},
        {"name": "Account & SSO Login", "count": 21, "percentage": 14.8, "color": "#8b5cf6"}
    ],
    "priority_distribution": [
        {"priority": "Critical", "count": 18, "percentage": 12.7, "color": "#dc2626"},
        {"priority": "High", "count": 54, "percentage": 38.0, "color": "#ea580c"},
        {"priority": "Medium", "count": 49, "percentage": 34.5, "color": "#facc15"},
        {"priority": "Low", "count": 21, "percentage": 14.8, "color": "#10b981"}
    ],
    "repeated_issues": [
        {
            "issue": "Recurring charge renewal fails without notification alert",
            "occurrences": 28,
            "category": "Billing",
            "sentiment": "Frustrated",
            "root_cause": "Stripe webhook dropped when server responded 504"
        },
        {
            "issue": "Webhook payload dropped during 504 gateway timeout",
            "occurrences": 24,
            "category": "API",
            "sentiment": "Critical",
            "root_cause": "Retry queue lacked exponential backoff retry worker"
        },
        {
            "issue": "Exporting CSV with >50k rows causes browser tab to freeze",
            "occurrences": 19,
            "category": "Dashboard",
            "sentiment": "Annoyed",
            "root_cause": "Client-side synchronous JSON to CSV parsing in main thread"
        }
    ],
    "customer_feedback_summary": {
        "synthesis": "Analysis of 142 complaints reveals that 62.7% of critical churn threats stem from billing notification drop-offs and webhook reliability during peak hours. Customers are satisfied with core functionality but demand prompt failure alerts.",
        "source": "Rule-based category frequency synthesis & NLP keyword clustering"
    },
    "suggested_resolutions": [
        {"title": "Deploy automated webhook retry worker with exponential backoff", "impact": "Eliminates ~24 repetitive developer tickets/month"},
        {"title": "Add instant in-app billing alert when card renewal requires 3D-Secure auth", "impact": "Prevents involuntary subscription churn for 28 accounts"},
        {"title": "Offload CSV exports >10k rows to background worker with presigned S3 download", "impact": "Resolves browser crash complaints entirely"}
    ],
    "recommended_actions": [
        {"id": "act_c_1", "title": "Assign senior backend engineer to webhook timeout queue", "completed": False, "action_type": "checkbox"},
        {"id": "act_c_2", "title": "Send proactive service credit emails to affected billing users", "completed": False, "action_type": "checkbox"},
        {"id": "act_c_3", "title": "Publish status page note regarding recent latency remediations", "completed": False, "action_type": "checkbox"},
        {"id": "act_c_4", "title": "Schedule weekly customer support triage sync", "completed": False, "action_type": "checkbox"}
    ]
}

PRESENTATION_PREPARATION_DATA: Dict[str, Any] = {
    "presentation_overview": {
        "title": "Q4 Executive Strategy & Product Modernization",
        "audience": "Executive Leadership & Board of Directors",
        "duration": "25 minutes + 15 min Q&A",
        "date": "Thursday, Oct 15",
        "slides_count": "14 slides"
    },
    "presentation_outline": [
        {"slide": "Slide 1-3", "section": "Executive Summary & Key Milestones Achieved"},
        {"slide": "Slide 4-7", "section": "Platform Performance, SLA Wins & 42% Query Speedup"},
        {"slide": "Slide 8-10", "section": "Product Usage Drop Root-Cause & v2.4.1 Remediation"},
        {"slide": "Slide 11-13", "section": "Q4-Q1 Roadmap & Strategic Cloud Expansion"},
        {"slide": "Slide 14", "section": "Financial Budget Ask & Decision Approvals"}
    ],
    "key_metrics_to_highlight": [
        {"label": "Uptime SLA", "value": "99.98%"},
        {"label": "Enterprise ACV", "value": "$420k"},
        {"label": "Query Speedup", "value": "+42%"},
        {"label": "Sprint Velocity", "value": "44 pts"}
    ],
    "recommended_actions": [
        {"id": "act_pr_1", "title": "Review presentation slide outline and speaker notes", "completed": False, "action_type": "checkbox"},
        {"id": "act_pr_2", "title": "Export platform latency benchmark chart into slides", "completed": False, "action_type": "checkbox"},
        {"id": "act_pr_3", "title": "Schedule 15-minute dry-run rehearsal with Elena", "completed": False, "action_type": "checkbox"}
    ]
}

# Initial seed database project tasks
INITIAL_PROJECT_TASKS = [
    {"project_name": "Nova Core Platform", "title": "Implement Redis distributed lock for transaction processing", "status": "completed", "priority": "high", "due_date": "Oct 05, 2026"},
    {"project_name": "Nova Core Platform", "title": "Migrate customer authentication to OAuth2 + PKCE tokens", "status": "completed", "priority": "high", "due_date": "Oct 08, 2026"},
    {"project_name": "Nova Core Platform", "title": "Resolve PostgreSQL replica replication lag under peak load", "status": "blocked", "priority": "high", "due_date": "Oct 14, 2026"},
    {"project_name": "Nova Core Platform", "title": "Deploy staging candidate build v2.9-rc4 to integration cluster", "status": "in_progress", "priority": "high", "due_date": "Oct 15, 2026"},
    {"project_name": "Nova Core Platform", "title": "Execute Sprint 14 automated end-to-end regression test suite", "status": "in_progress", "priority": "medium", "due_date": "Oct 16, 2026"},
    {"project_name": "Nova Core Platform", "title": "Update third-party payment gateway sandbox credentials", "status": "blocked", "priority": "medium", "due_date": "Oct 17, 2026"},
    {"project_name": "Nova Core Platform", "title": "Draft technical documentation for multi-region failover", "status": "todo", "priority": "low", "due_date": "Oct 20, 2026"},
    {"project_name": "Nova Core Platform", "title": "Conduct security compliance and pen-testing audit", "status": "todo", "priority": "high", "due_date": "Oct 22, 2026"},
]
