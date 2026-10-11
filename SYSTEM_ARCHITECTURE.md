# KAUSHALSAATHI 360 | SYSTEM ARCHITECTURE SPECIFICATION (SIH26241)

## 1. System Architecture Diagram

```
+---------------------------------------------------------------------------------------+
|                                    CLIENT BROWSER                                      |
|                                                                                       |
|  +---------------------------------------------------------------------------------+  |
|  |                             REACT 19 SPA PRESENTATION                            |  |
|  |  [Learner Dashboard]  [Family Consensus Meter]  [Pathway Simulator]             |  |
|  |  [Counsellor Triage]  [Admin Audit Console]    [Evidence Trust Explorer]        |  |
|  |  [Voc-Saathi Voice Assistant (Web Speech STT/TTS & Server Fallback)]             |  |
|  +---------------------------------------------------------------------------------+  |
+------------------------------------------+--------------------------------------------+
                                           | HTTP / REST API (Port 3000)
                                           v
+---------------------------------------------------------------------------------------+
|                             EXPRESS FULL-STACK API GATEWAY                             |
|                                                                                       |
|  [JWT / RBAC Middleware]  [Rate Limiter]  [Input Validator]  [OWASP ASVS Audit Logger] |
|                                                                                       |
|  +---------------------------------------------------------------------------------+  |
|  |                               MODULAR BUSINESS SERVICES                         |  |
|  |                                                                                 |  |
|  |  1. auth_service          2. profile_service        3. assessment_service       |  |
|  |  4. career_service        5. recommendation_service 6. family_service (Engine)  |  |
|  |  7. evidence_service      8. rag_service (Gemini)   9. counsellor_service       |  |
|  |  10. action_plan_service  11. audit_service         12. analytics_service       |  |
|  +---------------------------------------------------------------------------------+  |
+---------------------------+---------------------------------+-------------------------+
                            |                                 |
                            v                                 v
+-------------------------------------+   +---------------------------------------------+
|    AI & RAG GROUNDING ENGINE        |   |         DATA PERSISTENCE TIER               |
|                                     |   |                                             |
|  - Google Gemini 3.8 Flash SDK      |   |  - PostgreSQL 16 Relational Engine          |
|  - Grounded Context Assembly        |   |    (22 Normalized Tables, Foreign Keys)     |
|  - Citation Verification Loop       |   |  - Redis 7 Session & Rate Limiting Cache    |
|  - Strict UNKNOWN Fallback State    |   |  - DPDP Act 2023 Consent Registry           |
+-------------------------------------+   +---------------------------------------------+
```

---

## 2. Database Entity-Relationship (ER) Schema Overview

The database is defined in `/schema.sql` with 22 relational entities:

1. **`roles`**: `id (PK)`, `name`, `description`, `created_at`
2. **`users`**: `id (PK, UUID)`, `role_id (FK -> roles)`, `full_name`, `email (UNIQUE)`, `phone_number`, `password_hash`, `linked_learner_id (FK -> users)`, `counsellor_specialization`, `created_at`
3. **`profiles`**: `id (PK)`, `user_id (FK -> users, UNIQUE)`, `age`, `education_level`, `state`, `district`, `rural_urban`, `preferred_language`, `interests[]`, `skills[]`, `aptitude_scores (JSONB)`
4. **`consents`**: `id (PK)`, `user_id (FK -> users)`, `profile_processing`, `guardian_sharing`, `counsellor_access`, `anonymized_analytics`, `voice_retention`, `consent_recorded_at`
5. **`skills`**: `id (PK)`, `name`, `category`, `nsqf_level`, `description`
6. **`career_roles`**: `id (PK)`, `sector`, `nsqf_level`, `title_en`, `title_hi`, `title_mr`, `description_en`, `required_education`, `training_duration_months`, `entry_salary_range`, `mid_career_salary_range`, `safety_score`, `job_stability_score`, `status`
7. **`career_skills`**: `(career_id, skill_id) (Composite PK)`
8. **`career_pathways`**: `id (PK)`, `career_id (FK)`, `path_type`, `title`, `duration_months`, `estimated_cost_inr`, `stipend_earnings_inr`, `progression_outlook`, `evidence_confidence`
9. **`training_programs`**: `id (PK)`, `career_id (FK)`, `institute_name`, `institute_type`, `state`, `district`, `is_pmkvy_approved`
10. **`evidence_sources`**: `id (PK)`, `name`, `source_type`, `publishing_authority`, `publication_date`, `last_verified_date`, `geography`, `confidence_score`, `url_or_citation`
11. **`evidence_claims`**: `id (PK)`, `career_id (FK)`, `claim_type`, `claim_statement_en`, `metric_value`, `evidence_source_id (FK)`, `confidence`, `status` ('VERIFIED', 'UNKNOWN')
12. **`assessments`**: `id (PK)`, `user_id (FK)`, `assessment_type`, `mechanical_score`, `spatial_score`, `digital_score`, `practical_score`, `people_care_score`, `completed_at`
13. **`assessment_questions`**: `id (PK)`, `category`, `question_json`, `options_json`
14. **`assessment_answers`**: `id (PK)`, `assessment_id (FK)`, `question_id (FK)`, `selected_option_id`
15. **`recommendations`**: `id (PK)`, `user_id (FK)`, `career_id (FK)`, `overall_fit_score`, `confidence_score`, `why_breakdown (JSONB)`, `human_escalation_required`
16. **`recommendation_reasons`**: `id (PK)`, `recommendation_id (FK)`, `reason_text`, `evidence_claim_id (FK)`
17. **`family_cases`**: `id (PK)`, `learner_id (FK)`, `parent_id (FK)`, `selected_career_id (FK)`, `agreement_score`, `learner_preference_vector (JSONB)`, `parent_concern_vector (JSONB)`, `conflict_areas (JSONB)`, `unresolved_questions (JSONB)`
18. **`family_concerns`**: `id (PK)`, `family_case_id (FK)`, `category`, `concern_level`, `user_note`
19. **`counsellor_cases`**: `id (PK)`, `learner_id (FK)`, `assigned_counsellor_id (FK)`, `top_career_id (FK)`, `overall_confidence`, `status`, `risk_category`, `overridden_career_id (FK)`, `override_reason`
20. **`counsellor_notes`**: `id (PK)`, `counsellor_case_id (FK)`, `author_id (FK)`, `note_text`, `action_taken`, `created_at`
21. **`action_plans`**: `id (PK)`, `learner_id (FK)`, `career_id (FK)`, `selected_pathway`, `milestones (JSONB)`, `counsellor_approved`
22. **`audit_logs`**: `id (PK)`, `user_id (FK)`, `user_name`, `user_role`, `action`, `resource`, `ip_address`, `security_status`, `logged_at`

