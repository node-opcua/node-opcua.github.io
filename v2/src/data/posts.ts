export interface Post {
  title: string;
  date: string;
  url: string;
  summary: string;
}

export const posts: Post[] = [
  {
    title: "Boosting OPCUA Communication with @sterfive/opcua-optimized-client",
    date: "2025-02-12",
    url: "/blog/2025/02/12/boosting-opcua-client-performance.html",
    summary: "In the world of industrial automation, efficient OPCUA communication is critical. Learn how the optimized client automatically manages embedded server quirks and batched transactions."
  },
  {
    title: "Enhancing Industrial Automation with OPC UA Modeling and Object-Oriented Process Modeling",
    date: "2024-03-19",
    url: "/blog/2024/03/19/OPC-UA-Model-vs-tag-naming-convention.html",
    summary: "A deep dive into OPC UA modeling, object-oriented process modeling, and how it compares to traditional tag naming conventions in industrial automation."
  },
  {
    title: "Ride the Open-Source Wave with NodeOPCUA: It's Smooth Sailing Ahead! 😎",
    date: "2023-07-08",
    url: "/blog/2023/07/08/ride-the-open-source-wave-with-node-opcua.html",
    summary: "A warm thank-you and check-in with the NodeOPCUA community, sharing the benefits of seamless operation, user-friendliness, and performance."
  },
  {
    title: "NodeOPCUA: When Seamless Operation Sparks a Sustainable Partnership",
    date: "2023-06-07",
    url: "/blog/2023/06/07/when-seamless-operation-sparks-sustainable-partneship.html",
    summary: "How industry-grade reliability and sustainable developer relationships can form strong foundations for automation infrastructure."
  },
  {
    title: "Node-OPCUA goes PubSub - Episode 1",
    date: "2022-02-16",
    url: "/blog/2022/02/16/node-opcua-pubsub-episode1.html",
    summary: "Introducing OPC UA Publish-Subscribe (PubSub) capabilities in node-opcua, explaining its architecture and why it's a game changer for high-throughput messaging."
  },
  {
    title: "Node-OPCUA goes typescript",
    date: "2019-01-15",
    url: "/blog/2019/01/15/node-opcua-goes-typescript.html",
    summary: "Announcing full TypeScript support and types in version 2.0.0, making client and server development more robust and self-documenting."
  },
  {
    title: "Node-Opcua 0.2.0 will make it easier than ever to write OPC-UA Client code",
    date: "2018-01-22",
    url: "/blog/2018/01/22/node-opcua-embraces-async-await.html",
    summary: "How the release of node-opcua version 0.2.0 leverages JavaScript ES2017 features like async/await to simplify code readability and flow control."
  },
  {
    title: "Node-Opcua 0.0.50 : ObjectType and Object instantiation",
    date: "2015-12-05",
    url: "/blog/2015/12/05/ObjectType-and-object-instantiation.html",
    summary: "Establish explicit reference links between Objects or Variables and their parent nodes using standard componentOf, propertyOf, or organizedBy relations."
  },
  {
    title: "Node-OPCUA 0.0.50 has been released",
    date: "2015-12-05",
    url: "/blog/2015/12/05/node-opcua-0-0-50-has-been-released.html",
    summary: "Details and highlights of the 0.0.50 release, bringing a significant list of improvements and bug fixes to the core codebase."
  },
  {
    title: "a weather station server in Node-OPCUA",
    date: "2015-07-05",
    url: "/blog/2015/07/05/weather-station.html",
    summary: "A comprehensive tutorial on creating a virtual weather station OPC UA server in Node-OPCUA, including real-time simulations and sensor modeling."
  }
];
