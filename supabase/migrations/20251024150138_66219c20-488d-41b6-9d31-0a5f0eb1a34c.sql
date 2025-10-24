-- Create profiles table for user data
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'practitioner',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create mappings table
CREATE TABLE IF NOT EXISTS public.mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  tradmed_term TEXT NOT NULL,
  tradmed_system TEXT NOT NULL,
  icd11_code TEXT NOT NULL,
  icd11_title TEXT,
  confidence_score DECIMAL(3,2) NOT NULL,
  reasoning TEXT,
  alternatives JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.mappings ENABLE ROW LEVEL SECURITY;

-- Mappings policies
CREATE POLICY "Users can view their own mappings"
  ON public.mappings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create mappings"
  ON public.mappings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own mappings"
  ON public.mappings FOR DELETE
  USING (auth.uid() = user_id);

-- Create knowledge base table
CREATE TABLE IF NOT EXISTS public.knowledge_concepts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  system TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  related_codes JSONB DEFAULT '[]'::jsonb,
  confidence DECIMAL(3,2),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Knowledge base is public read
ALTER TABLE public.knowledge_concepts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view knowledge concepts"
  ON public.knowledge_concepts FOR SELECT
  USING (true);

-- Function to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', '')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Insert sample knowledge concepts
INSERT INTO public.knowledge_concepts (system, title, description, related_codes, confidence) VALUES
('Ayurveda', 'Jwara (Fever)', 'Comprehensive fever disorders in Ayurveda, classified by dosha imbalance', '["MG26", "1F00"]'::jsonb, 0.94),
('Ayurveda', 'Atisara (Diarrhea)', 'Diarrheal conditions with various etiologies', '["DA92.0", "DA92.1"]'::jsonb, 0.87),
('Ayurveda', 'Vata Dosha', 'Biological air principle governing movement and nervous system', '["ME64", "8A00"]'::jsonb, 0.89),
('Siddha', 'Vatha (Vata equivalent)', 'Wind humor in Siddha medicine', '["ME64"]'::jsonb, 0.85),
('Unani', 'Humma (Fever)', 'Fever conditions in Unani medicine', '["MG26"]'::jsonb, 0.91),
('Yoga', 'Pranayama disorders', 'Respiratory and breath-related conditions', '["CA23", "CB03"]'::jsonb, 0.82);