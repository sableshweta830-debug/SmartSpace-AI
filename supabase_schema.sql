-- ==============================================================================
-- Supabase PostgreSQL Schema for Intent-to-Interface: Adaptive AI Workspace
-- Tagline: "An interface that adapts to your intent, not the other way around."
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. Clean Existing Tables (if re-running script)
-- ==============================================================================
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS workspace_components CASCADE;
DROP TABLE IF EXISTS workspaces CASCADE;
DROP TABLE IF EXISTS user_intents CASCADE;
DROP TABLE IF EXISTS user_preferences CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- ==============================================================================
-- TABLE A: profiles / users
-- Stores user identity, core role, and high-level preferences.
-- ==============================================================================
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(100) DEFAULT 'Product Lead / Engineer',
    preferences JSONB DEFAULT '{"theme": "light", "voice_input_enabled": true}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- TABLE B: user_intents
-- Captures raw natural language inputs, classified intents, and confidence scores.
-- ==============================================================================
CREATE TABLE user_intents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    intent_text TEXT NOT NULL,
    intent_type VARCHAR(100) NOT NULL, -- e.g., 'meeting_preparation', 'product_usage_analysis', 'project_review'
    confidence_score NUMERIC(5, 4) NOT NULL DEFAULT 0.8500,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- TABLE C: workspaces
-- Represents an adaptive workspace generated for a specific intent session.
-- ==============================================================================
CREATE TABLE workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    current_intent_id UUID REFERENCES user_intents(id) ON DELETE SET NULL,
    layout_config JSONB NOT NULL DEFAULT '{
        "layout_type": "adaptive_grid",
        "columns": 12,
        "explanation": "Interface automatically adapted based on detected goal"
    }'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- TABLE D: workspace_components
-- Individual dynamic widgets prioritized and positioned within a workspace.
-- ==============================================================================
CREATE TABLE workspace_components (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    component_type VARCHAR(100) NOT NULL, -- 'MeetingNotesWidget', 'ClientOverviewWidget', 'CommunicationWidget', etc.
    component_name VARCHAR(255) NOT NULL,
    position INT NOT NULL DEFAULT 0,
    priority INT NOT NULL DEFAULT 1,
    data_source JSONB DEFAULT '{}'::jsonb,
    visibility BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- TABLE E: tasks
-- Action items and sprint tasks linked directly to workspaces and users.
-- ==============================================================================
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'todo', -- 'todo', 'in_progress', 'completed', 'blocked'
    priority VARCHAR(50) NOT NULL DEFAULT 'medium', -- 'high', 'medium', 'low'
    due_date VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- TABLE F: user_preferences
-- Detailed user-level layout preferences and frequently used components.
-- ==============================================================================
CREATE TABLE user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    preferred_layout VARCHAR(50) DEFAULT 'adaptive_grid',
    theme VARCHAR(20) DEFAULT 'light', -- 'light' or 'dark'
    frequently_used_components JSONB DEFAULT '["ClientOverviewWidget", "MeetingNotesWidget", "ProjectProgressWidget"]'::jsonb,
    interaction_preferences JSONB DEFAULT '{"auto_expand_brief": true, "show_rationale": true}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- TABLE G: activity_logs
-- Audit log of user interactions and workspace generation events.
-- ==============================================================================
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL, -- e.g., 'intent_analyzed', 'workspace_created', 'task_completed'
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 3. Create Performance Indexes
-- ==============================================================================
CREATE INDEX idx_user_intents_user ON user_intents(user_id);
CREATE INDEX idx_workspaces_user ON workspaces(user_id);
CREATE INDEX idx_workspaces_intent ON workspaces(current_intent_id);
CREATE INDEX idx_components_workspace ON workspace_components(workspace_id);
CREATE INDEX idx_tasks_user ON tasks(user_id);
CREATE INDEX idx_tasks_workspace ON tasks(workspace_id);
CREATE INDEX idx_activity_logs_user ON activity_logs(user_id);

-- ==============================================================================
-- 4. Enable Row Level Security (RLS) with Permissive Hackathon Policies
-- ==============================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_intents ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Allow public anonymous read and write for rapid hackathon demo access
CREATE POLICY "Public profiles access" ON profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public user_intents access" ON user_intents FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public workspaces access" ON workspaces FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public workspace_components access" ON workspace_components FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public tasks access" ON tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public user_preferences access" ON user_preferences FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public activity_logs access" ON activity_logs FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- 5. Seed Data: Default Demo User & Client Meeting Scenario
-- ==============================================================================

-- A. Default User Profile
INSERT INTO profiles (id, name, email, role, preferences)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Alex Mercer',
    'alex.mercer@intentai.dev',
    'Principal Solutions Architect',
    '{"theme": "light", "voice_input_enabled": true}'::jsonb
);

-- B. User Preferences
INSERT INTO user_preferences (id, user_id, preferred_layout, theme, frequently_used_components, interaction_preferences)
VALUES (
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'adaptive_grid',
    'light',
    '["ClientOverviewWidget", "CommunicationWidget", "MeetingNotesWidget", "OpenIssuesWidget", "TalkingPointsWidget"]'::jsonb,
    '{"show_rationale": true, "auto_save": true}'::jsonb
);

