const griddb = require('griddb-node-api')

const factory = griddb.StoreFactory.getInstance();
try {
  const store = factory.getStore({
    host: "127.0.0.1",
    port: 10001,
    clusterName: "myCluster",
    username: "admin",
    password: "admin",
  });

  const containerName = 'WorldPopulation';
  var conInfo = new griddb.ContainerInfo({
    'name': containerName,
    'columnInfoList': [
      ["timestamp", griddb.Type.TIMESTAMP],
      ["population", griddb.Type.STRING]
    ],
    'type': griddb.ContainerType.TIME_SERIES
  });

  //store.dropContainer(containerName)

  /**
  .then(() => {
      return store.putContainer(conInfo);
    })
    .then(() => {
      console.log("Create TimeSeries name=%s", containerName);
      console.log('Success!')
      return true;
    })
    .catch(err => {
      console.log(err);
    });
    */
} catch (error) {
  console.log(error);
}

