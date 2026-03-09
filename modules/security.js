export function checkSecurity(content){

const inlineJS = (content.match(/onclick=|onload=|onerror=/g) || []).length

return{
inlineJS
}}
