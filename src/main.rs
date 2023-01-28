use serenity::{
    client::{Client, Context, EventHandler as DiscordEventHandler},
    model::{
        application::interaction::{Interaction, InteractionResponseType},
        channel::Message,
        gateway::Ready,
        id::UserId,
        prelude::GuildId,
    },
    prelude::GatewayIntents,
};

use std::process::Command;
use tokio::sync::Mutex;

const MAIN_SERVER: GuildId = GuildId(973716864301678702);

// static COMMANDS: HashMap<&str, Fn(ApplicationCommandInteraction)> = HashMap::new();

#[derive(Default)]
struct Bot {
    id: UserId,
}

struct EventHandler {
    bot: Mutex<Bot>,
}

#[serenity::async_trait]
impl DiscordEventHandler for EventHandler {
    async fn ready(&self, context: Context, ready: Ready) {
        println!("[INFO]: The bot has logged on as {}", ready.user.name);

        let mut bot = self.bot.lock().await;
        bot.id = ready.user.id;

        let guild = MAIN_SERVER;

        guild
            .set_application_commands(&context.http, |commands| {
                commands.create_application_command(|command| {
                    command
                        .name("restart")
                        .description("Restarts the bot. Can only be used by developer.")
                })
            })
            .await
            .expect("Failed to register application commands for main server.");
    }

    async fn message(&self, context: Context, message: Message) {
        println!("[MESSAGE]: {}", message.content);

        let bot = self.bot.lock().await;

        if bot.id == message.author.id {
            return;
        }

        if message.content.starts_with("I am") {
            if let Err(why) = message.reply_ping(context, "fuk yo").await {
                println!(
                    "[ERROR]: Failed to reply to a message. Here's why:\n{:?}",
                    why
                );
            }
        } else if message.content.to_lowercase().starts_with("indeed") {
            if let Err(error) = message.reply_ping(context, "indeedn't").await {
                println!(
                    "[ERROR]: Failed to reply to a message. Here's why:\n{:?}",
                    error
                )
            }
        } else if message.content.to_lowercase().starts_with("interesting") {
            if let Err(error) = message
                .channel_id
                .send_message(context, |m| {
                    m.content("@everyone check out wut dis guys interested in")
                })
                .await
            {
                println!(
                    "[ERROR]: Failed to send a message. Here's why:\n{:?}",
                    error
                );
            }
        }
    }

    async fn interaction_create(&self, context: Context, interaction: Interaction) {
        if let Interaction::ApplicationCommand(command) = interaction {
            if command.data.name == "restart" {
                let mut should_shut_down = false;

                command
                    .create_interaction_response(context, |response| {
                        response
                            .interaction_response_data(|message| {
                                if let Err(why) = Command::new("cargo").arg("run").spawn() {
                                    message
                                        .content(format!(
                                            "failed to restart sorry. error {:?}",
                                            why
                                        ))
                                        .ephemeral(true)
                                } else {
                                    should_shut_down = true;
                                    message.content("Restarting the bot").ephemeral(true)
                                }
                            })
                            .kind(InteractionResponseType::ChannelMessageWithSource)
                    })
                    .await
                    .expect("bozo failure");

                if should_shut_down {
                    std::process::exit(0);
                }
            }
        }
    }
}

#[tokio::main]
async fn main() {
    let token = std::fs::read_to_string("user/token.txt").expect("Failed to load the token file.");

    let intents =
        GatewayIntents::GUILDS | GatewayIntents::GUILD_MESSAGES | GatewayIntents::MESSAGE_CONTENT;

    let event_handler = EventHandler {
        bot: Mutex::new(Bot::default()),
    };

    let mut bot = Client::builder(&token, intents)
        .event_handler(event_handler)
        .await
        .expect("Failed to create the client. Perhaps the token wasn't valid?");

    bot.start().await.expect("Failed to start the bot.");
}
