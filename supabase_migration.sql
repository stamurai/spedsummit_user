-- ============================================================
-- SPED Summit — Supabase Migration
-- Run this in the Supabase Dashboard → SQL Editor
-- ============================================================

-- ── 1. Add quiz_questions column to sessions ──────────────────
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS quiz_questions jsonb;

-- ── 2. Seed quiz questions for sessions 1-6 ──────────────────
UPDATE sessions SET quiz_questions = '[
  {"q":"What does a ''window of tolerance'' refer to in trauma-informed teaching?","opts":["The classroom noise level","The zone of optimal arousal for learning","Break time between lessons","Window ventilation policy"],"a":1},
  {"q":"Which mindfulness strategy is most suitable for in-classroom use?","opts":["30-minute meditation","Box breathing exercises","Silent retreats","Yoga sessions"],"a":1},
  {"q":"Teacher burnout is BEST prevented by:","opts":["Working longer hours","Ignoring student behaviour","Proactive self-care routines","Reducing lesson planning"],"a":2},
  {"q":"Somatic awareness in the classroom primarily helps students:","opts":["Memorise content faster","Recognise physical signs of stress","Improve handwriting","Complete homework faster"],"a":1},
  {"q":"Which approach reflects a trauma-informed classroom practice?","opts":["Zero-tolerance discipline","Predictable routines and co-regulation","Frequent surprise tests","Competitive grading"],"a":1}
]'::jsonb WHERE id = 1;

UPDATE sessions SET quiz_questions = '[
  {"q":"The term ''least restrictive environment'' (LRE) means:","opts":["Fewest rules in the classroom","Students learn in settings as close to general ed as appropriate","No assistive technology","Unlimited accommodation"],"a":1},
  {"q":"Which accommodation is most commonly used for students with dyslexia?","opts":["Reduced recess","Extended time on tests","Smaller font size","Fewer subjects"],"a":1},
  {"q":"Co-teaching models BEST support inclusive classrooms by:","opts":["Separating students by ability","Having two teachers share instruction for all students","Giving IEP students a separate room","Using only visual materials"],"a":1},
  {"q":"Universal Design for Learning (UDL) primarily focuses on:","opts":["One-size-fits-all curriculum","Multiple means of engagement, representation, and action","Physical classroom layout","Standardised test scores"],"a":1},
  {"q":"An IEP is a legally binding document that:","opts":["Replaces the general curriculum","Outlines individualised goals and services for a student","Restricts a student''s participation","Is optional for public schools"],"a":1}
]'::jsonb WHERE id = 2;

UPDATE sessions SET quiz_questions = '[
  {"q":"DHH stands for:","opts":["Differently Hearing Humans","Deaf and Hard of Hearing","Dual Hearing Hierarchy","Dynamic Hearing Help"],"a":1},
  {"q":"Total Communication in DHH education combines:","opts":["Only sign language","Multiple modes including speech, sign, and visual aids","Only oral speech","Written language only"],"a":1},
  {"q":"Phonological awareness is important for DHH learners primarily because:","opts":["It replaces sign language","It supports literacy and reading development","It improves hearing","It eliminates the need for captioning"],"a":1},
  {"q":"Which tool BEST supports DHH students in a mainstream classroom?","opts":["Louder teacher voice","FM system or sound field amplification","Removing all distractions","Sending notes home"],"a":1},
  {"q":"Language deprivation in early childhood can result in:","opts":["Faster language acquisition later","Lifelong gaps in language development","No impact on learning","Better visual skills"],"a":1}
]'::jsonb WHERE id = 3;

UPDATE sessions SET quiz_questions = '[
  {"q":"Effective paraeducator supervision starts with:","opts":["Trial and error","Clear role definitions and expectations","Daily observation reports","Reducing their responsibilities"],"a":1},
  {"q":"Which delegation model works BEST in special education settings?","opts":["Delegating everything to paraeducators","Task-specific delegation with clear guidance and feedback","Allowing paraeducators to set their own goals","Avoiding delegation entirely"],"a":1},
  {"q":"Communication between teachers and paraeducators should be:","opts":["Only during IEP meetings","Ongoing, structured, and collaborative","Handled entirely by administration","Limited to written notes"],"a":1},
  {"q":"Which practice MOST supports student independence in the classroom?","opts":["Constant one-on-one paraeducator support","Fading prompts systematically over time","Paraeducator completing tasks for the student","Removing all support immediately"],"a":1},
  {"q":"Paraeducators should primarily be trained in:","opts":["Curriculum design","Behaviour management and instructional strategies","Administrative tasks","Parent communication only"],"a":1}
]'::jsonb WHERE id = 4;

