// Get the issue body and the event date
module.exports = ({github, context }) => { 
    const body = context.payload.issue.body;
    const eventDate = context.payload.issue.created_at;

    // Define a regex to match the report format
    const reportRegex = /Report:\s*(.+)\s*$/m;

    // Check if the report is present and extract it
    const reportMatch = reportRegex.exec(body);
    let report = null;
    if (reportMatch) {
    report = reportMatch[1];
    }

    // Define a comment message
    let comment = '';

    // If the report is missing, ask for it
    if (!report) {
    comment = 'Please send the trip report as soon as possible.';
    } else {
    // If the report is present, check how long after the event date it was submitted
    const reportDate = new Date(report);
    const diff = reportDate - new Date(eventDate);

    // If the report was submitted within a week, thank for it
    if (diff < 7 * 24 * 60 * 60 * 1000) {
        comment = 'Thank you for the trip report!';
    } else {
        // If the report was submitted after a week, remind to send it sooner next time
        comment = 'Thank you for the trip report, but please try to send it within a week of the event date next time.';
    }
    }
};