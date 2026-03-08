export function checkAccessibility(content){

const missingAlt = (content.match(/<img(?![^>]*alt=)/g) || []).length

return{
missingAlt
}}
