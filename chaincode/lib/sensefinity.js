'use strict';

const { Contract } = require('fabric-contract-api');

class Chaincode extends Contract {

	async CreateDevice(ctx, id, name) {
		let deviceState = await ctx.stub.getState(id);
		if (deviceState && deviceState.length > 0) {
			throw new Error(`The device ${id} already exists`);
		}
		let device = {
			docType: 'device',
			id: id,
			name: name
		};
		await ctx.stub.putState(id, Buffer.from(JSON.stringify(device)));
	}

	async ReadDevice(ctx, id) {
		const deviceState = await ctx.stub.getState(id);
		if (!deviceState || deviceState.length === 0) {
			throw new Error(`Device ${id} does not exist`);
		}
		return deviceState.toString();
	}

	async DeleteDevice(ctx, id) {
		if (!id) {
			throw new Error('Device id must not be empty');
		}
		let deviceState = await ctx.stub.getState(id);
		if (!(deviceState && deviceState.length > 0)) {
			throw new Error(`Device ${id} does not exist`);
		}
		let device = {};
		try {
			device = JSON.parse(deviceState.toString());
		} catch (err) {
			let jsonResp = {};
			jsonResp.error = 'Failed to decode JSON of: ' + id;
			throw new Error(jsonResp);
		}
		let queryString = {};
		queryString.selector = {};
		queryString.selector.docType = 'tracking';
		queryString.selector.deviceId = device.id;
		let trackings = await this.GetQueryResultForQueryString(ctx, JSON.stringify(queryString));
		trackings = JSON.parse(trackings.toString());
		if (trackings && trackings.length > 0) {
			throw new Error(`The device ${id} can not be deleted.`);
		}
		await ctx.stub.deleteState(id);
	}

	async RenameDevice(ctx, id, name) {
		let deviceState = await ctx.stub.getState(id);
		if (!deviceState || !deviceState.toString()) {
			throw new Error(`Device ${id} does not exist`);
		}
		let device = {};
		try {
			device = JSON.parse(deviceState.toString());
		} catch (err) {
			let jsonResp = {};
			jsonResp.error = 'Failed to decode JSON of: ' + id;
			throw new Error(jsonResp);
		}
		device.name = name;
		deviceState = Buffer.from(JSON.stringify(device));
		await ctx.stub.putState(id, deviceState);
	}

	async CreateProduct(ctx, id, name) {
		let productState = await ctx.stub.getState(id);
		if (productState && productState.length > 0) {
			throw new Error(`The product ${id} already exists`);
		}
		let product = {
			docType: 'product',
			id: id,
			name: name
		};
		await ctx.stub.putState(id, Buffer.from(JSON.stringify(product)));
	}

	async ReadProduct(ctx, id) {
		const productState = await ctx.stub.getState(id);
		if (!productState || productState.length === 0) {
			throw new Error(`Product ${id} does not exist`);
		}
		return productState.toString();
	}

	async DeleteProduct(ctx, id) {
		if (!id) {
			throw new Error('Product id must not be empty');
		}
		let productState = await ctx.stub.getState(id);
		if (!(productState && productState.length > 0)) {
			throw new Error(`Product ${id} does not exist`);
		}
		let product = {};
		try {
			product = JSON.parse(productState.toString());
		} catch (err) {
			let jsonResp = {};
			jsonResp.error = 'Failed to decode JSON of: ' + id;
			throw new Error(jsonResp);
		}
		let queryString = {};
		queryString.selector = {};
		queryString.selector.docType = 'tracking';
		queryString.selector.productId = product.id;
		let trackings = await this.GetQueryResultForQueryString(ctx, JSON.stringify(queryString));
		trackings = JSON.parse(trackings.toString());
		if (trackings && trackings.length > 0) {
			throw new Error(`The product ${id} can not be deleted.`);
		}
		await ctx.stub.deleteState(id);
	}

	async RenameProduct(ctx, id, name) {
		let productState = await ctx.stub.getState(id);
		if (!productState || !productState.toString()) {
			throw new Error(`Product ${id} does not exist`);
		}
		let product = {};
		try {
			product = JSON.parse(productState.toString());
		} catch (err) {
			let jsonResp = {};
			jsonResp.error = 'Failed to decode JSON of: ' + id;
			throw new Error(jsonResp);
		}
		product.name = name;
		productState = Buffer.from(JSON.stringify(product));
		await ctx.stub.putState(id, productState);
	}

	async CreateTracking(ctx, id, deviceId, productId) {
		let trackingState = await ctx.stub.getState(id);
		if (trackingState && trackingState.length > 0) throw new Error(`The tracking details ${id} already exists`);
		let deviceState = await ctx.stub.getState(deviceId);
		if (!deviceState || !deviceState.toString()) throw new Error(`Device ${deviceId} does not exist`);
		let productState = await ctx.stub.getState(productId);
		if (!productState || !productState.toString()) throw new Error(`Product ${productId} does not exist`);
		let tracking = {
			docType: 'tracking',
			id: id,
			deviceId: deviceId,
			productId: productId,
			pickedTimestamp: new Date(),
			deliveredTimestamp: null
		};
		await ctx.stub.putState(id, Buffer.from(JSON.stringify(tracking)));
	}

	async ReadTracking(ctx, id) {
		const trackingState = await ctx.stub.getState(id);
		if (!trackingState || trackingState.length === 0) {
			throw new Error(`Tracking ${id} does not exist`);
		}
		return trackingState.toString();
	}