---

## 3. Core API Endpoint Specification

| Method | Endpoint | Service | Description |
|---|---|---|---|
| POST | `/api/auth/login` | auth_service | User authentication & session generation |
| POST | `/api/auth/register` | auth_service | Register learner or guardian with role validation |
| GET | `/api/profile/learner/:id` | profile_service | Retrieve learner psychometric profile & demographics |
| POST | `/api/assessments/submit` | assessment_service | Evaluate answers & update category scores |
| GET | `/api/careers` | career_service | Fetch all NCVET-aligned career profiles |
| POST | `/api/recommendations/generate` | recommendation_service | Run 5-stage ranking pipeline with transparent WHY breakdown |
| GET | `/api/family/case/:learnerId` | family_service | Retrieve family consensus vector & agreement score |
| POST | `/api/family/update-concerns` | family_service | Update parent concerns, recalculate agreement score & detect conflicts |
| POST | `/api/family/request-counsellor` | family_service | Escalate family conflict for professional counsellor mediation |
| GET | `/api/evidence/sources` | evidence_service | List government evidence authorities |
| POST | `/api/evidence/query` | evidence_service | Query claims with strict UNKNOWN state enforcement |
| POST | `/api/ai/counsel` | rag_service | Grounded Gemini RAG consultation in EN/HI/MR |
| GET | `/api/counsellor/cases` | counsellor_service | Retrieve triage queue cases with risk categorization |
| POST | `/api/counsellor/cases/:id/override` | counsellor_service | Human counsellor override of AI recommendation |
| PUT | `/api/action-plan/milestone/:id` | action_plan_service | Toggle completion status of milestone |
| GET | `/api/audit/logs` | audit_service | Fetch immutable OWASP ASVS audit logs |
| GET | `/api/analytics/overview` | analytics_service | Aggregate state and national skill KPIs |
| POST | `/api/privacy/consent/:userId` | consent_service | Update granular DPDP Act 2023 consent preferences |
| POST | `/api/privacy/forget-me` | consent_service | Initiate DPDP Right to be Forgotten deletion pipeline |

---

## 4. Testing & Verification Guide

### Unit & API Testing
```bash
# Verify TypeScript typing and compile integrity
npm run lint

# Check server runtime compilation
npm run build
```

### Citation & Prompt-Injection Defense Test
1. Open the **Evidence Explorer** view.
2. Under **Interactive Verification Sandbox**, enter:
   `"What is the guaranteed placement rate for electricians?"`
   -> Engine returns verified PLFS range with explicit notice that no government scheme promises 100% unconditional guarantees.
3. Test emerging trade with no empirical record:
   `"10-year pension for agricultural drone pilot"`
   -> Engine strictly returns **UNKNOWN: Reliable evidence was not found for this specific claim.**
