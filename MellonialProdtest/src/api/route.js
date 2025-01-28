async function handler() {
  const response = await fetch("https://database.create.xyz/v1/query", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.SQL_PASSWORD}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`,
    }),
  });

  if (!response.ok) {
    return { error: "Failed to fetch tables" };
  }

  const result = await response.json();

  if (!Array.isArray(result.rows)) {
    return { error: "Invalid response format" };
  }

  return { tables: result.rows.map((row) => row.table_name) };
}