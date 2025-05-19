const numbersPool = [
  '+18336529337',
  '+18336529445',
  '+18334353866'
];

let assignedNumbers = new Map();

export default function handler(req, res) {
  const { campaign, clickid } = req.query;

  if (!clickid) {
    return res.status(400).json({ error: 'Missing clickid parameter' });
  }

  if (assignedNumbers.has(clickid)) {
    return res.status(200).json({ phoneNumber: assignedNumbers.get(clickid) });
  }

  const assignedNumber = numbersPool[Math.floor(Math.random() * numbersPool.length)];
  assignedNumbers.set(clickid, assignedNumber);

  return res.status(200).json({ phoneNumber: assignedNumber });
}
