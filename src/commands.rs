use serenity::builder::CreateInteractionResponseData;

use std::process::Command;

pub async fn restart_bot<'a>(response: &'a mut CreateInteractionResponseData<'a>) -> &'a mut CreateInteractionResponseData {
    if let Err(error) = Command::new("cargo").arg("run").spawn() {
        response.content(format!("sorry failed to restart bc of {:?}", error))
    } else {
        response.content("restarting bot")
    }
}
