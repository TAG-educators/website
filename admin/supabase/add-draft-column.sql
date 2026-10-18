-- Add support for the admin "Preview before publish" workflow.
-- Adds an optional draft_sections column to the pages table so the
-- admin can save a preview draft without touching the live sections.
--
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query).
alter table public.pages add column if not exists draft_sections jsonb;
