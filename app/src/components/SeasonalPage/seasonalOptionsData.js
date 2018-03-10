export function yearOptions() {
    let today = new Date()
    let yearOptions = []
    let thisyear = today.getUTCFullYear()
    for(var i = thisyear; i >= 1990; i--) {
        yearOptions.push({ value: i, label: i })
    }
    return yearOptions
}

export const seasonOptions = [
    { value: 'Winter', label: 'Winter' },
    { value: 'Spring', label: 'Spring' },
    { value: 'Summer', label: 'Summer' },
    { value: 'Fall', label: 'Fall' }
]

export const typeOptions = [
    { value: 'default', label: 'ALL' },
    { value: '0', label: 'TV' },
    { value: '1', label: 'OVA' },
    { value: '2', label: 'MOVIE' },
    { value: '3', label: 'SPECIAL' },
    { value: '4', label: 'ONA' }
]

