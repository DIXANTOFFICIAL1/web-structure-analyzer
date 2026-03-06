const fileInput=document.getElementById("fileInput")
const codeInput=document.getElementById("codeInput")
const analyzeBtn=document.getElementById("analyzeBtn")
const dropArea=document.getElementById("dropArea")
const themeToggle=document.getElementById("themeToggle")
const exportBtn=document.getElementById("exportBtn")

let analysisResult={}

themeToggle.onclick=()=>{
document.body.classList.toggle("dark")
}

dropArea.addEventListener("dragover",e=>{
e.preventDefault()
dropArea.style.background="#e0e7ff"
})

dropArea.addEventListener("dragleave",()=>{
dropArea.style.background=""
})

dropArea.addEventListener("drop",async e=>{
e.preventDefault()
dropArea.style.background=""
const file=e.dataTransfer.files[0]
const content=await file.text()
analyze(content)
})

analyzeBtn.onclick=async ()=>{
let content=codeInput.value

if(fileInput.files.length>0){
content=await fileInput.files[0].text()
}

if(!content){
alert("Provide HTML input")
return
}

analyze(content)
}

function analyze(content){

document.getElementById("preview").srcdoc=content

const lines=content.split("\n")
const words=content.split(/\s+/).length
const charCount=content.length

const tagMatches=content.match(/<(\w+)/g)||[]

const tagCounts={}

tagMatches.forEach(tag=>{
const clean=tag.replace("<","").toLowerCase()
tagCounts[clean]=(tagCounts[clean]||0)+1
})

const hasTitle=/<title>.*<\/title>/i.test(content)
const hasMetaDesc=/<meta\s+name="description"/i.test(content)

const missingAlt=(content.match(/<img(?![^>]*alt=)/g)||[]).length

const inlineJS=(content.match(/onclick=|onload=|onerror=/g)||[]).length

const domNodes=(content.match(/<\w+/g)||[]).length

const missingLang=!content.includes("<html lang=")
const missingDoctype=!content.toLowerCase().includes("<!doctype html>")

const complexityScore=
(lines.length*0.4)+
(Object.keys(tagCounts).length*2)+
(inlineJS*5)

analysisResult={
lines:lines.length,
words,
characters:charCount,
tags:tagCounts,
complexity:Math.round(complexityScore),
seo:{hasTitle,hasMetaDesc},
accessibility:{missingAlt},
security:{inlineJS},
performance:{domNodes},
warnings:{missingLang,missingDoctype}
}

renderResults()
renderChart(tagCounts)

}

function renderResults(){

document.getElementById("metrics").innerHTML=
`
Lines: ${analysisResult.lines}<br>
Words: ${analysisResult.words}<br>
Characters: ${analysisResult.characters}<br>
Complexity Score: ${analysisResult.complexity}
`

document.getElementById("seo").innerHTML=
`
Title Tag: ${analysisResult.seo.hasTitle?"Yes":"No"}<br>
Meta Description: ${analysisResult.seo.hasMetaDesc?"Yes":"No"}
`

document.getElementById("accessibility").innerHTML=
`
Missing ALT attributes: ${analysisResult.accessibility.missingAlt}
`

document.getElementById("security").innerHTML=
`
Inline JS handlers: ${analysisResult.security.inlineJS}
`

document.getElementById("performance").innerHTML=
`
DOM Nodes: ${analysisResult.performance.domNodes}
`

document.getElementById("warnings").innerHTML=
`
Missing HTML lang attribute: ${analysisResult.warnings.missingLang}<br>
Missing DOCTYPE: ${analysisResult.warnings.missingDoctype}
`
}

function renderChart(tagCounts){

const ctx=document.getElementById("tagChart")

new Chart(ctx,{
type:"bar",
data:{
labels:Object.keys(tagCounts),
datasets:[{
label:"Tag Frequency",
data:Object.values(tagCounts)
}]
}
})

}

exportBtn.onclick=()=>{

const blob=new Blob(
[JSON.stringify(analysisResult,null,2)],
{type:"application/json"}
)

const a=document.createElement("a")
a.href=URL.createObjectURL(blob)
a.download="html-analysis-report.json"
a.click()

}
