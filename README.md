# Advanced Data Table Assignment

A production-quality data table application built with React, TypeScript, and FastAPI.
Demonstrates clean architecture, complex server-side filtering, and responsive design.

## Features

- **Infinite Scroll / Pagination**: Server-side pagination.
- **Advanced Filtering**: Multi-rule builder with AND/OR logic.
- **Sorting**: Multi-column sorting support.
- **Presets**: Save and load filter configurations (persisted to DB).
- **Responsive**: Mobile-first design.
- **Performance**: React Query for caching and optimized fetch.

## Tech Stack

### Frontend
- **React 18** + **TypeScript**
- **Vite** (Build tool)
- **TanStack Query (React Query)** (State Management)
- **Axios** (HTTP Client)
- **Vanilla CSS** (Design System with Variables)
- **Lucide React** (Icons)

### Backend
- **Python** + **FastAPI**
- **SQLAlchemy** (ORM)
- **SQLite** (Database)
- **Pydantic** (Validation)

## Setup Instructions

### 1. Backend

Prerequisites: Python 3.8+

```bash
cd backend
# Install dependencies
pip install -r requirements.txt

# Run server (Auto-reloads)
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
*API will run at http://localhost:8000*

### 2. Frontend

Prerequisites: Node.js 16+

```bash
cd frontend
# Install dependencies
npm install

# Run dev server
npm run dev
```
*App will run at http://localhost:5173*

## Usage Guide

1. **Seeding Data**: Click the "Seed Data" button in the header initially to populate the database with 500 mock records.
2. **Filtering**: Click "Filters" to open the advanced filter panel. Add rules like `Status Equals Success` OR `Amount Greater Than 500`.
3. **Presets**: Configure filters, then click "Presets" -> "Save Current View". You can reload them later.
4. **Sorting**: Click column headers to sort ASC/DESC.

## Architecture Decisions

- **Backend-Driven Logic**: Sorting and filtering are performed on the server (SQL) to support large datasets efficiently.
- **Separation of Concerns**: Frontend is split into Services (API), Hooks (State), and Components (UI).
- **Design System**: A `variables.css` file defines the token system (colors, spacing, shadows) ensuring UI consistency without a heavy framework like Tailwind, demonstrating CSS mastery.
