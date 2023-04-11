use serde::Serialize;
const CHATGPT_API: &str = "https://free.churchless.tech/v1/chat/completions";

#[derive(Serialize)]
struct GPTMessage {
    role: String,
    content: String,
}

// The structure of the payload to send.
#[derive(Serialize)]
struct Payload {
    frequency_penalty: i32,
    max_tokens: Option<i32>,
    messages: Vec<GPTMessage>,
    model: String,
    presence_penalty: i32,
    stream: bool,
    temperature: i32,
    top_p: i32,
}

fn main() {
    let payload = Payload {
        frequency_penalty: 0,
        max_tokens: None,
        messages: vec![GPTMessage {
            role: "user".to_string(),
            content: "Hello!".to_string(),
        }],
        model: "gpt-3.5-turbo".to_string(),
        presence_penalty: 0,
        stream: false,
        temperature: 1,
        top_p: 1,
    };

    let payload = serde_json::to_string(&payload).unwrap();

    let client = reqwest::blocking::Client::new();
    let result = client.post(CHATGPT_API)
        .body(payload.to_string())
        .send()
        .unwrap();

    println!("Payload:\n{}", payload);
    println!("Result:\n{}", result.text().unwrap());
}
