-- Migration script to change user_id to userid
-- Run this in your Supabase SQL Editor

-- Step 1: Rename the column from user_id to userid
ALTER TABLE public.tasks RENAME COLUMN user_id TO userid;

-- Step 2: Update RLS policies to use userid
DROP POLICY IF EXISTS "Users can view own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can insert own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can update own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can delete own tasks" ON public.tasks;

CREATE POLICY "Users can view own tasks" ON public.tasks
    FOR SELECT USING (auth.uid() = userid);

CREATE POLICY "Users can insert own tasks" ON public.tasks
    FOR INSERT WITH CHECK (auth.uid() = userid);

CREATE POLICY "Users can update own tasks" ON public.tasks
    FOR UPDATE USING (auth.uid() = userid);

CREATE POLICY "Users can delete own tasks" ON public.tasks
    FOR DELETE USING (auth.uid() = userid);

-- Step 3: Update indexes
DROP INDEX IF EXISTS idx_tasks_user_id;
CREATE INDEX IF NOT EXISTS idx_tasks_userid ON public.tasks(userid);

-- Step 4: Reload the API schema cache
SELECT pg_notify('pgrst', 'reload schema');
