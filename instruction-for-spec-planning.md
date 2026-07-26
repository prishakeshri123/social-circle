You are a Senior Staff Frontend Architect, Product Designer, Technical Lead and React Expert with 20+ years of experience building enterprise-level scalable web applications.

I have attached a Product Requirement Document (PRD):

@Social_Circle_PRD.docx

Your responsibility is to analyze the complete document and create an enterprise-grade Frontend Technical Specification.

IMPORTANT

This specification should be written as if it is going to be used by multiple frontend developers, UI designers, QA engineers, Product Owners and future backend developers.

Backend APIs are NOT ready.

For now every feature should use mock data.

Do NOT skip any screen or functionality.

Think like an architect and include everything that a production-ready application needs.

======================================================
PROJECT STACK
======================================================

Frontend

• React 19
• TypeScript
• Vite
• Tailwind CSS
• Zustand
• TanStack Query
• React Router v7

Use additional technologies wherever appropriate and explain why they are selected.

Recommended libraries

UI

- Shadcn UI
- Radix UI
- Framer Motion
- Lucide Icons

Forms

- React Hook Form
- Zod

Data

- TanStack Query
- Zustand

Utilities

- Axios
- clsx
- tailwind-merge
- date-fns

Code Quality

- ESLint
- Prettier

Performance

- React Lazy
- Suspense
- Dynamic Imports

======================================================
OUTPUT FORMAT
======================================================

Create the document in the following sections.

# 1 Executive Summary

Explain

Project Goal

Target Audience

Business Objective

Success Metrics

Application Scope

Out of Scope

Assumptions

Dependencies

Constraints

---

# 2 Complete Feature Breakdown

List every feature discovered in PRD.

For every feature include

Purpose

Priority

Dependencies

User Value

Acceptance Criteria

Future Enhancements

---

# 3 Complete Screen Inventory

Create a table containing

Screen Name

URL

Authentication Required

Description

Responsive Behaviour

Components Used

API Dependencies (Mock)

State Used

Navigation Flow

Permissions

Edge Cases

Loading State

Empty State

Error State

---

# 4 User Journey

Create end-to-end flow diagrams for

Guest User

Registered User

Admin

Moderator

Profile Owner

New User Onboarding

Returning User

Logout

---

# 5 Information Architecture

Explain

Navigation hierarchy

Primary navigation

Secondary navigation

Footer

Sidebar

Drawer

Profile navigation

Mobile navigation

Deep links

Breadcrumb strategy

---

# 6 Frontend Architecture

Explain

Folder Structure

Component Architecture

Atomic Design

Feature Based Architecture

Shared Components

Hooks

Contexts

Utils

Assets

Constants

Types

Interfaces

Routes

Guards

Lazy Loading

Code Splitting

Error Boundaries

Suspense

---

# 7 Routing Specification

Include

Protected Routes

Guest Routes

Dynamic Routes

Nested Routes

404

Unauthorized

Maintenance

Redirect Rules

---

# 8 State Management

Explain

What belongs in Zustand

What belongs in TanStack Query

Local State

URL State

Session Storage

Local Storage

Cache Strategy

Optimistic Updates

Persistence

---

# 9 Mock Backend Architecture

Explain

Mock folder structure

JSON files

Pagination

Sorting

Filtering

---

# 10 Data Models

For every entity create

TypeScript Interface

Validation Rules

Relationships

Example Mock Data

---

# 11 Component Library

Create complete component inventory.

For every component specify

Purpose

Props

Variants

States

Accessibility

Reusable Level

Composition

---

# 12 UI Design System

Colors

Typography

Spacing

Breakpoints

Grid

Elevation

Radius

Animations

Dark Mode

Icons

Buttons

Inputs

Cards

Dialogs

Toasts

Badges

Tables

Avatar

Loader

Skeleton

Empty States

---

# 13 Every Screen Specification

For EACH screen include

Purpose

Layout

Sections

Components

Interactions

Validations

Animations

Responsive behaviour

Loading

Empty

Error

Permissions

Accessibility

Keyboard Navigation

SEO

Performance

Future Improvements

Repeat for every single screen.

---

# 14 Forms

Every form

Fields

Validation

Error Messages

Success Messages

Keyboard Behaviour

Auto Save

Debounce

Accessibility

---

# 15 API Contract (Mock)

Create REST endpoints.

GET

POST

PATCH

DELETE

Response examples

Request examples

Error responses

Pagination

Filtering

Sorting

---

# 16 Authentication

Mock Login

Signup

Forgot Password

OTP

Social Login

JWT Simulation

Refresh Token

Protected Routes

---

# 17 Notifications

Toast

Push

Email

In App

Unread Count

Badge Behaviour

---

# 18 Search

Global Search

Debounce

Suggestions

Recent Search

Empty Search

Filters

---

# 19 Performance Optimization

React Memo

useMemo

useCallback

Virtualization

Lazy Loading

Code Splitting

Caching

Image Optimization

Prefetching

Pagination

---

# 20 Accessibility

WCAG AA

Keyboard Navigation

ARIA

Focus Trap

Contrast

Screen Readers

Skip Links

---

# 21 SEO

Meta Tags

Structured Data

Open Graph

Twitter Card

Sitemap

Robots

Canonical

---

# 22 Security

XSS

CSRF

Sanitization

Input Validation

Token Storage

Rate Limiting

Content Security Policy

---

# 23 Error Handling

API Errors

404

500

Retry

Offline

Boundary

Fallback UI

---

# 26 Project Structure

Complete folder tree.

Include every folder.

---

# 27 Development Standards

Naming Convention

Hooks

Components

Files

Commits

Branches

PR Rules

Code Review Checklist

---

# 28 Development Phases

Break the project into phases.

Example

Phase 1
Project Setup

Estimated Hours

Deliverables

Dependencies

Checklist

Definition of Done

Phase 2
Authentication

Repeat until the project is complete.

Every phase should have

Objectives

Tasks

Subtasks

Estimated Hours

Risks

Dependencies

Deliverables

Testing

Definition of Done

---

# 29 Sprint Planning

Convert the phases into

Sprint 1

Sprint 2

Sprint 3

Sprint 4

Sprint 5

Sprint 6

---

# 31 Future Backend Integration

Mention

How TanStack Query will be replaced

Mock removal strategy

API abstraction

Repository Pattern

Environment Configuration

---

# 32 Risks

Technical Risks

UX Risks

Performance Risks

Security Risks

Delivery Risks

Mitigation

---

# 33 Final Development Checklist

Everything required before production release.

======================================================

IMPORTANT

Do not summarize.

Think deeply.

Assume missing details wherever necessary and explicitly document your assumptions.

Whenever the PRD lacks information, recommend the best enterprise-level implementation based on modern SaaS social networking applications like LinkedIn, Facebook, Threads, X, Reddit and Discord.

The specification should be detailed enough that a frontend developer can implement the entire application without asking additional questions.

Whenever applicable include

• diagrams
• tables
• state diagrams
• sequence diagrams
• folder trees
• component trees
• routing diagrams
• interaction flows

Produce an extremely detailed document (100+ pages if necessary).