UPDATE sessions SET quiz_questions = '[
  {"q":"Which AI tool is MOST commonly used for personalised learning in SPED?","opts":["Social media platforms","Adaptive learning software","Generic search engines","Word processors"],"a":1},
  {"q":"Text-to-speech technology MOST benefits students with:","opts":["High reading ability","Reading disabilities and visual impairments","No accommodations needed","Advanced math skills"],"a":1},
  {"q":"When implementing AI tools in SPED, educators should prioritise:","opts":["Speed of implementation","Student data privacy and ethical use","Using the most expensive tools","Replacing human instruction entirely"],"a":1},
  {"q":"Predictive text and word banks primarily support students with:","opts":["Hearing impairments","Motor difficulties and expressive language challenges","Vision impairments","Behavioural challenges"],"a":1},
  {"q":"The BEST approach when evaluating an AI tool for classroom use is:","opts":["Adopt immediately if popular","Pilot with a small group and assess impact on student outcomes","Rely solely on vendor claims","Avoid all AI tools"],"a":1}
]'::jsonb WHERE id = 5;

UPDATE sessions SET quiz_questions = '[
  {"q":"AAC stands for:","opts":["Adapted Academic Curriculum","Augmentative and Alternative Communication","Accessible Audio Content","Applied Assistive Concepts"],"a":1},
  {"q":"Which students MOST benefit from AAC devices?","opts":["Students with advanced reading skills","Students with complex communication needs","Students who prefer writing","Students learning a second language"],"a":1},
  {"q":"The principle of ''presumed competence'' in AAC means:","opts":["Assuming students cannot learn","Assuming all students have the potential to communicate and learn","Waiting until a student proves ability before providing AAC","Only using AAC after all other options fail"],"a":1},
  {"q":"Modelling language on an AAC device is BEST described as:","opts":["Telling students what to say","The teacher using the device to demonstrate language naturally","Restricting device use to break times","Letting students explore without guidance"],"a":1},
  {"q":"Which is a key barrier to successful AAC implementation?","opts":["Having too many vocabulary options","Lack of training and consistent use across environments","Using high-tech devices","Involving families in the process"],"a":1}
]'::jsonb WHERE id = 6;

-- ── 3. Create seasons table ───────────────────────────────────
CREATE TABLE IF NOT EXISTS seasons (
  id          text PRIMARY KEY,
  name        text NOT NULL,
  tagline     text,
  description text,
  session_ids integer[] DEFAULT '{}',
  color       text,
  bg          text,
  updated_at  text
);

INSERT INTO seasons (id, name, tagline, description, session_ids, color, bg, updated_at) VALUES
  ('spring-2026', 'Spring 2026', 'Live & Upcoming',  'Current live sessions and upcoming content for the Spring 2026 SPED Summit.',          ARRAY[1,2,5,6], '#2563eb', '#dbeafe', 'Apr 2026'),
  ('winter-2026', 'Winter 2026', 'Past Season',       'Recorded sessions from the Winter 2026 SPED Summit. All recordings available.',         ARRAY[3,4],     '#5D636F', '#f3f4f6', 'Jan 2026'),
  ('summer-2026', 'Summer 2026', 'Past Season',       'Recorded sessions from the Summer 2026 SPED Summit. All recordings available.',         ARRAY[5,6],     '#5D636F', '#f3f4f6', 'Jul 2026'),
  ('spring-2025', 'Spring 2025', 'Past Season',       'Recorded sessions from the Spring 2025 SPED Summit. All recordings available.',         ARRAY[1,3],     '#5D636F', '#f3f4f6', 'Apr 2025'),
  ('winter-2025', 'Winter 2025', 'Past Season',       'Recorded sessions from the Winter 2025 SPED Summit. All recordings available.',         ARRAY[2,4],     '#5D636F', '#f3f4f6', 'Jan 2025'),
  ('summer-2025', 'Summer 2025', 'Past Season',       'Recorded sessions from the Summer 2025 SPED Summit. All recordings available.',         ARRAY[1,2],     '#5D636F', '#f3f4f6', 'Jul 2025'),
  ('spring-2024', 'Spring 2024', 'Past Season',       'Recorded sessions from the Spring 2024 SPED Summit. All recordings available.',         ARRAY[3,5],     '#5D636F', '#f3f4f6', 'Apr 2024'),
  ('winter-2024', 'Winter 2024', 'Past Season',       'Recorded sessions from the Winter 2024 SPED Summit. All recordings available.',         ARRAY[4,6],     '#5D636F', '#f3f4f6', 'Jan 2024'),
  ('summer-2024', 'Summer 2024', 'Past Season',       'Recorded sessions from the Summer 2024 SPED Summit. All recordings available.',         ARRAY[1,4],     '#5D636F', '#f3f4f6', 'Jul 2024')
ON CONFLICT (id) DO NOTHING;

