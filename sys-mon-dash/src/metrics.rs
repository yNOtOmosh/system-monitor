use serde::Serialize;
use sysinfo::{System, SystemExt, CpuExt, DiskExt, ProcessExt};

pub struct Metrics {
    cpu_usage: f32,
    memory_used: u64,
    memory total: u64,
    disk: Vec<DiskInfo>,
    processes: Vec<ProcessInfo>,
}

pub struct DiskInfo {
    name: String,
    total_space: u64,
    available_space: u64,
}

pub struct ProcessInfo {
    name: String,
    cpu_usage: f32,
    memory: u64,
}

pub fn get_system_metrics() -> Metrics {
    let mut sys = System::new_all();
    sys.refresh_all();

    let cpu_usage = sys.global_cpu_info().cpu_usage();
    let memory_used = sys.used_memory();
    let memory_total = sys.total_memory();

    let disks = sys.disks()
        .iter()
        .map(|d| DiskInfo {
            name: d.name().to_string_lossy().to_string(),
            total_space: d.total_space(),
            available_space: d.available_space(),
        })
        .collect::<Vec<_>>();

    let mut processes = sys.processes()
        .values()
        .map(|p| ProcessInfo {
            name: p.name().to_string(),
            cpu_usage: p.cpu_usage(),
            memory: p.memory(),
        })
        .collect::<Vec<_>>();

    processes.sort_by(|a, b| b.cpu_usage.partial_cmp(&a.cpu_usge).unwrap());
    processes.truncate(10);

    Metrics {
        cpu_usage,
        memory_used,
        memory_total,
        disks,
        processes,
    }
}