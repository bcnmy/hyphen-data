
/**
 * Calculates the start and end time of a given time range in days
 * @param {*} days number of days for which data is required
 * @returns {object} startTime and endTime in seconds
 */
function getStartAndEndTime(days) {
    const secondsInADay = 86400;
    const currentTimeInSeconds = Math.floor(Date.now() / 1000);
    const startTime = currentTimeInSeconds - secondsInADay * days;
    const endTime = currentTimeInSeconds;
    return { startTime, endTime };
}

export { getStartAndEndTime };
