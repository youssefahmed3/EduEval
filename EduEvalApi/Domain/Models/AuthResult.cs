namespace Domain.Models;

public class AuthResult {
    public string Token { get; set; }
    public bool Result { get; set; }
    public List<string> Errors { get; set; }


    public AuthResult() {
        Token ??= "";
        // Result ??= "";
        Errors = new List<string>();
    }
}