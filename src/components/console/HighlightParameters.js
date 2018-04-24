import React from 'react';

export default ({ allParametersQuery, children }) => {
    //todo set up to look for parameter present or not, if is, have hover effect to show response, set up limit to 35 characters
    const queryPresentAndFinished =
        (allParametersQuery &&
        allParametersQuery.allParameters &&
        !allParametersQuery.allParameters.loading &&
        !allParametersQuery.allParameters.error)
    const queryPresentAndLoading =
        (allParametersQuery &&
        allParametersQuery.allParameters &&
        (allParametersQuery.allParameters.loading ||
        allParametersQuery.allParameters.error))
    const parameters = (queryPresentAndFinished) ?
            allParametersQuery.allParameters : []
    const paramRE = /{{(.*?)}}/

    const result = []
    let message = (' ' + children).slice(1);
    let parameterPresent = paramRE.exec(message);// sees if regex is present in message
    while (parameterPresent != null) {//runs through {{...}} of string
        const parameter = parameterPresent[0].toString();
        const matchedParameter = parameters.findIndex(parameter => parameter.param === parameterPresent[1])
        const spanClass = () => {
            if (!allParametersQuery) return 'par-highlight par-highlight-static'
            else {
                return (matchedParameter > -1 || queryPresentAndLoading) ? 'par-highlight par-highlight-present' : 'par-highlight par-highlight-missing'
            }
        }
        const tooltipClass = 'par-tooltip'
        const tooltipMessage = ()=>{
            if(!allParametersQuery) return ''
            if (queryPresentAndLoading) return 'Loading...'
            if(matchedParameter > -1){
                const response = parameters[matchedParameter].response
                if(response.length > 23) {
                    return response.substr(0,20)+'...'
                } else {
                    return (response)? response : 'No Response'
                }
            } else {
                return 'Missing Parameter'
            }
        }
        result.push(message.slice(0, parameterPresent.index));//pushes string before {{
        result.push(<span key={message.length} className={spanClass()}>
                {parameter}
                <span key={message.length+1} className={tooltipClass}>{tooltipMessage()}</span>
                </span>);
        message = message.slice(parameterPresent.index + parameter.length);//sets message to forget ...}}
        parameterPresent = paramRE.exec(message); //checks again for parameter
    }
    result.push(message);
    return result;//result is a symbol(react.element), result must be an array to make this happen
}
