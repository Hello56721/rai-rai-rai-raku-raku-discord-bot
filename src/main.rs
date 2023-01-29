use serenity::{
    client::{Client, Context, EventHandler as DiscordEventHandler},
    model::{
        application::interaction::Interaction, channel::Message, gateway::Ready, id::UserId,
        prelude::command::CommandOptionType,
    },
    prelude::GatewayIntents,
};

use tokio::sync::Mutex;

mod commands;

const OWNER_ID: u64 = 650439182204010496;

#[derive(Default)]
struct Bot {
    id: UserId,
}

struct EventHandler {
    bot: Mutex<Bot>,
}

#[serenity::async_trait]
impl DiscordEventHandler for EventHandler {
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

    async fn ready(&self, context: Context, ready: Ready) {
        println!("[INFO]: The bot has logged on as {}", ready.user.name);

        let mut bot = self.bot.lock().await;
        bot.id = ready.user.id;

        context.set_activity(serenity::model::gateway::Activity::listening(
            "bullshit :joy_cat:",
        )).await;

        for guild in ready.user.guilds(context.clone()).await.unwrap() {
            println!("[INFO]: Adding commands for {}", guild.name);
            guild
                .id
                .set_application_commands(context.clone(), |commands| {
                    commands
                        .create_application_command(|command| {
                            command
                                .name("restart")
                                .description("Restarts the bot. Can only be used by developer.")
                        })
                        .create_application_command(|command| {
                            command
                                .name("dm")
                                .description("DMs somebody. duh.")
                                .create_option(|option| {
                                    option
                                        .name("member")
                                        .description("The member that you want to DM")
                                        .kind(CommandOptionType::User)
                                        .required(true)
                                })
                                .create_option(|option| {
                                    option
                                        .name("message")
                                        .description(
                                            "The message that you want to DM to that person.",
                                        )
                                        .kind(CommandOptionType::String)
                                        .required(true)
                                })
                        })
                })
                .await
                .expect("Failed to register application commands for main server.");
        }
    }

    async fn interaction_create(&self, context: Context, interaction: Interaction) {
        if let Interaction::ApplicationCommand(command) = interaction {
            match command.data.name.as_str() {
                "restart" => commands::restart(context, command).await,
                "dm" => commands::dm(context, command).await,
                &_ => todo!(),
            };
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
