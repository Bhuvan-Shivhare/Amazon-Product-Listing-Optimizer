# Amazon Listing Optimizer AI

A production-grade SEO tool that leverages Agentic AI to transform Amazon product listings. Built with a focus on conversion optimization, search visibility, and professional version control.

## Overview

Amazon Listing Optimizer AI is an intelligent SaaS-style platform designed for marketplace sellers. It automates the extraction of product data directly from Amazon ASINs and uses advanced Large Language Models (LLMs) to generate keyword-rich, high-converting copy. Unlike simple generators, this tool follows a "Forward-Rollback" versioning strategy, allowing users to track improvements and revert to previous high-performing versions with one click.

## The Problem

Amazon sellers often struggle with:
1. **SEO Complexity**: Identifying and placing high-intent keywords naturally.
2. **Compliance Risks**: Avoiding prohibited words that trigger listing suppressions.
3. **Data Silos**: No easy way to track how listing changes correlate with performance over time.

## Solution & Architecture

The application is built on a modern, decoupled architecture designed for scale and reliability.

### Backend (Node.js & Express)
- **Scraper Service**: Uses a headless multi-domain fallback strategy to bypass anti-bot measures and extract clean product data.
- **AI Engine (Groq + Llama 3.3)**: Implements curated system prompts to ensure outputs are Amazon-compliant, persuasive, and SEO-optimized.
- **Versioning Logic**: A custom MySQL-backed state machine handles optimization history, ensuring data integrity through an immutable versioning system.

### Frontend (React & Tailwind CSS)
- **SaaS Aesthetic**: Inspired by Linear and Apple, focusing on minimalist typography, subtle highlights, and a calm, professional color palette.
- **Comparison Engine**: Side-by-side analysis of original vs. optimized content with integrated AI confidence scores and strategy insights.
- **Performance**: High-efficiency state management with optimistic UI updates and real-time toast notifications.

## Tech Stack

- **Frontend**: React 19, Tailwind CSS, Vite
- **Backend**: Node.js, Express
- **AI**: Groq SDK (Llama 3.3 70B)
- **Database**: MySQL 8.0
- **Utilities**: Axios, Cheerio (Scraping), Diff logic

## Key AI Design Decisions

### Why Groq + Llama 3.3?
We chose **Groq** for its near-instant inference speeds, which is critical for a smooth user experience. The **Llama 3.3 70B** model was selected for its superior reasoning capabilities in structured JSON output and its ability to follow complex Amazon marketplace guidelines more reliably than smaller models.

### Optimization Logic
Each optimization pass analyzes:
- **Keyword Density**: Strategic placement of extracted high-value terms.
- **Readability**: Adjusting sentence structure for mobile-first shoppers.
- **Strategic Intent**: Moving from feature-heavy bullets to benefit-driven copy.

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MySQL
- Groq API Key

### Unified Execution (Recommended)

To run both the frontend and backend simultaneously in a single terminal:

```bash
# From the root directory
npm install
npm run dev
```

This will start:
- **Backend API** at `http://localhost:5001`
- **Frontend UI** at `http://localhost:5173`

---

### Manual Installation (Alternative)

1. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Add your DB credentials and GROQ_API_KEY
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

4. **Database Setup**
   - Run the contents of `init.sql` in your MySQL instance to create the schema.

## Demo Flow

1. **Input ASIN**: Paste an Amazon ASIN (e.g., `B07ZPKZSSC`) into the search bar.
2. **Analysis**: The system fetches original title, bullets, and description.
3. **Optimize**: Click "✨ Optimize Listing" to trigger the AI engine.
4. **Compare**: Review the side-by-side comparison, confidence score, and SEO strategy insight.
5. **History**: View past versions in the timeline and rollback if necessary.

## Interview Talking Points

- **Anti-Bot Mitigation**: Discussed the implementation of rotating headers and domain fallback to handle Amazon's scraper blocks.
- **State Management**: How the "Forward-Rollback" pattern ensures data consistency between the AI output and the relational database.
- **Prompt Engineering**: The use of few-shot prompting and strict JSON schema enforcement to guarantee production-ready AI outputs.
- **UX/UI Design**: Rationale behind the minimalist design to reduce cognitive load and focus on data accuracy.

## Future Improvements

- **Bulk Optimization**: Support for CSV uploads to optimize hundreds of ASINs at once.
- **Image Analysis**: AI-powered feedback on product images for Amazon compliance.
- **Real-time Rank Tracking**: Integrating with Amazon APIs to track keyword rankings after applying optimizations.