-- C. Sample User Intent ("I have a client meeting tomorrow")
INSERT INTO user_intents (id, user_id, intent_text, intent_type, confidence_score)
VALUES (
    '00000000-0000-0000-0000-000000000010',
    '00000000-0000-0000-0000-000000000001',
    'I have a client meeting with Acme Corp tomorrow.',
    'meeting_preparation',
    0.9200
);

-- D. Adaptive Workspace for Client Meeting
INSERT INTO workspaces (id, user_id, name, description, current_intent_id, layout_config)
VALUES (
    '00000000-0000-0000-0000-000000000020',
    '00000000-0000-0000-0000-000000000001',
    'Client Meeting Preparation: Acme Global Solutions',
    'Dynamically generated cockpit for executive client sync and architectural alignment.',
    '00000000-0000-0000-0000-000000000010',
    '{
        "intent": "meeting_preparation",
        "confidence": 0.92,
        "summary": "Reorganized workspace around Acme Global Solutions partnership sync, outstanding SLA items, and talking points.",
        "explanation": "Synthesized CRM data, pending emails, previous agreements, and open incidents into an executive briefing layout."
    }'::jsonb
);

-- E. Workspace Components (The 6 dynamic widgets)
INSERT INTO workspace_components (workspace_id, component_type, component_name, position, priority, visibility, data_source)
VALUES
    (
        '00000000-0000-0000-0000-000000000020',
        'ClientOverviewWidget',
        'Client Overview & Contract Health',
        1,
        1,
        true,
        '{
            "client_name": "Acme Global Solutions",
            "relationship_status": "Strategic Partner (Tier 1)",
            "annual_contract_value": "$420,000 / yr",
            "renewal_date": "December 15, 2026",
            "lead_contact": "Sarah Jenkins (VP of Technology)"
        }'::jsonb
    ),
    (
        '00000000-0000-0000-0000-000000000020',
        'CommunicationWidget',
        'Recent Communications & Urgent Flags',
        2,
        1,
        true,
        '{
            "unread_count": 1,
            "latest_message": "Confirmed attendance for tomorrow 2 PM sync. Urgent review needed on API latency SLA metrics.",
            "sender": "Sarah Jenkins",
            "channel": "Email",
            "pending_response": true
        }'::jsonb
    ),
    (
        '00000000-0000-0000-0000-000000000020',
        'MeetingNotesWidget',
        'Previous Decisions & Commitments',
        3,
        2,
        true,
        '{
            "last_meeting_date": "September 28, 2026",
            "key_decision": "Approved dual-region active-passive rollout strategy for EMEA cluster",
            "team_commitment": "Deliver finalized latency benchmark report before Oct 12"
        }'::jsonb
    ),
    (
        '00000000-0000-0000-0000-000000000020',
        'OpenIssuesWidget',
        'Open Issues & SLA Risks',
        4,
        2,
        true,
        '{
            "critical_issues_count": 1,
            "top_issue": "API rate-limit latency spike during market opening",
            "suggested_action": "Deploy Redis caching layer for authorization token validation"
        }'::jsonb
    ),
    (
        '00000000-0000-0000-0000-000000000020',
        'TalkingPointsWidget',
        'Suggested Talking Points & Agenda',
        5,
        3,
        true,
        '{
            "talking_points": [
                "Highlight 99.98% platform uptime and 42% query performance gain",
                "Present Root Cause Analysis for peak-hour latency and showcase Redis cache solution",
                "Discuss 20% compute node scaling needed for Q4 trading volume",
                "Confirm Sunday 02:00 UTC maintenance window preference"
            ]
        }'::jsonb
    ),
    (
        '00000000-0000-0000-0000-000000000020',
        'RecommendedActionsWidget',
        'Executive Action Plan',
        6,
        3,
        true,
        '{
            "total_actions": 5,
            "completed": 0
        }'::jsonb
    );

-- F. Actionable Tasks for the Client Meeting Workspace
INSERT INTO tasks (workspace_id, user_id, title, description, status, priority, due_date)
VALUES
    (
        '00000000-0000-0000-0000-000000000020',
        '00000000-0000-0000-0000-000000000001',
        'Confirm meeting agenda with Sarah Jenkins',
        'Send revised agenda highlighting latency metrics SLA discussion.',
        'todo',
        'high',
        'Tomorrow, 10:00 AM'
    ),
    (
        '00000000-0000-0000-0000-000000000020',
        '00000000-0000-0000-0000-000000000001',
        'Review latency benchmark report before call',
        'Verify staging cluster throughput numbers match contract SLA requirements.',
        'in_progress',
        'high',
        'Tomorrow, 12:00 PM'
    ),
    (
        '00000000-0000-0000-0000-000000000020',
        '00000000-0000-0000-0000-000000000001',
        'Generate executive meeting brief PDF',
        'Use SmartSpace 1-click brief generator to export executive talking points.',
        'todo',
        'medium',
        'Tomorrow, 1:30 PM'
    );

-- G. Activity Log Entry
INSERT INTO activity_logs (user_id, workspace_id, action, metadata)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000020',
    'workspace_generated',
    '{"intent": "meeting_preparation", "prompt": "I have a client meeting with Acme Corp tomorrow.", "components_count": 6}'::jsonb
);
