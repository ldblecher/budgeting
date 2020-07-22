/*d3.text("data/chase.csv", function (data) {
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
});*/

d3.csv("data/chase.csv", function (data) {
    data.forEach(function (d) {
        //Convert to numbers and switch positive and negative amounts
        var transactionDateForm = new Date(d["Transaction Date"]);
        d["Day"] = transactionDateForm.getDate();
        d["Year"] = transactionDateForm.getFullYear();
        d["Month"] = transactionDateForm.getMonth() + 1;
        d["Amount"] = +-d["Amount"];
    });
    var transactionsByDate = d3.nest()
        .key(function (d) {
            return d["Year"];
        })
        .key(function (d) {
            return d["Month"];
        })
        .entries(data);
    var transactions_2020 = transactionsByDate[1];
    transactions_2020.values.sort((a, b) => d3.descending(a.key, b.key));
    d3.select("body").append("h1").text(transactions_2020.key);
    //.slice().sort((a, b) => d3.descending(a.Month, b.Month))
    var columns = ['Transaction Date', 'Description', 'Category', 'Type', 'Amount'];
    transactions_2020.values.forEach(function (t) {
        d3.select("body").append("p").text(t.key);
        //https://gist.github.com/jfreels/6734025
        var table = d3.select("body").append("table");
        var thead = table.append("thead");
        var tbody = table.append("tbody");
        // headers
        thead.append("tr")
            .selectAll("th")
            .data(columns)
            .enter().append("th")
            .text(function (column) {
                return column;
            });
        var rows = tbody.selectAll('tr')
            .data(t.values)
            .enter()
            .append('tr');
        var cells = rows.selectAll('td')
            .data(function (row) {
                return columns.map(function (column) {
                    return { column: column, value: row[column] };
                });
            })
            .enter()
            .append('td')
            .text(function (d) { return d.value; });
        /*// data
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
            });*/
    });
});