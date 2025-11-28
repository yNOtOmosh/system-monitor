const ws = new WebSocket('ws://localhost:8080/ws');

const cpuValue = document.getElementById("cpuValue");
const memValue = document.getElementById("memValue");
const processTable = document.getElementById("processTable");

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    updateCPU(data.cpu_usage);
    updateMemory(data.memory_usage, data.memory_total);
    updateDisk(data.disks);
    updateProcesses(data.processes);
};

/* CPU */
function updateCPU(value) {
    cpuValue.textContent = value.toFixed(1) + "%";
    updateCPUChart(value);
}

/* memory */
function updateMemory(used, total) {
    const percent = (used / total) * 100;
    memValue.textContent = percent.toFixed(1) + "%";
    updateMemChart(percent);
}

/* disk */
function updateDisk(disks) {
    const diskData = disk.map((d) => ({
        name: d.name,
        used: d.total_space - d.available_space,
        total: d.total_space,
    }));
    updateDiskChart(diskData);
}

/* processes */
function updateProcesses(processes) {
    processTable.innerHTML = "";
    processes.forEach((p) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${p.name}</td>
            <td>${p.cpu_usage.toFixed(1)}%</td>
            <td>${(p.memory / 1024).toFixed(1)} MB</td>
        `;
        processTable.appendChild(row);
    });
}

/* theme toggle */
const themeToggle = document.getElementById("themeToggle");
themeToggle.addEventListener("change", () => {
    document.body.classList.toggle("dark", themeToggle.checked);
});


