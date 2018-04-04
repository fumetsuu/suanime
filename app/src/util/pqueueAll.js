const aggregateError = require('aggregate-error')

module.exports = function pqueueAll(promisesArray) {
	return new Promise(resolve => {
		var results = []
		var lastIndex = promisesArray.length - 1
		var cn = 0
		const exec = index => {
			if(index == lastIndex) return resolve(results)
			promisesArray[index]().then(
				value => {
					results.push({ status: 'resolved', value })
					cn++
					exec(cn)
				},
				error => {
					results.push({ status: 'rejected', error })
					cn++
					exec(cn)
				}
			)
		}
		exec(cn)
	})
}