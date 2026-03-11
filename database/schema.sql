

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "citext";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";      -- For fuzzy search (future AI matching)



CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(150) NOT NULL,
    phone_number VARCHAR(20) NOT NULL UNIQUE,
    email CITEXT UNIQUE,
    password_hash TEXT NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    is_admin BOOLEAN DEFAULT FALSE,
    trust_score INTEGER DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


CREATE INDEX idx_users_phone ON users(phone_number);
CREATE INDEX idx_users_email ON users(email);



-- CREATE TABLE institutions (
--     id SERIAL PRIMARY KEY,
--     name VARCHAR(200) NOT NULL,
--     city VARCHAR(100) NOT NULL,
--     is_active BOOLEAN DEFAULT TRUE,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    -- institution_id INT REFERENCES institutions(id) ON DELETE SET NULL,
    city VARCHAR(100) NOT NULL,
    -- area VARCHAR(150),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_locations_city ON locations(city);
-- CREATE INDEX idx_locations_institution ON locations(institution_id);

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TYPE item_status AS ENUM (
    'lost',
    'found',
    'claimed',
    'resolved',
    'rejected'
);

CREATE TABLE items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id INT REFERENCES categories(id),
    location_id INT REFERENCES locations(id),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    status item_status NOT NULL,
    -- reward_amount NUMERIC(10,2),
    is_active BOOLEAN DEFAULT TRUE,
    search_vector tsvector,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);




CREATE INDEX idx_items_status ON items(status);
CREATE INDEX idx_items_category ON items(category_id);
CREATE INDEX idx_items_location ON items(location_id);
CREATE INDEX idx_items_created ON items(created_at DESC);

-- Composite index for filtering
CREATE INDEX idx_items_filter
ON items(status, category_id, location_id);

-- Full-text search
CREATE INDEX idx_items_search_vector
ON items USING GIN(search_vector);

-- Fuzzy search
CREATE INDEX idx_items_title_trgm
ON items USING GIN (title gin_trgm_ops);



CREATE TYPE claim_status AS ENUM (
    'pending',
    'approved',
    'rejected'
);

CREATE TABLE claims (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    claimant_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message TEXT,
    verification_answer TEXT,
    status claim_status DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(item_id, claimant_id)
);

CREATE INDEX idx_claims_item ON claims(item_id);
CREATE INDEX idx_claims_claimant ON claims(claimant_id);
CREATE INDEX idx_claims_status ON claims(status);

-- CREATE TABLE messages (
--     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
--     claim_id UUID NOT NULL REFERENCES claims(id) ON DELETE CASCADE,
--     sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
--     message TEXT NOT NULL,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE INDEX idx_messages_claim ON messages(claim_id);


-- CREATE TABLE reports (
--     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
--     reporter_id UUID REFERENCES users(id) ON DELETE CASCADE,
--     item_id UUID REFERENCES items(id) ON DELETE CASCADE,
--     reason TEXT NOT NULL,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE INDEX idx_reports_item ON reports(item_id);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_items_updated
BEFORE UPDATE ON items
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_claims_updated
BEFORE UPDATE ON claims
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE OR REPLACE FUNCTION update_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector :=
        to_tsvector('english',
            coalesce(NEW.title,'') || ' ' ||
            coalesce(NEW.description,'')
        );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_search_vector
BEFORE INSERT OR UPDATE ON items
FOR EACH ROW EXECUTE FUNCTION update_search_vector();

CREATE OR REPLACE FUNCTION prevent_self_claim()
RETURNS TRIGGER AS $$
DECLARE
    owner UUID;
BEGIN
    SELECT user_id INTO owner FROM items WHERE id = NEW.item_id;

    IF owner = NEW.claimant_id THEN
        RAISE EXCEPTION 'You cannot claim your own item.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_prevent_self_claim
BEFORE INSERT ON claims
FOR EACH ROW
EXECUTE FUNCTION prevent_self_claim();



CREATE OR REPLACE FUNCTION resolve_item()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'approved' THEN
        UPDATE items
        SET status = 'resolved',
            is_active = FALSE
        WHERE id = NEW.item_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_resolve_item
AFTER UPDATE ON claims
FOR EACH ROW
WHEN (OLD.status IS DISTINCT FROM NEW.status)
EXECUTE FUNCTION resolve_item();



CREATE UNIQUE INDEX idx_unique_active_post
ON items(user_id, title)
WHERE is_active = TRUE;


-- these are the few colums add to the user table for authenticaiton  and authorization
-- ALTER TABLE users
-- ADD COLUMN email_verification_token TEXT,
-- ADD COLUMN email_verification_expires TIMESTAMP,
-- ADD COLUMN refresh_token TEXT;

-- ADD COLUMN reset_password_token TEXT,
-- ADD COLUMN reset_password_expires TIMESTAMP;