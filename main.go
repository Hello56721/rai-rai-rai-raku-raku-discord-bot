package main

import (
	"bufio"
	"fmt"
	"io/ioutil"
	"os"
	"os/exec"
	"os/signal"
	"strings"
	"syscall"

	"github.com/bwmarrin/discordgo"
	"github.com/creack/pty"
)

var terminal *os.File
var terminalReady bool = false

func main() {
    token, error := ioutil.ReadFile("user/token.txt")
    if error != nil {
        fmt.Fprintln(os.Stderr, "[ERROR]: Failed to read the token file. Maybe it doesn't exist?")
        return
    }

    discord, error := discordgo.New("Bot " + strings.TrimSpace(string(token)))
    if error != nil {
        fmt.Fprintln(os.Stderr, "[ERROR]: Failed to login to Discord. Error:", error)
        return
    }

    discord.AddHandler(onReady)
    discord.AddHandler(onMessageCreate)
    discord.Identify.Intents = discordgo.IntentGuildMessages

    error = discord.Open()
    if error != nil {
        fmt.Fprintln(os.Stderr, "[ERROR]: Failed to open a connection to Discord. Error", error)
        return
    }

    defer discord.Close()

    signalChannel := make(chan os.Signal, 1)
    signal.Notify(signalChannel, syscall.SIGINT, syscall.SIGTERM, os.Interrupt)
    <-signalChannel

    terminal.Close()
}

func onReady(pSession *discordgo.Session, pReadyEvent *discordgo.Ready) {
    mainChannel := "1076539147327643689"

    command := exec.Command("./server.sh", "survival")

    var error error
    terminal, error = pty.Start(command)
    if error != nil {
        fmt.Fprintln(os.Stderr, "failed to open fake terminal bc of ", error)
        return
    }

    terminalReady = true

    scanner := bufio.NewScanner(terminal)

    for scanner.Scan() {
        pSession.ChannelMessageSend(mainChannel, "`" + scanner.Text() + "`")
    }
}

func onMessageCreate(pSession *discordgo.Session, pMessageCreateEvent *discordgo.MessageCreate) {
    mainChannel := "1076539147327643689"

    if terminalReady && pMessageCreateEvent.ChannelID == mainChannel && pSession.State.User.ID != pMessageCreateEvent.Author.ID {
        command := (pMessageCreateEvent.Content)
        n, error := terminal.WriteString(command + "\n")
        if error != nil {
            fmt.Fprintln(os.Stderr, "[ERROR]: ", error.Error())
            return
        }

        fmt.Printf("wrote %d characters\n", n)
    }
}
