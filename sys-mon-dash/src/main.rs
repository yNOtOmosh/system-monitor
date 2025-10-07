use axum::Router;
use tokio::sync::broadcast;

mod websocket;
mod metrics;

async fn main() {
    let (tx, _) = broadcast::channel::<string>(16);

    let app = websocket::app(tx.clone());

    tokio::spawn(websocket::start_broadcaster(tx));

    println!("Server running on http://127.0.0.1:3000"
    axum::Server::bind(&"0.0.0.0:3000".parse().unwrap())
        .serve(app.into_make_service())
        .await
        .unwrap();
}