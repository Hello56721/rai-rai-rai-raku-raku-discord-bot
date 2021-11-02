#!/usr/bin/python3
import discord
import random
import time
import sys

tokenFile = open("token.txt")
token = tokenFile.read()

spam = False

charset = "jN2curS8H8ywvvBWnewPWyYnKTcDhYKJf1WMyzitUuBpZDVtqQ9K7HjsUdlXeD8kda08QPJ0HPrDzx7iwwtAaAGSg5eeN22pctNZA5qrHEd8FsomXM38qvHQXYLVTUqGyKEcwUjtFx7VNeIyHQ7WUNZmwCnfDiQjGnSo7ZDDA7lO1UHD25H1zki8BXyj89RMvGkRYOQV3EPO97pumRUfaq6UGdnpujZoD0tVarNPOGFJLbgDKv0znjRDr5cF9nw"

channel_id = 0

my_client = discord.Client()

async def process_commands():
    print("[INFO]: The bot is now acting as a mouthpiece")
    await my_client.wait_until_ready()
    while not my_client.is_closed():
        command = input(">")
        if command == "stop":
            print("Stopping the bot.")
            await my_client.close()
            break
        if command.startswith("send"):
            global channel_id
            channel = my_client.get_channel(channel_id)
            await channel.send(command.split("#|")[1])
        if command.startswith("set_channel"):
            channel_id = int(command.split(" ")[1])
        #end
    #end
#end

@my_client.event
async def on_ready():
    print(f"The bot have logged in as {my_client}")
    
    if len(sys.argv) > 1:
        if sys.argv[1] == "remote":
            my_client.loop.create_task(process_commands())
        else:
            print("[INFO]: The bot is now operating without remote control.")
    else:
        print("[INFO]: The bot is now operating without remote control.")
#end

@my_client.event
async def on_message(message: discord.Message):
    if message.author == my_client.user:
        return
    #end
    
    if message.author.id == 650439182204010496 or message.author.id == 690265771955585029:
        command = message.content
        if command.startswith("$$$send"):
            global channel_id
            channel = my_client.get_channel(channel_id)
            await channel.send(command.split("#|")[1])
        if command.startswith("$$$set_channel"):
            channel_id = int(command.split(" ")[1])
        if command.startswith("$$$reply"):
            channel = my_client.get_channel(channel_id)
            replyMessage = await channel.fetch_message(int(command.split(" ")[1]))
            sendMessage = command.split("#|")[1]
            await replyMessage.reply(sendMessage)
        #end
    #end

    if message.content.startswith("$$$stop_spamming$$$"):
        global spam
        spam = False
    #end

    if message.content.startswith("$$$start_spamming$$$"):
        try:
            prefix = message.content.split(" ")[1]
        except:
            prefix = ""
        #end
        
        try:
            send_message = message.content.split("||")[1]
            prefix = ""
        except:
            send_message = ""
            for i in range(0, 50):
                char = random.choice(charset)
                send_message = send_message + char
            #end
        #end
        
        try:
            delay = float(message.content.split("||")[2])
        except:
            delay = 1
        #end
        
        spam = True
        while spam:
            await message.channel.send(prefix + " " + send_message)
            time.sleep(delay)
        #end
    #end
#end

my_client.run(token)