-- ── 4. Create schedule table ──────────────────────────────────
CREATE TABLE IF NOT EXISTS schedule (
  id          integer PRIMARY KEY,
  session_id  integer,
  date        text,
  time        text,
  type        text,
  title       text,
  description text,
  status      text,
  cta         text,
  instructor  text
);

INSERT INTO schedule (id, session_id, date, time, type, title, description, status, cta, instructor) VALUES
  (1, 1, '26th Mar',       '09:00 AM', 'OPENING',          'Mental Health & Teacher Wellness in Special Education',           'Sarah Habib—Occupational Therapist and founder of The Calm Caterpillar—shares practical, mindfulness-based strategies to support emotional regulation and wellness for both students and educators.',                                                            'past',     'Watch Again',          'Tara Roehl'),
  (2, 2, '26th Mar',       '11:00 AM', 'KEYNOTE',          'Accommodations & Inclusion: Integrating Students into Mainstream','Casey Harrison—Certified Dyslexia Specialist—shares practical, research-aligned strategies to support students with dyslexia and language-based learning differences.',                                                                                'past',     'Resume Lesson',        'Casey Harrison'),
  (3, 3, '6th Jan 2025',   '09:00 AM', 'WORKSHOP',         'Empowering Language and Literacy Skills with DHH Children',       'Sydney Bassard—Speech-Language Pathologist—shares practical, evidence-informed strategies to build strong language and literacy foundations in children who are Deaf or Hard of Hearing.',                                                            'past',     'Recording Unavailable','Jordan Smith'),
  (4, 4, '7th Jan 2025',   '02:00 PM', 'NETWORKING',       'Paraeducators & Team Collaboration: Training, Delegation & More', 'Diana Williams shares practical, leadership-driven strategies for building strong, collaborative partnerships between teachers and paraeducators.',                                                                                                  'past',     'Watch Again',          'Morgan Lee'),
  (5, 5, '15th Apr',       '09:00 AM', 'WORKSHOP',         'AI and Advanced Technologies in SPED',                            'Join Dr. Emily Tran as she guides educators through the process of utilizing data to inform teaching practices and enhance student learning.',                                                                                                    'upcoming', 'Registered',           'Dr. Emily Tran'),
  (6, 6, '15th Apr',       '11:00 AM', 'PANEL DISCUSSION', 'Understanding & Supporting Communication for Students with AAC',  'A panel of AAC specialists discuss implementation strategies, device selection, and how to create truly inclusive communication environments.',                                                                                                  'upcoming', 'Register',             'Dr. Sarah Kim')
ON CONFLICT (id) DO NOTHING;

-- ── 5. Enable RLS (read-only public access for seasons & schedule) ─
ALTER TABLE seasons  ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule ENABLE ROW LEVEL SECURITY;

CREATE POLICY "seasons_public_read"  ON seasons  FOR SELECT USING (true);
CREATE POLICY "schedule_public_read" ON schedule FOR SELECT USING (true);

-- ── 6. Add completed_at and updated_at to user_progress ──────
ALTER TABLE user_progress ADD COLUMN IF NOT EXISTS completed_at timestamptz;
ALTER TABLE user_progress ADD COLUMN IF NOT EXISTS updated_at   timestamptz DEFAULT now();

-- Auto-update updated_at on every row change
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS user_progress_updated_at ON user_progress;
CREATE TRIGGER user_progress_updated_at
  BEFORE UPDATE ON user_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── 7. Create comment_likes table ────────────────────────────
CREATE TABLE IF NOT EXISTS comment_likes (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  comment_id uuid REFERENCES session_comments(id) ON DELETE CASCADE,
  user_id    uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(comment_id, user_id)
);

ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own likes" ON comment_likes;
CREATE POLICY "Users manage own likes" ON comment_likes
  FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Anyone can read likes" ON comment_likes;
CREATE POLICY "Anyone can read likes" ON comment_likes
  FOR SELECT USING (true);

-- Reset inflated like counts from before per-user tracking
UPDATE session_comments SET likes = 0;

-- ── 8. Create avatars storage bucket ─────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Users upload own avatar"  ON storage.objects;
DROP POLICY IF EXISTS "Users update own avatar"  ON storage.objects;
DROP POLICY IF EXISTS "Users delete own avatar"  ON storage.objects;
DROP POLICY IF EXISTS "Public read avatars"      ON storage.objects;

CREATE POLICY "Users upload own avatar" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users update own avatar" ON storage.objects
  FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users delete own avatar" ON storage.objects
  FOR DELETE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Public read avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

-- ── 9. Send-referral Edge Function reminder ───────────────────
-- Deploy via: supabase functions deploy send-referral
-- Set secret:  supabase secrets set RESEND_API_KEY=re_your_key_here
