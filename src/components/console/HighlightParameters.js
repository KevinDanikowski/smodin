import React from 'react';

export default ({ allParametersQuery, children }) => {
    //todo make look for {{}} and match param with dif color, currently looks for {{parametername}}, not generic
    const paramRE = /{{.*?}}///adding (.*?) will provide the braketed result and regular result, may be useful to do [0] vs [1] to get string and param, respectively

    //let parameters = ['{{89098_placeholder_90128}}']
    //if (allParametersQuery.allParameters && (!allParametersQuery.allParameters.loading && !allParametersQuery.allParameters.error))
    //parameters = allParametersQuery.allParameters.map((parameter) => {return  '{{' + parameter.param + '}}'})
    const result = []
    //const regex = parameters.map(parameter => parameter.replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&")).join('|');//sets up as the below note with | in between each parameter from list
    //const re = new RegExp(regex);//adds / to front and back of expression
    let message = (' ' + children).slice(1);
    let parameterMatch = paramRE.exec(message);// sees if /\{/{_placeholder_\}\}/ is present in message
    while (parameterMatch != null) {//runs through {{...}} of string
        const parameter = parameterMatch.toString();
        result.push(message.slice(0, parameterMatch.index));//pushes string before {{
        result.push(<span key={message.length} className="par-highlight">{parameter}</span>);
        message = message.slice(parameterMatch.index + parameter.length);//sets message to forget ...}}
        parameterMatch = paramRE.exec(message); //checks again for parameter
    }
    result.push(message);
    return result;//result is a symbol(react.element), result must be an array to make this happen
}
