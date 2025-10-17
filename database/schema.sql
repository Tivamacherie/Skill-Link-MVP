-- Skill-Link Database Schema
-- MySQL Database for the Skill-Link application

-- Drop database if exists and create new one
DROP DATABASE IF EXISTS skill_link;
CREATE DATABASE skill_link;
USE skill_link;

-- Users table (extends Firebase Auth users)
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    firebase_uid VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    bio TEXT,
    profile_picture_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_sessions INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_online BOOLEAN DEFAULT FALSE,
    
    INDEX idx_firebase_uid (firebase_uid),
    INDEX idx_email (email),
    INDEX idx_is_active (is_active),
    INDEX idx_rating (rating)
);

-- Skills table
CREATE TABLE skills (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(50),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_name (name),
    INDEX idx_category (category)
);

-- User Skills (what they can teach)
CREATE TABLE user_skills (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    skill_id INT NOT NULL,
    proficiency_level ENUM('Beginner', 'Intermediate', 'Advanced', 'Expert') DEFAULT 'Intermediate',
    years_experience INT,
    description TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_skill (user_id, skill_id),
    INDEX idx_user_id (user_id),
    INDEX idx_skill_id (skill_id),
    INDEX idx_proficiency (proficiency_level)
);

-- User Learning Interests (what they want to learn)
CREATE TABLE user_learning_interests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    skill_id INT NOT NULL,
    urgency_level ENUM('Low', 'Medium', 'High') DEFAULT 'Medium',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_interest (user_id, skill_id),
    INDEX idx_user_id (user_id),
    INDEX idx_skill_id (skill_id),
    INDEX idx_urgency (urgency_level)
);

-- Skill Matches (connections between users)
CREATE TABLE skill_matches (
    id INT PRIMARY KEY AUTO_INCREMENT,
    teacher_user_id INT NOT NULL,
    learner_user_id INT NOT NULL,
    skill_id INT NOT NULL,
    status ENUM('Pending', 'Accepted', 'Rejected', 'Blocked') DEFAULT 'Pending',
    match_score DECIMAL(5,2), -- Algorithm-calculated compatibility score
    teacher_message TEXT,
    learner_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (teacher_user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (learner_user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
    UNIQUE KEY unique_match (teacher_user_id, learner_user_id, skill_id),
    INDEX idx_teacher (teacher_user_id),
    INDEX idx_learner (learner_user_id),
    INDEX idx_skill (skill_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);

-- Appointments/Sessions
CREATE TABLE appointments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    match_id INT NOT NULL,
    scheduled_date DATE NOT NULL,
    scheduled_time TIME NOT NULL,
    duration_minutes INT DEFAULT 60,
    timezone VARCHAR(50) DEFAULT 'UTC',
    location_type ENUM('Online', 'In-Person', 'Hybrid') DEFAULT 'Online',
    location_details TEXT,
    status ENUM('Scheduled', 'Confirmed', 'In-Progress', 'Completed', 'Cancelled', 'No-Show') DEFAULT 'Scheduled',
    session_notes TEXT,
    teacher_rating TINYINT CHECK (teacher_rating >= 1 AND teacher_rating <= 5),
    learner_rating TINYINT CHECK (learner_rating >= 1 AND learner_rating <= 5),
    teacher_feedback TEXT,
    learner_feedback TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (match_id) REFERENCES skill_matches(id) ON DELETE CASCADE,
    INDEX idx_match_id (match_id),
    INDEX idx_scheduled_date (scheduled_date),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);

-- Chat Conversations (for Firebase Firestore reference)
CREATE TABLE conversations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    firestore_id VARCHAR(255) UNIQUE NOT NULL, -- Reference to Firestore document
    participant1_id INT NOT NULL,
    participant2_id INT NOT NULL,
    match_id INT,
    last_message_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (participant1_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (participant2_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (match_id) REFERENCES skill_matches(id) ON DELETE SET NULL,
    UNIQUE KEY unique_participants (participant1_id, participant2_id),
    INDEX idx_participants (participant1_id, participant2_id),
    INDEX idx_firestore_id (firestore_id),
    INDEX idx_last_message (last_message_at)
);

-- User Reviews and Ratings
CREATE TABLE user_reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    appointment_id INT NOT NULL,
    reviewer_id INT NOT NULL,
    reviewed_id INT NOT NULL,
    rating TINYINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewed_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_review (appointment_id, reviewer_id),
    INDEX idx_reviewed (reviewed_id),
    INDEX idx_reviewer (reviewer_id),
    INDEX idx_rating (rating),
    INDEX idx_created_at (created_at)
);

-- Notifications
CREATE TABLE notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    type ENUM('Match_Request', 'Match_Accepted', 'Appointment_Scheduled', 'Appointment_Reminder', 'Message', 'Review', 'System') NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    related_id INT, -- Can reference match_id, appointment_id, etc.
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_type (type),
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at)
);

-- User Availability Schedule
CREATE TABLE user_availability (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    day_of_week TINYINT NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Sunday, 6=Saturday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    timezone VARCHAR(50) DEFAULT 'UTC',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_day_of_week (day_of_week),
    INDEX idx_is_active (is_active)
);

-- Insert sample skills
INSERT INTO skills (name, category, description) VALUES
('English', 'Language', 'English language conversation and grammar'),
('Spanish', 'Language', 'Spanish language learning and practice'),
('French', 'Language', 'French language conversation and culture'),
('Guitar', 'Music', 'Acoustic and electric guitar playing'),
('Piano', 'Music', 'Piano playing from beginner to advanced'),
('Programming', 'Technology', 'Software development and coding'),
('Web Development', 'Technology', 'HTML, CSS, JavaScript, and web frameworks'),
('Photography', 'Creative', 'Digital photography and photo editing'),
('Cooking', 'Lifestyle', 'Culinary skills and recipe sharing'),
('Yoga', 'Fitness', 'Yoga practice and meditation'),
('Drawing', 'Creative', 'Art and illustration techniques'),
('Data Science', 'Technology', 'Data analysis and machine learning'),
('Marketing', 'Business', 'Digital marketing and social media'),
('Writing', 'Creative', 'Creative and technical writing skills'),
('Public Speaking', 'Communication', 'Presentation and speaking skills');

-- Create indexes for performance
CREATE INDEX idx_users_rating_active ON users(rating DESC, is_active);
CREATE INDEX idx_appointments_date_status ON appointments(scheduled_date, status);
CREATE INDEX idx_skill_matches_status_created ON skill_matches(status, created_at DESC);

-- Create views for common queries
CREATE VIEW active_users AS
SELECT u.*, 
       COUNT(DISTINCT us.skill_id) as skills_count,
       COUNT(DISTINCT uli.skill_id) as interests_count
FROM users u
LEFT JOIN user_skills us ON u.id = us.user_id
LEFT JOIN user_learning_interests uli ON u.id = uli.user_id
WHERE u.is_active = TRUE
GROUP BY u.id;

CREATE VIEW user_skill_summary AS
SELECT u.id as user_id,
       u.display_name,
       u.rating,
       GROUP_CONCAT(DISTINCT s1.name) as can_teach,
       GROUP_CONCAT(DISTINCT s2.name) as wants_to_learn
FROM users u
LEFT JOIN user_skills us ON u.id = us.user_id
LEFT JOIN skills s1 ON us.skill_id = s1.id
LEFT JOIN user_learning_interests uli ON u.id = uli.user_id
LEFT JOIN skills s2 ON uli.skill_id = s2.id
WHERE u.is_active = TRUE
GROUP BY u.id, u.display_name, u.rating;