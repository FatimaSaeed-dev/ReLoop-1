
const line = document.getElementById("lineChart");

new Chart(line, {

    type: "line",

    data: {

        labels: ["Jan","Feb","Mar","Apr","May","Jun"],

        datasets: [{

            label: "Waste Saved (kg)",

            data: [40,70,95,120,160,220],

            borderColor: "#2E7D32",

            backgroundColor: "rgba(46,125,50,.15)",

            fill: true,

            tension: .4

        }]

    }

});

const pie = document.getElementById("pieChart");

new Chart(pie, {

    type: "doughnut",

    data: {

        labels:["Wood","Plastic","Metal","Paper"],

        datasets:[{

            data:[35,25,20,20],

            backgroundColor:[

                "#2E7D32",

                "#66BB6A",

                "#81C784",

                "#A5D6A7"

            ]

        }]

    }

});