import griddb from "griddb_node";

const factory = griddb.StoreFactory.getInstance();
const containerName = "my_container";

const store = factory.getStore({
  host: "localhost",
  port: 10001,
  clusterName: "griddb_cluster",
  username: "admin",
  password: "admin",
});

store.on("error", (err) => {
  console.error(err);
});

const conInfo = new griddb.ContainerInfo({
  name: containerName,
  columnInfoList: [
    { name: "id", type: griddb.Type.LONG },
    { name: "value", type: griddb.Type.STRING },
  ],
  type: griddb.ContainerType.COLLECTION,
  rowKey: true,
});

store.putContainer(conInfo, (err, container) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`Container ${container.getName()} created`);
    store.close();
  }
});
