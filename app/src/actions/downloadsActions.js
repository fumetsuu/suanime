export function updateProgress(speed, downloaded, total, percentage) {
    return {
        type: "UPDATE_PROGRESS",
        payload: {
            speed: speed,
            downloaded: downloaded,
            total: total,
            percentage: percentage
        }
    }
}
