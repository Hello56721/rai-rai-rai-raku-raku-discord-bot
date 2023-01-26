use serenity::model::channel::Message;
use serenity::model::gateway::Ready;
use serenity::prelude as discord;

struct EventHandler;

#[serenity::async_trait]
impl discord::EventHandler for EventHandler {
    async fn ready(&self, _: discord::Context, ready: Ready) {
        println!("[INFO]: The bot has logged on as {}", ready.user.name);
    }

    async fn message(&self, context: discord::Context, message: Message) {
        if message.content.starts_with("I am") {
            if let Err(why) = message.reply(context, "fuk yo").await {
                println!(
                    "[ERROR]: Failed to reply to a message. Here's why:\n{:?}",
                    why
                );
            }
        }
    }
}

#[tokio::main]
async fn main() {
    let token = std::env::var("DISCORD_TOKEN")
        .expect("The variable DISCORD_TOKEN was not set on the environment.");

    let intents = discord::GatewayIntents::GUILDS
        | discord::GatewayIntents::GUILD_MESSAGES
        | discord::GatewayIntents::MESSAGE_CONTENT;

    let mut bot = discord::Client::builder(token, intents)
        .await
        .expect("Failed to create the client. Perhaps the token wasn't valid?");

    bot.start()
        .await
        .expect("Something happened. Please try again.");
}
