-- Unified Intelligence Schema for PostgreSQL 15+
-- Requires pgvector extension for semantic search
-- Created: 2026-01-01

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Master file tracking table
CREATE TABLE master_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    path TEXT UNIQUE NOT NULL,
    project TEXT,  -- Project name (e.g., 'retention-suite', 'music-empire') or 'system'
    size BIGINT,   -- File size in bytes
    hash_md5 TEXT,
    hash_sha256 TEXT,
    mime_type TEXT,
    extension TEXT,
    created TIMESTAMPTZ,
    modified TIMESTAMPTZ,
    last_accessed TIMESTAMPTZ,
    is_binary BOOLEAN,
    language TEXT,  -- Python, JavaScript, SQL, etc.
    encoding TEXT,  -- utf-8, ascii, etc.
    line_count INTEGER,
    metadata JSONB,  -- Flexible metadata storage
    embedding VECTOR(1536),  -- OpenAI embeddings for semantic search
    last_analyzed TIMESTAMPTZ,
    analysis_version TEXT,

    -- Indexes
    CONSTRAINT positive_size CHECK (size >= 0),
    CONSTRAINT positive_line_count CHECK (line_count >= 0)
);

-- Code intelligence table (for programming files)
CREATE TABLE code_intelligence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_id UUID REFERENCES master_files(id) ON DELETE CASCADE,
    imports TEXT[],  -- List of imports
    functions JSONB,  -- [{name, line_start, line_end, args, returns, docstring, complexity}]
    classes JSONB,    -- [{name, line_start, line_end, methods, bases, docstring}]
    variables JSONB,  -- Global/module-level variables
    complexity_score FLOAT,  -- Cyclomatic complexity
    quality_score FLOAT,     -- Code quality metric (0-100)
    dependencies JSONB,      -- External dependencies detected
    test_coverage FLOAT,     -- Test coverage percentage
    linter_issues JSONB,     -- Issues from linters (pylint, flake8, etc.)

    CONSTRAINT unique_file_code_intelligence UNIQUE (file_id),
    CONSTRAINT valid_complexity CHECK (complexity_score >= 0),
    CONSTRAINT valid_quality CHECK (quality_score BETWEEN 0 AND 100),
    CONSTRAINT valid_coverage CHECK (test_coverage BETWEEN 0 AND 100)
);

-- Cross-project file relationships
CREATE TABLE file_relationships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_file_id UUID REFERENCES master_files(id) ON DELETE CASCADE,
    target_file_id UUID REFERENCES master_files(id) ON DELETE CASCADE,
    relationship_type TEXT,  -- 'imports', 'calls', 'references', 'duplicates', 'similar'
    confidence FLOAT,        -- Confidence score (0-1)
    metadata JSONB,          -- Additional relationship metadata
    discovered_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT valid_confidence CHECK (confidence BETWEEN 0 AND 1),
    CONSTRAINT different_files CHECK (source_file_id != target_file_id),
    CONSTRAINT valid_relationship_type CHECK (
        relationship_type IN ('imports', 'calls', 'references', 'duplicates', 'similar', 'tests', 'config')
    )
);

-- Project-specific databases (track SQLite databases in projects)
CREATE TABLE project_databases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project TEXT NOT NULL,
    database_path TEXT UNIQUE NOT NULL,
    purpose TEXT,       -- Description of database purpose
    tables JSONB,       -- [{name, columns, row_count}]
    row_counts JSONB,   -- {table_name: row_count}
    size_bytes BIGINT,
    last_updated TIMESTAMPTZ,
    migrated BOOLEAN DEFAULT FALSE,
    migration_notes TEXT,

    CONSTRAINT positive_db_size CHECK (size_bytes >= 0)
);

-- Content metadata (images, audio, video)
CREATE TABLE content_metadata (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_id UUID REFERENCES master_files(id) ON DELETE CASCADE,
    content_type TEXT,  -- 'image', 'audio', 'video', 'document'
    dimensions JSONB,   -- {width, height} for images/video
    duration FLOAT,     -- seconds for audio/video
    format_details JSONB,  -- Format-specific metadata
    ai_generated BOOLEAN DEFAULT FALSE,
    ai_source TEXT,     -- 'leonardo', 'sora', 'midjourney', 'openai', 'custom', etc.
    ai_prompt TEXT,     -- Original prompt if AI-generated
    tags TEXT[],        -- Content tags
    description TEXT,   -- Content description
    embedding VECTOR(1536),  -- For semantic search
    monetization_status TEXT,  -- 'not_listed', 'nft', 'pod', 'stock', 'deployed'
    monetization_platforms JSONB,  -- [{platform, url, revenue}]

    CONSTRAINT unique_file_content UNIQUE (file_id),
    CONSTRAINT valid_content_type CHECK (
        content_type IN ('image', 'audio', 'video', 'document')
    ),
    CONSTRAINT valid_monetization CHECK (
        monetization_status IN ('not_listed', 'nft', 'pod', 'stock', 'deployed', 'archived')
    )
);

