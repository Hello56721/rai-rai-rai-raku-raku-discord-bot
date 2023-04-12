use scraper::Selector;
use serenity::client::Context;
use serenity::model::application::interaction::application_command::ApplicationCommandInteraction;
use serenity::model::application::interaction::application_command::CommandDataOptionValue;
use serenity::model::application::interaction::InteractionResponseType;
use serenity::Error;

use scraper::Html;

use std::process::Command;

use super::OWNER_ID;

async fn respond_with_content(
    context: Context,
    command: &ApplicationCommandInteraction,
    content: &str,
) -> Result<(), Error> {
    command
        .create_interaction_response(context, |response_data| {
            response_data.interaction_response_data(|response_data| response_data.content(content))
        })
        .await
}

pub async fn restart(context: Context, command: ApplicationCommandInteraction) {
    let (should_shut_down, response_content) = if command.user.id != OWNER_ID {
        (
            false,
            "sorry but i dont take orders from idiots like u".to_string(),
        )
    } else if let Err(why) = Command::new("cargo").arg("run").spawn() {
        (false, format!("failed to restart bot bc of {:?}", why))
    } else {
        (true, "restarting bot".to_string())
    };

    command
        .create_interaction_response(context, |response| {
            response
                .interaction_response_data(|message| {
                    if command.user.id == OWNER_ID {
                        message.content(response_content).ephemeral(true)
                    } else {
                        message.content(response_content).ephemeral(false) // for completeness
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

pub async fn shutdown(context: Context, command: ApplicationCommandInteraction) {
    let (should_shut_down, response_content) = if command.user.id != OWNER_ID {
        (
            false,
            "sorry but i dont take orders from idiots like u".to_string(),
        )
    } else {
        (true, "shutting down".to_string())
    };

    command
        .create_interaction_response(context, |response| {
            response
                .interaction_response_data(|message| {
                    if command.user.id == OWNER_ID {
                        message.content(response_content).ephemeral(true)
                    } else {
                        message.content(response_content).ephemeral(false) // for completeness
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

pub async fn dm(context: Context, command: ApplicationCommandInteraction) {
    let user = command
        .data
        .options
        .get(0)
        .unwrap()
        .resolved
        .as_ref()
        .unwrap();
    let message = command
        .data
        .options
        .get(1)
        .unwrap()
        .resolved
        .as_ref()
        .unwrap();

    if let CommandDataOptionValue::User(user, _member) = user {
        if let CommandDataOptionValue::String(message) = message {
            let response = async {
                let dm_channel = user.create_dm_channel(context.clone()).await;

                if let Err(_) = dm_channel {
                    format!("cant dm {} :pouting_cat:", user.name)
                } else if let Ok(dm_channel) = dm_channel {
                    let result = dm_channel
                        .send_message(context.clone(), |msg| msg.content(message))
                        .await;

                    if let Err(_) = result {
                        format!("cant dm {} :pouting_cat:", user.name)
                    } else {
                        "done <:can_pooper:1079210431471681700>".to_string()
                    }
                } else {
                    String::new()
                }
            }
            .await;

            let result = command
                .create_interaction_response(context, |response_data| {
                    response_data
                        .interaction_response_data(|response_data| response_data.content(response))
                })
                .await;

            if let Err(error) = result {
                eprintln!("[ERROR]: Failed to respond to DM command: {:?}", error);
            }
        }
    }
}

pub async fn ghostping(context: Context, command: ApplicationCommandInteraction) {
    let user = command.data.options[0].resolved.as_ref().unwrap();

    let (response, ephemeral) = async {
        if let CommandDataOptionValue::User(user, _member) = user {
            let result = command
                .channel_id
                .send_message(context.clone(), |message| {
                    message.content(format!("<@{}>", user.id.0))
                })
                .await;

            match result {
                Err(_) => (format!("<@{}>", user.id.0), false),
                Ok(message) => {
                    if let Err(error) = message.delete(context.clone()).await {
                        eprintln!(
                            "[ERROR]: Failed to delete a message. Here's why:\n{:?}",
                            error
                        );
                    }

                    ("ok boomer".to_string(), true)
                }
            }
        } else {
            (
                "u need to tell me who 2 ghostping dumbass".to_string(),
                false,
            )
        }
    }
    .await;

    let result = command
        .create_interaction_response(context.clone(), |response_data| {
            response_data.interaction_response_data(|response_data| {
                response_data.content(&response).ephemeral(ephemeral)
            })
        })
        .await;

    if let Err(error) = result {
        eprintln!(
            "[ERROR]: Failed to respond to ghostping command. Here's why:\n{:?}",
            error
        );
    }
}

pub async fn youtube(context: Context, command: ApplicationCommandInteraction) {
    let response = reqwest::get("https://petittube.com/index.php").await;
    if response.is_err() {
        let result =
            respond_with_content(context.clone(), &command, "sorry something went wrong").await;

        if let Err(error) = result {
            eprintln!(
                "[ERROR]: Failed to respond to youtube command. Here's why:\n{:?}",
                error
            );
        }

        return;
    }
    let response = response.unwrap();
    let html = response.text().await.unwrap();

    let result = command
        .create_interaction_response(context, |response_data| {
            response_data.interaction_response_data(|response_data| {
                let document = Html::parse_document(&html);
                let selector = Selector::parse("iframe").unwrap();
                let iframe = document
                    .select(&selector)
                    .find(|iframe| {
                        if let Some(src) = iframe.value().attr("src") {
                            src.starts_with("https://www.youtube.com/embed/")
                        } else {
                            false
                        }
                    })
                    .unwrap()
                    .value();

                let url = iframe.attr("src").unwrap();

                response_data.content(url)
            })
        })
        .await;

    if let Err(error) = result {
        eprintln!(
            "[ERROR]: Failed to respond to youtube command. Here's why:\n{:?}",
            error
        );
    }
}
