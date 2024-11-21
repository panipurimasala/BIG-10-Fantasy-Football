from supabase import create_client

url = 'https://wkwaulwgblacatvcthvs.supabase.co'
key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indrd2F1bHdnYmxhY2F0dmN0aHZzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyOTU1NTA4NCwiZXhwIjoyMDQ1MTMxMDg0fQ.wiT8TU9Y1EI8R64AJPeEdXJZ7VxbpYGqro-FC7eQKG0'

supabase = create_client(url, key)

def create_table(table_name):
    sql = f"""
    CREATE TABLE IF NOT EXISTS {table_name} (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
    );
    """
    try:
        response = supabase.rpc("execute_sql", {"query_statement": sql}).execute()
        print(f"Table '{table_name}' created successfully!")
    except Exception as e:
        print(f"Error creating table: {e}")

# Example usage
create_table("testing_table")