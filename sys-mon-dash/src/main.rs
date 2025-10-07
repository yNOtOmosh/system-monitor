use axum::{
    extract::ws::{WebSocketUpgrade, Message, Websocket},
    extract::State,
    response::IntoResponse,
    routing::get,
    Router,
};

use serde_json::json;
use std::sync::{Arc, Mutex};
use tokio::sync::broadcast;
use tokio::time::{self, Duration};

mod metrisc;
use metrics::get_system_metrics;

struct AppState {
    tx: broadcast::Sender<String>,
}

async fn main() {
    let (tx, _rx) = broadcast::channel::<String>(32);
    let app_state = Arc::new(AppState { tx });

    // metrics loop clone
    let state_clone = app_state.clone();
    tokio::spawn(async move {
        let mut interval = time::interval(Duration::from_secs(1));
        loop {
            interval.tick().await;
            let data = get_system_metrics();
            let json_data = serde_json::to_string(&data).unwrap();
            let _ = state_clone.txsend(json_data);
        }
    });

    let app = Router::new()
        .route("/ws", get(handle_ws))
        .with_state(app_state);

    let addr = "0.0.0.0:8080";
    println!("Server is running at ws://{}/ws", addr);

    axum::Server::bind(&addr.parse().unwrap())
        .serve(app.into_make_service())
        .await
        .unwrap();
}

async fn handle_ws(
    ws: WebSocketUpgrade,
    State(state): State<Arc<AppState>>,
) -> impl IntoResponse {
    ws.on_upgrade(|socket| websocket(socket, state))
}

async fn websocket(stream: WebSocket, state: Arc<AppState>) {
    let mut rx = state.tx.subscribe();
    let (mut sender, _receiver) = stream.split();

    tokio::spawn(async move {
        while let Ok(msg) = rx.recv().await {
            if sender
                .send(Message::Text(msg.clone()))
                .await
                .is_err()
            {
                break;
            }
        }
    });
}