-- File access patterns (track usage for optimization)
CREATE TABLE file_access_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_id UUID REFERENCES master_files(id) ON DELETE CASCADE,
    access_type TEXT,  -- 'read', 'write', 'execute', 'analyze'
    accessed_at TIMESTAMPTZ DEFAULT NOW(),
    access_source TEXT,  -- Which tool/process accessed the file
    metadata JSONB,

    CONSTRAINT valid_access_type CHECK (
        access_type IN ('read', 'write', 'execute', 'analyze', 'index')
    )
);

-- Duplicate clusters (group duplicate files)
CREATE TABLE duplicate_clusters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hash_md5 TEXT NOT NULL,
    hash_sha256 TEXT NOT NULL,
    size_bytes BIGINT NOT NULL,
    file_count INTEGER NOT NULL,
    canonical_file_id UUID REFERENCES master_files(id) ON DELETE SET NULL,
    wasted_bytes BIGINT,  -- (file_count - 1) * size_bytes
    created_at TIMESTAMPTZ DEFAULT NOW(),
    resolved BOOLEAN DEFAULT FALSE,
    resolution_notes TEXT,

    CONSTRAINT positive_wasted_space CHECK (wasted_bytes >= 0),
    CONSTRAINT at_least_two_files CHECK (file_count >= 2)
);

-- Analysis jobs (track background analysis tasks)
CREATE TABLE analysis_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_type TEXT NOT NULL,  -- 'semantic_embedding', 'code_analysis', 'duplicate_detection'
    status TEXT NOT NULL,    -- 'queued', 'running', 'completed', 'failed'
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    files_processed INTEGER DEFAULT 0,
    total_files INTEGER,
    error_message TEXT,
    metadata JSONB,

    CONSTRAINT valid_job_status CHECK (
        status IN ('queued', 'running', 'completed', 'failed', 'cancelled')
    )
);

-- Indexes for performance
CREATE INDEX idx_master_files_project ON master_files(project);
CREATE INDEX idx_master_files_extension ON master_files(extension);
CREATE INDEX idx_master_files_language ON master_files(language);
CREATE INDEX idx_master_files_modified ON master_files(modified DESC);
CREATE INDEX idx_master_files_size ON master_files(size DESC);
CREATE INDEX idx_master_files_embedding ON master_files USING ivfflat (embedding vector_cosine_ops);

CREATE INDEX idx_code_intelligence_file ON code_intelligence(file_id);
CREATE INDEX idx_code_intelligence_complexity ON code_intelligence(complexity_score DESC);
CREATE INDEX idx_code_intelligence_quality ON code_intelligence(quality_score DESC);

CREATE INDEX idx_file_relationships_source ON file_relationships(source_file_id);
CREATE INDEX idx_file_relationships_target ON file_relationships(target_file_id);
CREATE INDEX idx_file_relationships_type ON file_relationships(relationship_type);

CREATE INDEX idx_content_metadata_file ON content_metadata(file_id);
CREATE INDEX idx_content_metadata_type ON content_metadata(content_type);
CREATE INDEX idx_content_metadata_ai_source ON content_metadata(ai_source);
CREATE INDEX idx_content_metadata_monetization ON content_metadata(monetization_status);
CREATE INDEX idx_content_metadata_embedding ON content_metadata USING ivfflat (embedding vector_cosine_ops);

CREATE INDEX idx_project_databases_project ON project_databases(project);
CREATE INDEX idx_project_databases_migrated ON project_databases(migrated);

CREATE INDEX idx_file_access_log_file ON file_access_log(file_id);
CREATE INDEX idx_file_access_log_time ON file_access_log(accessed_at DESC);

CREATE INDEX idx_duplicate_clusters_hash ON duplicate_clusters(hash_md5);
CREATE INDEX idx_duplicate_clusters_resolved ON duplicate_clusters(resolved);

CREATE INDEX idx_analysis_jobs_status ON analysis_jobs(status);
CREATE INDEX idx_analysis_jobs_type ON analysis_jobs(job_type);

-- Useful views

-- View: Files without embeddings (need semantic analysis)
CREATE VIEW files_needing_embeddings AS
SELECT id, path, project, extension, language, size
FROM master_files
WHERE embedding IS NULL
  AND is_binary = FALSE
  AND language IS NOT NULL;

-- View: High complexity code (potential refactoring targets)
CREATE VIEW high_complexity_code AS
SELECT mf.path, mf.project, ci.complexity_score, ci.quality_score
FROM master_files mf
JOIN code_intelligence ci ON mf.id = ci.file_id
WHERE ci.complexity_score > 20
ORDER BY ci.complexity_score DESC;

