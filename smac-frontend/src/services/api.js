export async function calculateAlloy(composition) {
  const response = await fetch('/api/v1/hesma/calculate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ composition }),
  })

  if (!response.ok) {
    const msg = await response.text()
    throw new Error(msg || 'Calculation failed')
  }

  return response.json()
}