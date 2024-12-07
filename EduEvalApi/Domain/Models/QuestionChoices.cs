
using System.Text.Json.Serialization;

namespace Domain.Models;

public class QuestionChoices {
    public required int Id { get; set; } // primary Key
    public required int QuestionId { get; set; } // Forign Key
    public required string ChoiceText { get; set; } // Forign Key
    public required bool IsCorrect { get; set; } // Forign Key
    
    [JsonIgnore]
    public QuestionLibrary QuestionLibrary { get; set; }
}