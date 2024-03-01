import fs from 'fs/promises';


export default async () => {
  const files = await fs.readdir('./userdata');

  let usedNumbers = [];

  for (const file of files) {
    const match = file.match(/^\d+\.json$/);
    if (match) {
      const number = parseInt(match[0]);
      if (!isNaN(number)) {
        usedNumbers.push(number);
      }
    }
  }

  let minNumber = 1;

  while (usedNumbers.includes(minNumber)) {
    minNumber++;
  }

  const id = minNumber;

  await fs.writeFile(`./userdata/${id}.json`, '{}');
  return id;
}