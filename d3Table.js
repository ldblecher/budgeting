d3.text("data/chase.csv", function (data) {
    var parsedCSV = d3.csv.parseRows(data);
    var table = d3
        .select("body")
        .append("table");

    // headers
    table.append("thead").append("tr")
        .selectAll("th")
        .data(parsedCSV[0])
        .enter().append("th")
        .text(function (d) {
            return d;
        });
    // data
    table.append("tbody")
        .selectAll("tr").data(parsedCSV.slice(1))
        .enter()
        .append("tr")
        .selectAll("td")
        .data(function (d) {
            return d;
        })
        .enter()
        .append("td")
        .text(function (d) {
            return d;
        });
});