// importRedisData.ts

import Redis from 'ioredis';
import * as fs from 'fs';

/**
 * Import data from a JSON file to a Redis instance.
 *
 * @param {string} host - The Redis host.
 * @param {number} port - The Redis port.
 * @returns {Promise<void>}
 */
async function importRedisData(host: string, port = 6379): Promise<void> {
  const client = new Redis({ host, port });

  try {
    const rawData = fs.readFileSync('./files/redis-export.json', 'utf-8');
    const data = JSON.parse(rawData);
    const pipeline = client.pipeline();

    for (const key of Object.keys(data)) {
      pipeline.set(key, data[key]);
    }

    await pipeline.exec();
    console.log('Data imported successfully!');
  } catch (error) {
    console.error('Error importing data:', error);
  } finally {
    await client.quit();
  }
}

// To use this script, execute:
importRedisData(process.env.REDIS_HOST!);
