-- ============================================================================
-- KAUSHALSAATHI 360 (SIH26241) - PRODUCTION POSTGRESQL RELATIONAL SCHEMA
-- AI-Enabled Career Counselling & Family Decision-Support Platform
-- ============================================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. ROLES
CREATE TABLE roles (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO roles (id, name, description) VALUES
('learner', 'Vocational Learner', 'Students exploring vocational education and skills pathways'),
('parent', 'Parent / Guardian', 'Guardians voicing concerns and participating in family consensus'),
('counsellor', 'Certified Vocational Counsellor', 'Professional mentors offering mediation and guidance'),
('admin', 'System Administrator', 'Government authority managing catalogue, evidence, and audit logs');

-- 2. USERS
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id VARCHAR(50) NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    linked_learner_id UUID REFERENCES users(id) ON DELETE SET NULL,
    counsellor_specialization VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role_id);
CREATE INDEX idx_users_linked_learner ON users(linked_learner_id);

-- 3. PROFILES
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    age INT CHECK (age >= 12 AND age <= 60),
    gender VARCHAR(50),
    education_level VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    rural_urban VARCHAR(50) DEFAULT 'semi-urban',
    preferred_language VARCHAR(10) DEFAULT 'en',
    family_annual_income VARCHAR(50),
    willing_to_relocate VARCHAR(50) DEFAULT 'within_state',
    financial_constraints VARCHAR(50) DEFAULT 'medium',
    interests TEXT[] DEFAULT '{}',
    skills TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_profiles_user ON profiles(user_id);
CREATE INDEX idx_profiles_state_dist ON profiles(state, district);

-- 4. CONSENTS (DPDP Act 2023 & GDPR Compliant)
CREATE TABLE consents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    profile_processing BOOLEAN DEFAULT TRUE,
    guardian_sharing BOOLEAN DEFAULT TRUE,
    counsellor_access BOOLEAN DEFAULT TRUE,
    anonymized_analytics BOOLEAN DEFAULT TRUE,
    voice_retention BOOLEAN DEFAULT FALSE,
    consent_recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    revoked_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_consents_user ON consents(user_id);

