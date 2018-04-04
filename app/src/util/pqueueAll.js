const aggregateError = require('aggregate-error')

module.exports = function pqueueAll(promisesArray) {
	return new Promise(resolve => {
		var results = []
		var lastIndex = promisesArray.length - 1
		var cn = 0
		const exec = index => {
			promisesArray[index]().then(
				value => {
					results.push({ status: 'resolved', value })
					cn++
					if(cn >= lastIndex) return resolve(results)
					exec(cn)
				},
				error => {
					results.push({ status: 'rejected', error })
					cn++
					if(cn >= lastIndex) return resolve(results)					
					exec(cn)
				}
			)
		}
		exec(cn)
	})
}