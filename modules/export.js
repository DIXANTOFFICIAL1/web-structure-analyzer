export function exportReport(data){

const blob = new Blob(
[JSON.stringify(data,null,2)],
{type:"application/json"}
)

const a = document.createElement("a")
a.href = URL.createObjectURL(blob)
a.download = "html-analysis-report.json"
a.click()

}