-- 5. SKILLS CATALOGUE
CREATE TABLE skills (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    nsqf_level INT DEFAULT 4,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. CAREER ROLES (NCVET & NSQF Aligned)
CREATE TABLE career_roles (
    id VARCHAR(100) PRIMARY KEY,
    sector VARCHAR(255) NOT NULL,
    nsqf_level INT NOT NULL CHECK (nsqf_level BETWEEN 1 AND 10),
    title_en VARCHAR(255) NOT NULL,
    title_hi VARCHAR(255),
    title_mr VARCHAR(255),
    description_en TEXT NOT NULL,
    description_hi TEXT,
    description_mr TEXT,
    required_education VARCHAR(255) NOT NULL,
    training_duration_months INT NOT NULL,
    monthly_stipend_training VARCHAR(100),
    entry_salary_range VARCHAR(100) NOT NULL,
    mid_career_salary_range VARCHAR(100) NOT NULL,
    growth_rate_5yr VARCHAR(100),
    safety_score INT CHECK (safety_score BETWEEN 0 AND 100),
    job_stability_score INT CHECK (job_stability_score BETWEEN 0 AND 100),
    social_acceptance_score INT CHECK (social_acceptance_score BETWEEN 0 AND 100),
    suitable_for_women_score INT CHECK (suitable_for_women_score BETWEEN 0 AND 100),
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_career_roles_sector ON career_roles(sector);
CREATE INDEX idx_career_roles_nsqf ON career_roles(nsqf_level);

-- 7. CAREER SKILLS JUNCTION
CREATE TABLE career_skills (
    career_id VARCHAR(100) NOT NULL REFERENCES career_roles(id) ON DELETE CASCADE,
    skill_id VARCHAR(100) NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    is_mandatory BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (career_id, skill_id)
);

-- 8. CAREER PATHWAYS (3 Interactive Pathways)
CREATE TABLE career_pathways (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    career_id VARCHAR(100) NOT NULL REFERENCES career_roles(id) ON DELETE CASCADE,
    path_type VARCHAR(100) NOT NULL, -- 'Apprenticeship', 'Diploma/CITS', 'Entrepreneurship'
    title VARCHAR(255) NOT NULL,
    duration_months INT NOT NULL,
    estimated_cost_inr NUMERIC(10, 2) DEFAULT 0,
    stipend_earnings_inr NUMERIC(10, 2) DEFAULT 0,
    progression_outlook TEXT,
    evidence_confidence VARCHAR(50) DEFAULT 'HIGH',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_career_pathways_career ON career_pathways(career_id);

-- 9. TRAINING PROGRAMS & INSTITUTES
CREATE TABLE training_programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    career_id VARCHAR(100) NOT NULL REFERENCES career_roles(id) ON DELETE CASCADE,
    institute_name VARCHAR(255) NOT NULL,
    institute_type VARCHAR(100) NOT NULL, -- 'Govt ITI', 'Polytechnic', 'PMKK'
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    is_pmkvy_approved BOOLEAN DEFAULT TRUE,
    seat_capacity INT DEFAULT 40,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_training_programs_location ON training_programs(state, district);

-- 10. EVIDENCE SOURCES (Trust Engine)
CREATE TABLE evidence_sources (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    source_type VARCHAR(100) NOT NULL,
    publishing_authority VARCHAR(255) NOT NULL,
    publication_date DATE NOT NULL,
    last_verified_date DATE NOT NULL,
    geography VARCHAR(100) NOT NULL,
    evidence_quality VARCHAR(50) DEFAULT 'HIGH',
    confidence_score NUMERIC(3, 2) CHECK (confidence_score BETWEEN 0.0 AND 1.0),
    url_or_citation TEXT NOT NULL,
    is_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. EVIDENCE CLAIMS
CREATE TABLE evidence_claims (
    id VARCHAR(100) PRIMARY KEY,
    career_id VARCHAR(100) NOT NULL REFERENCES career_roles(id) ON DELETE CASCADE,
    claim_type VARCHAR(100) NOT NULL,
    claim_statement_en TEXT NOT NULL,
    claim_statement_hi TEXT,
    claim_statement_mr TEXT,
    metric_value VARCHAR(255) NOT NULL,
    evidence_source_id VARCHAR(100) NOT NULL REFERENCES evidence_sources(id) ON DELETE RESTRICT,
    confidence NUMERIC(3, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'VERIFIED', -- 'VERIFIED', 'UNKNOWN', 'UNDER_REVIEW'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_evidence_claims_career ON evidence_claims(career_id);
CREATE INDEX idx_evidence_claims_source ON evidence_claims(evidence_source_id);

-- 12. ASSESSMENTS
CREATE TABLE assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    assessment_type VARCHAR(50) NOT NULL, -- 'aptitude', 'interest', 'skill'
    mechanical_score INT,
    spatial_score INT,
    digital_score INT,
    practical_score INT,
    people_care_score INT,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_assessments_user ON assessments(user_id);

-- 13. ASSESSMENT QUESTIONS & ANSWERS
CREATE TABLE assessment_questions (
    id VARCHAR(100) PRIMARY KEY,
    question_type VARCHAR(50) NOT NULL,
    category VARCHAR(100) NOT NULL,
    question_json JSONB NOT NULL,
    options_json JSONB NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE assessment_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
    question_id VARCHAR(100) NOT NULL REFERENCES assessment_questions(id),
    selected_option_id VARCHAR(50) NOT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 14. RECOMMENDATIONS & REASONS
CREATE TABLE recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    career_id VARCHAR(100) NOT NULL REFERENCES career_roles(id) ON DELETE CASCADE,
    overall_fit_score INT NOT NULL,
    confidence_score NUMERIC(3, 2) NOT NULL,
    interest_match INT,
    skill_match INT,
    location_feasibility INT,
    training_availability INT,
    family_alignment INT,
    evidence_confidence VARCHAR(50) DEFAULT 'HIGH',
    human_escalation_required BOOLEAN DEFAULT FALSE,
    escalation_reason TEXT,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_recommendations_user ON recommendations(user_id);

CREATE TABLE recommendation_reasons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recommendation_id UUID NOT NULL REFERENCES recommendations(id) ON DELETE CASCADE,
    reason_text TEXT NOT NULL,
    evidence_claim_id VARCHAR(100) REFERENCES evidence_claims(id) ON DELETE SET NULL
);

-- 15. FAMILY CONSENSUS CASES & CONCERNS
CREATE TABLE family_cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    learner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parent_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    selected_career_id VARCHAR(100) NOT NULL REFERENCES career_roles(id) ON DELETE CASCADE,
    agreement_score INT NOT NULL CHECK (agreement_score BETWEEN 0 AND 100),
    status VARCHAR(100) DEFAULT 'PENDING_DISCUSSION',
    learner_preference_vector JSONB NOT NULL,
    parent_concern_vector JSONB NOT NULL,
    conflict_areas JSONB DEFAULT '[]',
    unresolved_questions JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_family_cases_learner ON family_cases(learner_id);
CREATE INDEX idx_family_cases_parent ON family_cases(parent_id);

CREATE TABLE family_concerns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_case_id UUID NOT NULL REFERENCES family_cases(id) ON DELETE CASCADE,
    category VARCHAR(100) NOT NULL, -- 'salary', 'safety', 'job_security', 'cost', 'distance', 'social_status'
    concern_level VARCHAR(50) NOT NULL, -- 'high', 'medium', 'low'
    user_note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 16. COUNSELLOR CASES & NOTES
CREATE TABLE counsellor_cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    learner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES users(id) ON DELETE SET NULL,
    assigned_counsellor_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    top_career_id VARCHAR(100) NOT NULL REFERENCES career_roles(id),
    overall_confidence NUMERIC(3, 2) NOT NULL,
    status VARCHAR(100) DEFAULT 'ASSIGNED',
    risk_category VARCHAR(100) DEFAULT 'SMOOTH_ALIGNMENT',
    overridden_career_id VARCHAR(100) REFERENCES career_roles(id),
    override_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_counsellor_cases_assigned ON counsellor_cases(assigned_counsellor_id);
CREATE INDEX idx_counsellor_cases_status ON counsellor_cases(status);

CREATE TABLE counsellor_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    counsellor_case_id UUID NOT NULL REFERENCES counsellor_cases(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    note_text TEXT NOT NULL,
    action_taken TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 17. ACTION PLANS & MILESTONES
CREATE TABLE action_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    learner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    career_id VARCHAR(100) NOT NULL REFERENCES career_roles(id) ON DELETE CASCADE,
    selected_pathway VARCHAR(255) NOT NULL,
    target_completion_months INT DEFAULT 36,
    counsellor_approved BOOLEAN DEFAULT FALSE,
    parent_consent_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE action_plan_milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action_plan_id UUID NOT NULL REFERENCES action_plans(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    target_date DATE NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    portal_link TEXT,
    notes TEXT,
    step_order INT DEFAULT 1
);

-- 18. NOTIFICATIONS
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    notification_type VARCHAR(100) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);

-- 19. AUDIT LOGS (OWASP ASVS / Government Tamper-Proof Audit Trail)
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    user_name VARCHAR(255) NOT NULL,
    user_role VARCHAR(50) NOT NULL,
    action VARCHAR(100) NOT NULL,
    resource VARCHAR(255) NOT NULL,
    ip_address VARCHAR(50) NOT NULL,
    security_status VARCHAR(50) DEFAULT 'SUCCESS',
    metadata JSONB DEFAULT '{}',
    logged_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_timestamp ON audit_logs(logged_at DESC);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
