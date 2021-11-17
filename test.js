function jello()
{
    let hejjo = false
    
    let hello = () =>
    {
        hejjo = true
    }
    
    hello()
    
    if (hejjo)
    {
        return
    }
    
    console.log("Hello, if you are seeing this, then we are doomed!");
}