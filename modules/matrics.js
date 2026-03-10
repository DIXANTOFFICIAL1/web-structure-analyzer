export function calculateMetrics(content){

const lines = content.split("\n")
const words = content.split(/\s+/).length
const characters = content.length
const tagMatches = content.match(/<(\w+)/g) || []

const tagCounts = {}

tagMatches.forEach(tag=>{
const clean = tag.replace("<","").toLowerCase()
tagCounts[clean] = (tagCounts[clean] || 0) + 1
})

const domNodes = tagMatches.length

return{
lines: lines.length,
words,
characters,
tagCounts,
domNodes
}
}
