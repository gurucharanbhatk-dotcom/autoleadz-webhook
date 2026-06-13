const express = require('express');
const app = express();
app.use(express.json());

app.get('/webhook', (req, res) => {
  const verify_token = "autoleadz2026";
  if (req.query['hub.mode'] === 'subscribe' && 
      req.query['hub.verify_token'] === verify_token) {
    res.status(200).send(req.query['hub.challenge']);
  } else {
    res.sendStatus(403);
  }
});

app.post('/webhook', (req, res) => {
  const body = req.body;
  if (body.object === 'whatsapp_business_account') {
    body.entry?.forEach(entry => {
      entry.changes?.forEach(change => {
        const messages = change.value?.messages;
        if (messages) {
          messages.forEach(msg => {
            console.log('From:', msg.from);
            console.log('Message:', msg.text?.body);
            fetch('https://hook.eu1.make.com/uth6xybioxmqptlnnpsf5sgq3ecytb98', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    from: msg.from,
    message: msg.text?.body || '',
    timestamp: msg.timestamp,
    phone_number_id: change.value?.metadata?.phone_number_id
  })
}).catch(err => console.log('Make error:', err));
          });
        }
      });
    });
  }
  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('AutoLeadz webhook running on port ' + PORT);
});
