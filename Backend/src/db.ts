import cassandra from 'cassandra-driver';

const client = new cassandra.Client({
  contactPoints: (process.env.CASSANDRA_CONTACT_POINTS || 'localhost').split(','),
  localDataCenter: process.env.CASSANDRA_LOCAL_DC || 'dc1',
  keyspace: process.env.CASSANDRA_KEYSPACE || 'cinetrack',
});

async function connect(): Promise<void> {
  let retries = 10;
  while (retries > 0) {
    try {
      await client.connect();
      console.log('Connected to Cassandra');
      return;
    } catch (err) {
      retries--;
      console.log(`Cassandra not ready, retrying... (${retries} left)`);
      await new Promise<void>((r) => setTimeout(r, 5000));
    }
  }
  throw new Error('Could not connect to Cassandra');
}

export { client, connect };
