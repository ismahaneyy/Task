# Supabase Setup Guide for TaskFlow AI

## 🚀 Quick Start

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `taskflow-ai` (or your preferred name)
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to your users
5. Click "Create new project"
6. Wait for project setup (usually 2-3 minutes)

### 2. Get Your Project Credentials
1. In your project dashboard, go to **Settings** → **API**
2. Copy your **Project URL** and **anon public** key
3. Update your `.env.local` file:

```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Set Up Database Schema
1. Go to **SQL Editor** in your Supabase dashboard
2. Copy the contents of `supabase-schema.sql`
3. Paste and run the SQL script
4. Verify tables are created in **Table Editor**

### 4. Configure Authentication
1. Go to **Authentication** → **Settings**
2. Under **Site URL**, add your development URL (e.g., `http://localhost:5173`)
3. Under **Redirect URLs**, add:
   - `http://localhost:5173/auth/callback`
   - `http://localhost:5173/`
4. Save changes

### 5. Test Your Setup
1. Run your development server: `npm run dev`
2. Try to sign up with a new account
3. Create some tasks
4. Verify data appears in Supabase dashboard

## 🔧 Database Schema

The setup creates two main tables:

### `users` Table
- `id`: UUID (references Supabase auth.users)
- `email`: User's email address
- `name`: User's display name
- `created_at`: Account creation timestamp

### `tasks` Table
- `id`: Unique task identifier
- `title`: Task title
- `description`: Optional task description
- `completed`: Task completion status
- `priority`: Priority level (low/medium/high/urgent)
- `category`: Task category
- `due_date`: Optional due date
- `created_at`: Task creation timestamp
- `updated_at`: Last modification timestamp
- `user_id`: Reference to user who owns the task

## 🔒 Security Features

- **Row Level Security (RLS)** enabled on all tables
- Users can only access their own data
- Automatic `updated_at` timestamp updates
- Proper foreign key constraints

## 📱 Real-time Features

- Tasks update in real-time across devices
- Automatic state synchronization
- Efficient database queries with proper indexing

## 🚨 Troubleshooting

### Common Issues

1. **"Missing Supabase environment variables"**
   - Check your `.env.local` file exists
   - Verify variables are correctly named
   - Restart your dev server after changes

2. **Authentication errors**
   - Verify Site URL and Redirect URLs in Supabase
   - Check browser console for CORS errors
   - Ensure RLS policies are properly set

3. **Database connection issues**
   - Verify your project URL and API key
   - Check if your project is active
   - Ensure database schema is properly created

4. **Real-time not working**
   - Check if Realtime is enabled in Supabase
   - Verify subscription setup in useTasks hook
   - Check browser console for connection errors

### Getting Help

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- [GitHub Issues](https://github.com/supabase/supabase/issues)

## 🔄 Migration from LocalStorage

Your existing localStorage data will not automatically migrate. To preserve user data:

1. Export localStorage data before switching
2. Create a migration script to import data
3. Or start fresh with the new Supabase backend

## 🎯 Next Steps

After successful setup, consider:

1. **Email Verification**: Enable email confirmation in Supabase
2. **Social Auth**: Add Google, GitHub, or other providers
3. **File Storage**: Use Supabase Storage for task attachments
4. **Edge Functions**: Add serverless functions for complex operations
5. **Analytics**: Use Supabase Analytics for usage insights
