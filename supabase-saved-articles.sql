-- Create saved_articles table for user saved articles
-- Run this in Supabase SQL Editor

-- Drop table if exists (for fresh start)
DROP TABLE IF EXISTS saved_articles;

-- Create saved_articles table
CREATE TABLE saved_articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  article_url TEXT NOT NULL,
  article_title TEXT,
  article_source TEXT,
  article_date TEXT,
  saved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE saved_articles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own saved articles
CREATE POLICY "Users can view own saved articles" ON saved_articles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own saved articles
CREATE POLICY "Users can insert own saved articles" ON saved_articles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own saved articles
CREATE POLICY "Users can delete own saved articles" ON saved_articles
  FOR DELETE
  USING (auth.uid() = user_id);

-- Policy: Users can update their own saved articles
CREATE POLICY "Users can update own saved articles" ON saved_articles
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_saved_articles_user_id ON saved_articles(user_id);

-- Create unique constraint to prevent duplicate saves
CREATE UNIQUE INDEX idx_saved_articles_unique 
  ON saved_articles(user_id, article_url);

-- Add comments
COMMENT ON TABLE saved_articles IS 'User saved articles for later reading';
COMMENT ON COLUMN saved_articles.user_id IS 'Reference to auth.users';
COMMENT ON COLUMN saved_articles.article_url IS 'Original article URL';
COMMENT ON COLUMN saved_articles.article_title IS 'Article title at time of saving';
COMMENT ON COLUMN saved_articles.saved_at IS 'When the article was saved';
