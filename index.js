const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 8008;

let recentNumbers = [];
const MAX_WINDOW = 10;
const idTypeMap = {
  p: 'prime',
  f: 'fibo',
  e: 'even',
  r: 'rand'
};

function computeAverage(list) {
  if (!list.length) return 0;
  const total = list.reduce((sum, val) => sum + val, 0);
  return parseFloat((total / list.length).toFixed(2));
}

app.get('/numbers/:id', async (req, res) => {
  const { id } = req.params;

  if (!idTypeMap[id]) {
    return res.status(400).json({ error: 'Invalid type identifier' });
  }

  const targetURL = `http://localhost:3000/numbers/${idTypeMap[id]}`;
  const prevWindow = [...recentNumbers];
  let fetchedValues = [];

  try {
    const response = await axios.get(targetURL, { timeout: 500 });
    fetchedValues = response.data.numbers || [];

    const uniqueNew = fetchedValues.filter(n => !recentNumbers.includes(n));

    recentNumbers.push(...uniqueNew);

    if (recentNumbers.length > MAX_WINDOW) {
      recentNumbers = recentNumbers.slice(recentNumbers.length - MAX_WINDOW);
    }

    return res.json({
      windowPrevState: prevWindow,
      windowCurrState: [...recentNumbers],
      numbers: uniqueNew,
      avg: computeAverage(recentNumbers)
    });

  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch numbers in time' });
  }
});

app.listen(PORT, () => {
  console.log(`Microservice live at http://localhost:${PORT}`);
});
