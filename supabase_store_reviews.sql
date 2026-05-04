-- ==============================================================================
-- KGS HOME DÉCORS — Store Reviews Schema Update
-- Run this script in the Supabase SQL Editor to add the store reviews feature.
-- ==============================================================================

CREATE TABLE IF NOT EXISTS store_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL, -- Optional (for logged-in users)
  guest_name TEXT NOT NULL,                                     -- "John Doe"
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),  -- 1 to 5 stars
  review_text TEXT NOT NULL,                                    -- The actual testimonial
  is_approved BOOLEAN DEFAULT FALSE,                            -- Admin must approve before it shows
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast querying
CREATE INDEX IF NOT EXISTS idx_store_reviews_approved ON store_reviews(is_approved) WHERE is_approved = TRUE;
CREATE INDEX IF NOT EXISTS idx_store_reviews_created ON store_reviews(created_at DESC);

-- Enable Row Level Security
ALTER TABLE store_reviews ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read APPROVED reviews
CREATE POLICY "Approved reviews are viewable by everyone"
  ON store_reviews FOR SELECT
  USING (is_approved = TRUE);

-- Policy: Anyone can insert a review (goes into pending state)
CREATE POLICY "Anyone can submit a review"
  ON store_reviews FOR INSERT
  WITH CHECK (true);

-- Policy: Admin can do anything (assuming admin relies on service_role key, 
-- but if using RLS for admin, you need a rule here. We will use service_role key or disable RLS for admin API)

-- Auto-update timestamp trigger
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'store_reviews_updated_at') THEN
    CREATE TRIGGER store_reviews_updated_at
      BEFORE UPDATE ON store_reviews
      FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;
END $$;

-- ==============================================================================
-- Success! The store_reviews table is ready.
-- ==============================================================================
