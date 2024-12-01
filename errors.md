1) Duplicate private leagues can be created. Line 135 in LeaguePage.jsx needs to be fixed
2) Line 150, the table created after creating a private league should have its name, if I create "NathanLeague" then the table created with a copy of the players should be "NathanLeague_players".

3) league page errors
        CREATING LEAGUE ERRORS: const { error: createError } = await supabase.rpc('execute_sql', { query_statement: createTableSQL });