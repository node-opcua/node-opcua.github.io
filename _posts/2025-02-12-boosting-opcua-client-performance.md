# Boosting OPCUA Communication with @sterfive/opcua-optimized-client

In the world of industrial automation, efficient OPCUA communication is critical.

However, as many of you already know, not all OPCUA servers are created equal.

Many embedded or nano servers come with strict limitations such as reduced message sizes or restrictions on the number of batch items in requests (e.g., Read, Write, Browse).

This creates a scenario where even a well-designed client might hit performance bottlenecks or fail to fully leverage available resources.

**Enter @sterfive/opcua-optimized-client** – a professional module designed to automatically handle these quirks. By intelligently merging and splitting transactions to match each server’s limits, our module takes the hassle out of optimization. Under the hood, it dynamically adjusts communication flows so you can focus on your application logic rather than wrangling with low-level protocol constraints.

## The Problem: Not All Servers Are Created Equal

OPCUA is a powerful protocol, but its flexibility means that server implementations can vary widely:

- Limited message size: Some servers only allow small packets of data.
- Batch limitations: There might be constraints on the number of nodes you can read, write, or browse in one request.
- When using standard libraries like node-opcua, you often need to manually implement logic to split or combine requests. This not only complicates your code but also can lead to suboptimal performance if not done correctly.

## A Quick Benchmark: Standard vs. Optimized

To illustrate the impact of our optimized client, we conducted benchmarks comparing the raw performance of standard node-opcua usage versus using @sterfive/optimized-client. Here’s a look at the two approaches:

### Standard node-opcua Implementation

```javascript
const endpointUrl = `opc.tcp://opcuademo.sterfive.com:26543`;

const {
  OPCUAClient,
  getExtraDataTypeManager,
  resolveNodeId,
  MessageSecurityMode,
  SecurityPolicy,
} = require("node-opcua");

// use the old deprecated crawler 
const { NodeCrawler } = require("node-opcua-client-crawler");

const startDate = new Date();

async function main() {
  const client = OPCUAClient.create({});
  const nodeId = resolveNodeId("ns=2;i=5001"); // DeviceSets
  await client.withSessionAsync(endpointUrl, async (session) => {
    await getExtraDataTypeManager(session);
    const crawler = new NodeCrawler(session);
    const data = await crawler.read(nodeId);
  });

  const endDate = new Date();
  console.log("transaction stats : ", client.transactionsPerformed);
  console.log("bytes read        : ", client.bytesRead);
  console.log("bytes written     : ", client.bytesWritten);
  console.log("duration          : ", endDate - startDate, " ms");
}
``` 

### Optimized Approach with @sterfive/opcua-optimized-client

```javascript
const endpointUrl = `opc.tcp://opcuademo.sterfive.com:26543`;

const {
  OPCUAClient,
  getExtraDataTypeManager,
  resolveNodeId,
  MessageSecurityMode,
  SecurityPolicy,
} = require("node-opcua");

const { ClientSessionOptimized } = require("@sterfive/opcua-optimized-client");
// use the crawler
const { NodeCrawler2 } = require("@sterfive/crawler");

const startDate = new Date();

async function main() {
  const client = OPCUAClient.create({});
  const nodeId = resolveNodeId("ns=2;i=5001"); // DeviceSets
  await client.withSessionAsync(endpointUrl, async (session) => {

    // this is the magic line that puts your NodeOPCUA client 
    // session on steroid 
    const sessionOptimized = new ClientSessionOptimized(session);

    await getExtraDataTypeManager(sessionOptimized);
    const crawler = new NodeCrawler2(sessionOptimized);
    const data = await crawler.read(nodeId);
  });

  const endDate = new Date();
  console.log("transaction stats : ", client.transactionsPerformed);
  console.log("bytes read        : ", client.bytesRead);
  console.log("bytes written     : ", client.bytesWritten);
  console.log("duration          : ", endDate - startDate, " ms");
}
```

### Behind the Scenes: How It Works

The @sterfive/opcua-optimized-client module abstracts away the intricate details of adapting to various server limits. It automatically:

- **Merges or splits transactions**: Requests are bundled or divided as needed to fit the server’s constraints.
- **Handles continuous data points seamlessly**: No more manually segmenting large sets of data.
- **Optimizes communication**: By reducing the number of transactions and the amount of data transmitted, it minimizes overhead and maximizes throughput.

This means that, as a developer, you don’t have to worry about tailoring your requests to different server capabilities – the optimized client does all the heavy lifting for you.

### Performance Analysis: The Results Speak

Let’s look at some of the benchmark results we gathered:

#### Without optimisation

Results:

| Name                  | Standard | Optimized | Diff |
| --------------------- | -------- | --------- | ---- |
| transactionsPerformed | 643      | 75        | -88% |
| bytesRead             | 185346   | 152719    | -18% |
| bytesWritten          | 84363    | 30185     | -64% |
| duration              | 2425     | 1821      | -25% |

#### with NodeOPCUA on steroid ( using @sterfive/opcua-optimized-client)

| Name                  | Standard | Optimized | Diff |
| --------------------- | -------- | --------- | ---- |
| transactionsPerformed | 1495     | 143       | -90% |
| bytesRead             | 2302046  | 2045714   | -11% |
| bytesWritten          | 1202514  | 923818    | -23% |
| duration              | 14447    | 5996      | -58% |

### What does this mean?

- **Transactions Performed**: The optimized approach reduces the number of transactions dramatically, meaning fewer packets and less overhead.
- **Data Transfer (Bytes Read/Written)**: With fewer bytes being transferred, the overall load on the network is reduced.
- **Overall Duration**: A shorter duration indicates that the communication is faster and more efficient.

In summary, the optimized client not only simplifies your development process but also significantly boosts performance, which can be crucial in industrial applications where every millisecond counts.

## Sterfive’s Broader Ecosystem

This isn’t a standalone benefit. All Sterfive products, including [@OPCUA for NodeRed](https://flows.nodered.org/node/@opcua/for-node-red) and other specialized tools like [Sterfive OPCUA Aggregator](https://www.sterfive.com/product/aggregator/), leverage the performance improvements provided by the optimized client. 
Our industrial projects and software solutions for clients are consistently enhanced by the efficiency of @sterfive/opcua-optimized-client.

For members of the NodeOPCUA Support community (visit https://support.sterfive.com), this professional module offers a seamless upgrade path to complement and boost your existing node-opcua setups.

## Ready to Optimize Your OPCUA Communication?

If you’re looking to streamline your OPCUA communication and maximize performance, it’s time to see what @sterfive/opcua-optimized-client can do for you. Visit [www.sterfive.com](https://www.sterfive.com) and get in touch with us to learn more about our solutions and how we can help boost your projects.

Take the leap towards a more efficient OPCUA communication – let Sterfive be your partner in industrial innovation.

Happy coding!