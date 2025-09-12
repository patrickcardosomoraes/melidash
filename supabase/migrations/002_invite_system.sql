-- Migration: Add invite system tables
-- Created: 2025-01-12
-- Description: Adds tables for invitation-based user registration

-- Create invite status enum
CREATE TYPE invite_status AS ENUM ('PENDING', 'ACCEPTED', 'EXPIRED', 'REVOKED');

-- Create user roles enum
CREATE TYPE user_role AS ENUM ('ADMIN', 'USER');

-- Add missing fields to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS name VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS password VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS role user_role DEFAULT 'USER';
ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_token VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_token_expiry TIMESTAMP WITH TIME ZONE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS invited_by UUID REFERENCES users(id);
ALTER TABLE users ADD COLUMN IF NOT EXISTS invite_accepted_at TIMESTAMP WITH TIME ZONE;

-- Create invitations table
CREATE TABLE invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    invited_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status invite_status DEFAULT 'PENDING',
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    accepted_at TIMESTAMP WITH TIME ZONE,
    accepted_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT unique_pending_email UNIQUE (email, status) DEFERRABLE INITIALLY DEFERRED
);

-- Create partial unique index for pending invitations only
CREATE UNIQUE INDEX idx_invitations_email_pending 
    ON invitations (email) 
    WHERE status = 'PENDING';

-- Create indexes for better performance
CREATE INDEX idx_invitations_token ON invitations(token);
CREATE INDEX idx_invitations_invited_by ON invitations(invited_by);
CREATE INDEX idx_invitations_status ON invitations(status);
CREATE INDEX idx_invitations_expires_at ON invitations(expires_at);
CREATE INDEX idx_users_reset_token ON users(reset_token);
CREATE INDEX idx_users_role ON users(role);

-- Create trigger for invitations updated_at
CREATE TRIGGER update_invitations_updated_at BEFORE UPDATE ON invitations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS for invitations
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for invitations
-- Admins can view all invitations
CREATE POLICY "Admins can view all invitations" ON invitations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id::text = auth.uid()::text 
            AND users.role = 'ADMIN'
        )
    );

-- Admins can create invitations
CREATE POLICY "Admins can create invitations" ON invitations
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id::text = auth.uid()::text 
            AND users.role = 'ADMIN'
        )
    );

-- Admins can update invitations
CREATE POLICY "Admins can update invitations" ON invitations
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id::text = auth.uid()::text 
            AND users.role = 'ADMIN'
        )
    );

-- Admins can delete invitations
CREATE POLICY "Admins can delete invitations" ON invitations
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id::text = auth.uid()::text 
            AND users.role = 'ADMIN'
        )
    );

-- Function to automatically expire old invitations
CREATE OR REPLACE FUNCTION expire_old_invitations()
RETURNS void AS $$
BEGIN
    UPDATE invitations 
    SET status = 'EXPIRED', updated_at = NOW()
    WHERE status = 'PENDING' 
    AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Create a function to clean up expired invitations (optional)
CREATE OR REPLACE FUNCTION cleanup_expired_invitations()
RETURNS void AS $$
BEGIN
    -- First expire old invitations
    PERFORM expire_old_invitations();
    
    -- Optionally delete very old expired invitations (older than 30 days)
    DELETE FROM invitations 
    WHERE status = 'EXPIRED' 
    AND updated_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- Insert first admin user (update this with your actual admin email)
-- This will be the user who can send invitations
INSERT INTO users (email, name, role, created_at, updated_at)
VALUES (
    'admin@melidash.com', 
    'Admin MeliDash', 
    'ADMIN', 
    NOW(), 
    NOW()
) ON CONFLICT (email) DO UPDATE SET 
    role = 'ADMIN',
    updated_at = NOW();

-- Add comment to document the migration
COMMENT ON TABLE invitations IS 'Stores invitation tokens for user registration';
COMMENT ON COLUMN invitations.token IS 'Unique token used for invitation acceptance';
COMMENT ON COLUMN invitations.expires_at IS 'When the invitation expires';
COMMENT ON TYPE invite_status IS 'Status of an invitation: PENDING, ACCEPTED, EXPIRED, REVOKED';
COMMENT ON TYPE user_role IS 'User role: ADMIN can manage invitations, USER is regular user';