import Redis from 'ioredis';
import * as fs from 'fs';

/**
 * Export data from a Redis instance to a JSON file.
 *
 * @param {string} host - The Redis host.
 * @param {number} port - The Redis port.
 * @returns {Promise<void>}
 */
async function exportRedisData(host: string, port = 6379): Promise<void> {
  const client = new Redis({ host, port });

  try {
    const keys = await client.keys('*');
    const pipeline = client.pipeline();

    for (const key of keys) {
      pipeline.get(key);
    }

    const values = await pipeline.exec();
    const data = {};

    keys.forEach((key, index) => {
      // Using the second item in the tuple since ioredis pipeline returns [err, result]
      data[key] = values![index][1];
    });

    fs.writeFileSync('./files/redis-export.json', JSON.stringify(data, null, 2));
    console.log('Data exported successfully!');
  } catch (error) {
    console.error('Error exporting data:', error);
  } finally {
    await client.quit();
  }
}

exportRedisData(process.env.REDIS_HOST!);
