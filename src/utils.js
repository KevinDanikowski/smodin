/***************************
 * Time Utils
 */


function timeDifference(current, previous) {

    const milliSecondsPerMinute = 60 * 1000
    const milliSecondsPerHour = milliSecondsPerMinute * 60
    const milliSecondsPerDay = milliSecondsPerHour * 24
    const milliSecondsPerMonth = milliSecondsPerDay * 30
    const milliSecondsPerYear = milliSecondsPerDay * 365

    const elapsed = current - previous

    if (elapsed < milliSecondsPerMinute / 3) {
        return 'just now'
    }

    if (elapsed < milliSecondsPerMinute) {
        return 'less than 1 min ago'
    }

    else if (elapsed < milliSecondsPerHour) {
        return Math.round(elapsed/milliSecondsPerMinute) + ' min ago'
    }

    else if (elapsed < milliSecondsPerDay ) {
        return Math.round(elapsed/milliSecondsPerHour ) + ' h ago'
    }

    else if (elapsed < milliSecondsPerMonth) {
        return Math.round(elapsed/milliSecondsPerDay) + ' days ago'
    }

    else if (elapsed < milliSecondsPerYear) {
        return Math.round(elapsed/milliSecondsPerMonth) + ' mo ago'
    }

    else {
        return Math.round(elapsed/milliSecondsPerYear ) + ' years ago'
    }
}

export function timeDifferenceForDate(date) {
    const now = new Date().getTime()
    const updated = new Date(date).getTime()
    return timeDifference(now, updated)
}

/***************************
 * String Parameter Finder Utils
 */

function replaceNextParameter (sub1, sub2, message, parameterAndResponseArray) {
    let oldString = message
    if (oldString.indexOf(sub1) < 0 || oldString.indexOf(sub2) < 0) return oldString;
    let parameterInbetweenStrings = getFromBetween(sub1, sub2, oldString);
    let responseMatchingParameter = matchBetween(parameterInbetweenStrings, parameterAndResponseArray, sub1, sub2);
    let newStringWithParameterResponse = removeAndReplace(sub1, sub2, responseMatchingParameter, oldString);
    return newStringWithParameterResponse
};
function getFromBetween (sub1, sub2, string) {
    if (string.indexOf(sub1) < 0 || string.indexOf(sub2) < 0) return false;
    let endSub1 = string.indexOf(sub1) + sub1.length; //get length until end sub1
    let string1 = string.substr(0, endSub1); //string1 is string to end sub1
    let string2 = string.substr(endSub1); //string 2 is string after sub1
    let between = string1.length + string2.indexOf(sub2); // between sub1 and sub2
    return string.substring(endSub1, between);
};
function matchBetween (result, parameterArray, sub1, sub2) {
    if (parameterArray === 'undefined') return (sub1+result+sub2)
    let responseIndex = parameterArray.findIndex(x => x.param === result)
    if (responseIndex === -1) return ' NO_PARAMETER_RESPONSE '
    else {
        let response = parameterArray[responseIndex].response
        return response
    }
};
function removeAndReplace (sub1, sub2, replacement, string) {
    if (string.indexOf(sub1) < 0 || string.indexOf(sub2) < 0) return false; // if sub1 or sub2 absent, stops script
    let removal = sub1 + getFromBetween(sub1, sub2, string) + sub2; // remove sub1 stringBetween and sub2
    string = string.replace(removal, replacement);
    return string
};
// Array param and response must be called "param" and "response"
export function findAllParametersInString (string, sub1, sub2, parameterAndResponseArray) {
    let newString = string
    while (newString.indexOf(sub1) > -1 && newString.indexOf(sub2) > -1) {
        newString = replaceNextParameter(sub1, sub2, newString, parameterAndResponseArray);
    }
    return newString
};