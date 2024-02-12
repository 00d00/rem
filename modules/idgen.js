import { promises as fs } from 'fs';


export default async() => {
  const files = await fs.readdir('./userdata');

  let maxNumber = 0;

  for (const file of files) {
    const match = file.match(/^\d+\.json$/);
    if (match) {
      const number = parseInt(match[0]);
      if (!isNaN(number) && number > maxNumber) {
        maxNumber = number;
      }
    }
  }

  const id = maxNumber + 1;

  await fs.writeFile(`./userdata/${id}.json`, '{}');
  return id;
}