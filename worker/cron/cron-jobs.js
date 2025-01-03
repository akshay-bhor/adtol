const { allocateDailyBudget } = require("./tasks/allocate-daily-budget");
const { deleteOldData } = require("./tasks/delete-old-data");
const { processDayParting } = require("./tasks/process-day-parting");
const { updateReferrelStats } = require("./tasks/referrel-stats");
const { processAdStats } = require("./tasks/process-ad-stats");

exports.updateRefStatsJob = () => {
    updateReferrelStats();
}

exports.deleteOldDataJob = () => {
    deleteOldData();
}

exports.allocateDailyBudgetJob = () => {
    allocateDailyBudget();
}

exports.processDayPartingJob = () => {
    processDayParting();
}

exports.processAdStatsJob = () => {
    processAdStats();
}