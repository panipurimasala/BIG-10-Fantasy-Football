from supabase import create_client

url = 'https://wkwaulwgblacatvcthvs.supabase.co'
key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indrd2F1bHdnYmxhY2F0dmN0aHZzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyOTU1NTA4NCwiZXhwIjoyMDQ1MTMxMDg0fQ.wiT8TU9Y1EI8R64AJPeEdXJZ7VxbpYGqro-FC7eQKG0'

supabase = create_client(url, key)

def create_table(new_table_name, existing_table_name):
    sql = f"""
    CREATE TABLE IF NOT EXISTS {new_table_name} (LIKE {existing_table_name} INCLUDING ALL);
    """
    supabase.rpc("execute_sql", {"query_statement": sql}).execute()
    sql_insert = f"""
        INSERT INTO {new_table_name} SELECT * FROM {existing_table_name};
        """
    try:
        supabase.rpc("execute_sql", {"query_statement": sql_insert}).execute()
    except Exception as e:
        print(f"Error creating table: {e}")

create_table("testing_table", "players")