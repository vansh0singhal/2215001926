const express = require('express');
const app = express();
const port = 3000;

const data = {
  p: [2, 3, 5, 7],
  f: [1, 1, 2, 3, 5],
  e: [2, 4, 6, 8],
  r: [7, 13, 4, 22]
};

app.get('/numbers/:type', (req, res) => {
  const type = req.params.type;
  const response = {
    numbers: data[type] || []
  };

  setTimeout(() => {
    res.json(response);
  }, 300);
});

app.listen(port, () => {
  console.log(`✅ Mock API Server running on http://localhost:${port}`);
});
