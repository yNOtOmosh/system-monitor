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
