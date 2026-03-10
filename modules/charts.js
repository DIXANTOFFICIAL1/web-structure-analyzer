export function renderChart(tagCounts){

const ctx = document.getElementById("tagChart")

new Chart(ctx,{
type:"bar",
data:{
labels:Object.keys(tagCounts),
datasets:[{
label:"Tag Frequency",
data:Object.values(tagCounts)}]
}
})
}
