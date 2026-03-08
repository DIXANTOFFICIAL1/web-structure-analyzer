export function analyzeSEO(content){

const hasTitle = /<title>.*<\/title>/i.test(content)
const hasMetaDesc = /<meta\s+name="description"/i.test(content)

return{
hasTitle,
hasMetaDesc
}}
