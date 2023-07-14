package main

import (
	"fmt"
	"io/ioutil"
	"os"
	"os/signal"
	"strings"
	"syscall"

	"github.com/bwmarrin/discordgo"
)

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

    error = discord.Open()
    if error != nil {
        fmt.Fprintln(os.Stderr, "[ERROR]: Failed to open a connection to Discord. Error", error)
        return
    }

    defer discord.Close()

    signalChannel := make(chan os.Signal, 1)
    signal.Notify(signalChannel, syscall.SIGINT, syscall.SIGTERM, os.Interrupt)
    <-signalChannel
}
