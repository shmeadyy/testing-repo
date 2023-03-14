String.prototype.getFormValue = function (fieldName) {
    // i = case insensitive, s = match newlines
    const re = new RegExp(fieldName + '(.*?)###', 'is')
    const result = this.match(re)
    if (result) {
        return result[1].trim()
    } else {
        console.log(
            `Field '${fieldName} was not found. Check if the template changed.`
        )
        return result
    }
}

// reformat body
function reformatBody(body) {
    // get raw values
    const eventName = body.getFormValue('Event Name')
    const eventDates = body.getFormValue('Event Dates')
    const eventUrl = body.getFormValue('Event URL')
    const eventLocation = body.getFormValue('Location')
    const eventType = body.getFormValue('Event Type')
    const eventDescription = body.getFormValue('Event Description')
    const participants = body.getFormValue('Participants')
    const cfp = body.getFormValue('Call for Proposal')
    const cfpDeadline = body.getFormValue('Deadline for CFP Submission')

    // replace task lists with static values
    newBody = body.replace(/- \[ \]/g, '❌ ').replace(/- \[X\]/g, '✅ ');

    // summarise essential details in a table rather than fields
    newBody = `## ${eventName}
Item | Specific
-----| ---------
Dates | ${eventDates}
URL | ${eventUrl}
Location | ${eventLocation}
Type of Event | ${eventType}
Event Description | ${eventDescription}
Expected # of participants | ${participants}
Link to Call for Proposals (CFP) | ${cfp}
Deadline for CFP Submissions | ${cfpDeadline}

`
     + newBody.substring(newBody.indexOf('Suggested Participation Level') - 4)
    return newBody
}

module.exports = ({ github, context }) => {

    const labels = context.payload.issue.labels

    // Check this is the right issue to process
    for (const label of labels) {
        if (label.name === 'Event-Automation') {

            // Pull out info from the issue body
            const body = context.payload.issue.body
            const eventName = body.getFormValue('Event Name')
            const eventDates = body.getFormValue('Event Dates')
            // to be replaced with or otherwise use labels
            const eventHostType = body.getFormValue('Hosting')

            let labelsToAdd = []
            // set hosting type value
            labelsToAdd.push(eventHostType)

            // ensure new title is correct
            newTitle = eventDates + ' : ' + eventName
            // reformat the body
            newBody = reformatBody(body)

            console.log('::set-output name=applyChanges::true')
            return {
                labelsToAdd: labelsToAdd,
                newTitle: newTitle,
                newBody: newBody
            }
        }
    }

    console.log('::set-output name=applyChanges::false')
}