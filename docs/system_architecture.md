# System Architecture & Data Flow

This document outlines the end-to-end technical flow of the Amazon Product Listing Optimizer, covering data extraction, AI optimization, and version control history.

## High-Level Flow Diagram

```mermaid
sequenceDiagram
    participant User as Seller (Frontend)
    participant API as Backend API
    participant Scraper as Amazon Scraper Service
    participant AI as Groq (Llama 3.3)
    participant DB as MySQL Database

    %% Data Fetching Phase
    User->>API: Enter ASIN & Request Analysis
    API->>Scraper: Trigger Headless Scrape (com/in/ca fallbacks)
    Scraper-->>API: Return Raw Title, Bullets & Description
    API-->>User: Display Initial Analysis UI

    %% Optimization Phase
    User->>API: Click "✨ Optimize Listing"
    API->>AI: Send System Prompt + Raw Product Data
    Note over AI: Llama 3.3 creates SEO-optimized JSON
    AI-->>API: Return Optimized Title, Bullets, Keywords & Scores
    API-->>User: Display AI Transformation UI

    %% Storage & History Phase
    API->>DB: Auto-Save Snapshot (Versioning Service)
    Note over DB: Check ASIN -> Increment Version (v1, v2...)
    DB-->>API: Success
    API-->>User: Update Version History Timeline

    %% Rollback Interaction
    User->>API: Select Previous Version (Rollback)
    API->>DB: Fetch Target Version Content
    API->>DB: Create NEW "Forward-Rollback" Version (v+1)
    DB-->>API: Registered as Newest State
    API-->>User: Refresh Dashboard with Target Content
```

## Technical Breakdown

### 1. Data Fetching (Resilient Scraping)
- **Multi-Domain Strategy**: To handle Amazon's anti-bot measures, the scraper tries multiple top-level domains (.com, .in, .co.uk) in a fallback loop.
- **Header Rotation**: Uses a randomized set of User-Agents and browser-like headers to mimic real human requests.
- **Parsing**: Employs `Cheerio` to extract data from specific Amazon selectors (`#productTitle`, `#feature-bullets`, etc.).

### 2. AI Integration (Agentic Optimization)
- **Engine**: Powered by **Groq** using the **Llama 3.3 70B** model.
- **Prompting**: Uses a strict system prompt that instructs the AI to output valid JSON. It focuses on:
    - **Amazon SEO**: Placing high-intent keywords naturally.
    - **Persona**: Acting as an expert Amazon Copywriter.
    - **Scoring**: Calculating a confidence score based on keyword density and engagement potential.

### 3. Storage & History (Forward-Rollback Strategy)
- **MySQL Architecture**: Two primary tables: `products` (metadata) and `listing_versions` (the actual snapshots).
- **Forward-Rollback**: Instead of deleting a version, a "Rollback" creates a *new* version entry with the content of the old one. This preserves the complete timeline of every change ever made.
- **JSON Serialization**: Complex fields like Bullets and Keywords are stored as JSON strings in the database and parsed in the Backend Model to ensure array integrity.
