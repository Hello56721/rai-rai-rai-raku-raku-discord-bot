use serenity::client::Context;
use serenity::model::application::interaction::application_command::ApplicationCommandInteraction;
use serenity::model::application::interaction::InteractionResponseType;

use std::process::Command;

pub async fn restart(context: Context, command: ApplicationCommandInteraction) {
    let (should_shut_down, response_content) =
        if let Err(why) = Command::new("cargo").arg("run").spawn() {
            (false, format!("failed to restart bot bc of {:?}", why))
        } else {
            (true, "restarting bot".to_string())
        };

    command
        .create_interaction_response(context, |response| {
            response
                .interaction_response_data(|message| {
                    message.content(response_content).ephemeral(true)
                })
                .kind(InteractionResponseType::ChannelMessageWithSource)
        })
        .await
        .expect("bozo failure");

    if should_shut_down {
        std::process::exit(0);
    }
}