-- View: Duplicate summary (wasted space analysis)
CREATE VIEW duplicate_summary AS
SELECT
    dc.hash_md5,
    dc.size_bytes,
    dc.file_count,
    dc.wasted_bytes,
    dc.resolved,
    array_agg(mf.path) AS file_paths
FROM duplicate_clusters dc
JOIN file_relationships fr ON fr.source_file_id IN (
    SELECT id FROM master_files WHERE hash_md5 = dc.hash_md5
)
JOIN master_files mf ON mf.hash_md5 = dc.hash_md5
GROUP BY dc.id, dc.hash_md5, dc.size_bytes, dc.file_count, dc.wasted_bytes, dc.resolved;

-- View: Project file statistics
CREATE VIEW project_statistics AS
SELECT
    project,
    COUNT(*) AS total_files,
    SUM(size) AS total_size_bytes,
    COUNT(DISTINCT extension) AS unique_extensions,
    COUNT(CASE WHEN is_binary THEN 1 END) AS binary_files,
    COUNT(CASE WHEN is_binary = FALSE THEN 1 END) AS text_files,
    AVG(size) AS avg_file_size,
    MAX(modified) AS last_modified
FROM master_files
WHERE project IS NOT NULL
GROUP BY project
ORDER BY total_size_bytes DESC;

-- View: Content monetization summary
CREATE VIEW content_monetization_summary AS
SELECT
    content_type,
    ai_source,
    monetization_status,
    COUNT(*) AS file_count,
    SUM(mf.size) AS total_size_bytes
FROM content_metadata cm
JOIN master_files mf ON cm.file_id = mf.id
GROUP BY content_type, ai_source, monetization_status
ORDER BY file_count DESC;

-- Useful functions

-- Function: Find similar files by semantic search
CREATE OR REPLACE FUNCTION find_similar_files(
    query_file_id UUID,
    similarity_threshold FLOAT DEFAULT 0.8,
    max_results INT DEFAULT 10
)
RETURNS TABLE (
    file_id UUID,
    path TEXT,
    similarity FLOAT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        mf.id,
        mf.path,
        1 - (mf.embedding <=> (SELECT embedding FROM master_files WHERE id = query_file_id)) AS similarity
    FROM master_files mf
    WHERE mf.id != query_file_id
      AND mf.embedding IS NOT NULL
      AND 1 - (mf.embedding <=> (SELECT embedding FROM master_files WHERE id = query_file_id)) >= similarity_threshold
    ORDER BY mf.embedding <=> (SELECT embedding FROM master_files WHERE id = query_file_id)
    LIMIT max_results;
END;
$$ LANGUAGE plpgsql;

-- Function: Semantic search by text query
CREATE OR REPLACE FUNCTION semantic_search(
    query_embedding VECTOR(1536),
    max_results INT DEFAULT 20
)
RETURNS TABLE (
    file_id UUID,
    path TEXT,
    project TEXT,
    similarity FLOAT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        mf.id,
        mf.path,
        mf.project,
        1 - (mf.embedding <=> query_embedding) AS similarity
    FROM master_files mf
    WHERE mf.embedding IS NOT NULL
    ORDER BY mf.embedding <=> query_embedding
    LIMIT max_results;
END;
$$ LANGUAGE plpgsql;

-- Function: Get project dependency graph
CREATE OR REPLACE FUNCTION get_project_dependencies(project_name TEXT)
RETURNS TABLE (
    source_file TEXT,
    target_file TEXT,
    relationship TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        mf_source.path,
        mf_target.path,
        fr.relationship_type
    FROM file_relationships fr
    JOIN master_files mf_source ON fr.source_file_id = mf_source.id
    JOIN master_files mf_target ON fr.target_file_id = mf_target.id
    WHERE mf_source.project = project_name;
END;
$$ LANGUAGE plpgsql;

-- Comments for documentation
COMMENT ON TABLE master_files IS 'Central registry of all files across the ecosystem';
COMMENT ON TABLE code_intelligence IS 'Code analysis results for programming files';
COMMENT ON TABLE file_relationships IS 'Relationships between files (imports, calls, duplicates, etc.)';
COMMENT ON TABLE project_databases IS 'Inventory of SQLite databases in projects';
COMMENT ON TABLE content_metadata IS 'Metadata for images, audio, video, and documents';
COMMENT ON TABLE duplicate_clusters IS 'Groups of duplicate files for cleanup';
COMMENT ON TABLE analysis_jobs IS 'Background analysis job tracking';

-- Grant permissions (adjust as needed)
-- GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly_user;
-- GRANT ALL ON ALL TABLES IN SCHEMA public TO admin_user;
