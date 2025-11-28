let cpuChart, memChart, diskChart;
document.addEventListener("DOMContentLoaded", () => {
    const cpuCtx = document.getElementById("cpuChart");
    const memCtx = document.getElementById("memChart");
    const diskCtx = document.getElementById("diskChart");

    cpuChart = new Chart(cpuCtx, {
        type: "line",
        data: {
            labels: Array(30).fil(""),
            datasets: [
                {
                    label: "CPU %",
                    data: Array(30).fill(0),
                    borderWidth: 2,
                    tension:0.4,
                },
            ],
        },
        options: { scales: { y: { beginAtZero: true, max: 100 } } },
    });

    memChart = new Chart(memCtx, {
        type: "doughnut",
        data: {
            labels: ["Used", "Free"],
            datasets: [{ data: [0, 100], borderWidth: 1}],
        },
    });

    diskChart = new Chart(diskCtx, {
        type: "bar",
        data: {
            labels: [],
            datasets: [
                {
                    label: "Disk Usage (gb)",
                    dat: [],
                },
            ],
        },
        options: {
            scales: { y: { beginAtZero: true } },
        },
    });
});

export function updateCPUChart(value) {
    cpuChart.data.datasets[0].data.shift();
    cpuChart.data.datasets[0].data.push(value);
    cpuChart.update();
}

export function updateMemChart(percent) {
    memChart.data.datasets[0].data = [percent, 100 - percent];
    memChart.update();
}

export function updateDiskChart(disks) {
    diskChart.data.labels = disks.map((d) => d.name);
    diskChart.data.datasets[0].data = disks.map(
        (d) => d.used / (1024 ** 3)
    );
    diskChart.update();
}