	async UpdateTracking(ctx, id, deviceId, productId) {
		let trackingState = await ctx.stub.getState(id);
		if (!trackingState || !trackingState.toString()) {
			throw new Error(`Tracking ${id} does not exist`);
		}
		let deviceState = await ctx.stub.getState(deviceId);
		if (!deviceState || !deviceState.toString()) throw new Error(`Device ${deviceId} does not exist`);
		let productState = await ctx.stub.getState(productId);
		if (!productState || !productState.toString()) throw new Error(`Product ${productId} does not exist`);
		let tracking = {};
		try {
			tracking = JSON.parse(trackingState.toString());
		} catch (err) {
			let jsonResp = {};
			jsonResp.error = 'Failed to decode JSON of: ' + id;
			throw new Error(jsonResp);
		}
		tracking.deviceId = deviceId;
		tracking.productId = productId;
		trackingState = Buffer.from(JSON.stringify(tracking));
		await ctx.stub.putState(id, trackingState);
	}

	async MarkAsDeliverTracking(ctx, id) {
		let trackingState = await ctx.stub.getState(id);
		if (!trackingState || !trackingState.toString()) {
			throw new Error(`Tracking ${id} does not exist`);
		}
		let tracking = {};
		try {
			tracking = JSON.parse(trackingState.toString());
		} catch (err) {
			let jsonResp = {};
			jsonResp.error = 'Failed to decode JSON of: ' + id;
			throw new Error(jsonResp);
		}
		tracking.deliveredTimestamp = new Date();
		trackingState = Buffer.from(JSON.stringify(tracking));
		await ctx.stub.putState(id, trackingState);
	}

	async DeleteTracking(ctx, id) {
		if (!id) {
			throw new Error('Tracking id must not be empty');
		}
		let trackingState = await ctx.stub.getState(id);
		if (!(trackingState && trackingState.length > 0)) {
			throw new Error(`Tracking ${id} does not exist`);
		}
		let tracking = {};
		try {
			tracking = JSON.parse(trackingState.toString());
		} catch (err) {
			let jsonResp = {};
			jsonResp.error = 'Failed to decode JSON of: ' + id;
			throw new Error(jsonResp);
		}
		let queryString = {};
		queryString.selector = {};
		queryString.selector.docType = 'sensor';
		queryString.selector.deviceId = tracking.deviceId;
		let sensors = await this.GetQueryResultForQueryString(ctx, JSON.stringify(queryString));
		sensors = JSON.parse(sensors.toString());
		if (sensors && sensors.length > 0) {
			throw new Error(`The tracking ${id} can not be deleted.`);
		}
		await ctx.stub.deleteState(id);
	}

	async CreateSensor(ctx, id, args) {
		let data = JSON.parse(args);
		if (!data.device_id) throw new Error('Please provide device details.');
		if (!data.latitude) throw new Error('Please provide sensor details.');
		if (!data.longitude) throw new Error('Please provide sensor details.');
		if (!data.value) throw new Error('Please provide sensor details.');
		if (!data.type) throw new Error('Please provide sensor details.');
		let deviceState = await ctx.stub.getState(data.device_id);
		if (!deviceState || !deviceState.toString()) {
			throw new Error(`Device ${id} does not exist`);
		}
		let sensorState = await ctx.stub.getState(id);
		if (sensorState && sensorState.length > 0) {
			throw new Error(`The sensor ${id} already exists`);
		}
		let sensor = {
			id: id,
			deviceId: data.device_id,
			latitude: data.latitude,
			longitude: data.longitude,
			value: data.value,
			type: data.type,
			originTimestamp: new Date(data.origin_timestamp),
			timestamp: new Date(),
			docType: 'sensor'
		};
		await ctx.stub.putState(id, Buffer.from(JSON.stringify(sensor)));
	}

	async GetQueryResultForQueryString(ctx, queryString) {
		let resultsIterator = await ctx.stub.getQueryResult(queryString);
		let results = await this.GetAllResults(resultsIterator, false);
		return JSON.stringify(results);
	}

	async GetAllResults(iterator, isHistory) {
		let allResults = [];
		let res = await iterator.next();
		while (!res.done) {
			if (res.value && res.value.value.toString()) {
				let jsonRes = {};
				if (isHistory && isHistory === true) {
					jsonRes.TxId = res.value.tx_id;
					jsonRes.Timestamp = res.value.timestamp;
					try {
						jsonRes.Value = JSON.parse(res.value.value.toString('utf8'));
					} catch (err) {
						console.log(err);
						jsonRes.Value = res.value.value.toString('utf8');
					}
				} else {
					jsonRes.Key = res.value.key;
					try {
						jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
					} catch (err) {
						console.log(err);
						jsonRes.Record = res.value.value.toString('utf8');
					}
				}
				allResults.push(jsonRes);
			}
			res = await iterator.next();
		}
		iterator.close();
		return allResults;
	}

	async QueryResults(ctx, queryString) {
		let iterator = await ctx.stub.getQueryResult(queryString);
		let results = [];
		let res = await iterator.next();
		while (!res.done) {
			if (res.value && res.value.value.toString()) {
				let result = {};
				result.Key = res.value.key;
				try {
					result.Record = JSON.parse(res.value.value.toString('utf8'));
				} catch (err) {
					console.log(err);
					result.Record = res.value.value.toString('utf8');
				}
				results.push(result);
			}
			res = await iterator.next();
		}
		iterator.close();
		return JSON.stringify(results);
	}

}

module.exports = Chaincode;
