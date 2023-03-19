const griddb = require('griddb-node-api')

const containerName = 'WorldPopulation'

const factory = griddb.StoreFactory.getInstance();
try {

	// Connect to GridDB Cluster
	const store = factory.getStore({
		host: "127.0.0.1",
		// transaction port (see in griddb config gs_cluster.json)
		port: 10001,
		clusterName: "myCluster",
		username: "admin",
		password: "admin",
	});

	// Initialize container but not yet create it
	const conInfo = new griddb.ContainerInfo({
		'name': containerName,
		'columnInfoList': [
			["date", griddb.Type.TIMESTAMP],
			["value", griddb.Type.DOUBLE]
		],
		'type': griddb.ContainerType.TIME_SERIES
	});

	let timeSeriesDB;
	// Create container
	store.putContainer(conInfo).then((db) => {
		timeSeriesDB = db

		for (var index = 0; index < store.partitionController.partitionCount; index++) {
			store.partitionController.getContainerNames(index, 0, -1)
				.then(nameList => {
					nameList.forEach(element => {
						// Get container information
						store.getContainerInfo(element)
							.then((info) => {
								console.log("Get ContainerInfo: \n    name=%s", info.name);
								if (info.type == griddb.ContainerType.COLLECTION) {
									console.log('    type=Collection');
								} else {
									console.log('    type=TimeSeries');
								}
								console.log("    rowKeyAssigned=%s", info.rowKey.toString());
								console.log("    columnCount=%d", info.columnInfoList.length);
								info.columnInfoList.forEach(
									element => console.log("    column (%s, %d)", element[0], element[1])
								);
								console.log('Success!');
							})
						console.log(element)
					});
					return true;
				})
				.catch(err => {
					if (err.constructor.name == 'GSException') {
						for (var i = 0; i < err.getErrorStackSize(); i++) {
							console.log("[%d]", i);
							console.log(err.getErrorCode(i));
							console.log(err.getMessage(i));
						}
					} else {
						console.log(err);
					}
				});
		}

		db.put([getTimestamp(), 8022704491]).then(() => {
			console.log('Insert Data Ok')
			const query = timeSeriesDB.query("select *");
			query.fetch().then((rowset) => {
				while (rowset.hasNext()) {
					var row = rowset.next();
					console.log("Date =", row[0], "Value =", row[1].toString());
				}
			}).catch(err => console.log(err))

		}).catch(err => console.log(err))

	}).catch(err => console.error(err))

	/** Delete container
	store.dropContainer(containerName).then(() => {

		// get container names
		for (var index = 0; index < store.partitionController.partitionCount; index++) {
			store.partitionController.getContainerNames(index, 0, -1)
				.then(nameList => {
					nameList.forEach(element => console.log(element));
					return true;
				});
		}

	})
	*/

} catch (error) {
	console.log(error)
}

function getTimestamp() {
	return (new Date()).getTime()
}

