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

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
});

d3.csv("data/chase.csv", function (data) {
    data.forEach(function (d) {
        //Convert to numbers and switch positive and negative amounts
        var transactionDateForm = new Date(d["Transaction Date"]);
        d["Day"] = transactionDateForm.getDate();
        d["Year"] = transactionDateForm.getFullYear();
        d["Month"] = transactionDateForm.getMonth() + 1;
        //d["Amount"] = formatter.format(+-d["Amount"]);
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
    console.log(data);
    var monthlySpend = data.filter(function (d) { return d.Type == "Payment" });
    var monthlyByDate = d3.nest()
        .key(function (d) {
            return d["Year"];
        })
        .key(function (d) {
            return d["Month"];
        })
        .rollup(function (v) {
            return d3.sum(v, function (d) { return d.Amount })
        })
        .entries(monthlySpend);
    var monthlySpend2020 = monthlyByDate[1];
    console.log(monthlyByDate[0])
    console.log(transactionsByDate);
    var transactions_2020 = transactionsByDate[1];
    transactions_2020.values.sort((a, b) => d3.descending(a.key, b.key));

    d3.select("body").append("h1").text(transactions_2020.key);
    //.slice().sort((a, b) => d3.descending(a.Month, b.Month))
    var columns = ['Transaction Date', 'Description', 'Category', 'Type', 'Amount'];
    transactions_2020.values.forEach(function (t) {
        var monthly = d3.nest()
            .key(function (d) {
                return d["Month"];
            })
            .rollup(function (v) {
                return d3.sum(v, function (d) { return d.Amount })
            })
            .entries(t.values.filter(function (d) { return d.Type != "Payment" }));
        var dollarsMonthly = formatter.format(monthly[0].values);
        d3.select("body").append("p").attr('class', 'month').text(t.key)
            .append('span')
            .attr('class', 'month-total')
            .text(' - Spend: ' + dollarsMonthly)
        //https://gist.github.com/jfreels/6734025
        var table = d3.select("body").append("table").attr('class', 'monthly');
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
            .append('tr')
            //filter out Payment types
            .filter(function (d) { return d.Type != "Payment" });
        var cells = rows.selectAll('td')
            .data(function (row) {
                return columns.map(function (column) {
                    return { column: column, value: row[column] };
                })
            })
            .enter()
            .append('td')
            .attr("id", function (d) {
                if (d.column == 'Amount') {
                    return 'amount';
                }
            })
            .text(function (d) {
                if (d.column == 'Amount') {
                    return formatter.format(d.value);
                }
                return d.value;
            });

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

    //list totals
});