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

function checkDate(body) {
    const eventDates = body.getFormValue('EventDates')
    const today = new Date().toLocaleDateString();

    console.log(eventDates);
    console.log(today);
}

checkDate(body);