import React from 'react';

export default ({ allParametersQuery, children }) => {
    //todo make look for {{}} and match param with dif color, currently looks for {{parametername}}, not generic
    let parameters = ['{{89098_placeholder_90128}}']
    if (allParametersQuery.allParameters && (!allParametersQuery.allParameters.loading && !allParametersQuery.allParameters.error))
        parameters = allParametersQuery.allParameters.map((parameter) => {return  '{{' + parameter.param + '}}'})
    const result = []
    const regex = parameters.map(parameter => parameter.replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&")).join('|');
    const re = new RegExp(regex);
    let message = (' ' + children).slice(1);
    let parameterMatch = re.exec(message);
    while (parameterMatch != null) {
        const parameter = parameterMatch.toString();
        result.push(message.slice(0, parameterMatch.index));
        result.push(<span key={message.length} className="bg-smodin-purple parameterborderthin smodin-black">{parameter}</span>);
        message = message.slice(parameterMatch.index + parameter.length);
        parameterMatch = re.exec(message);
    }
    result.push(message);
    return <div>{result}</div>;
}
