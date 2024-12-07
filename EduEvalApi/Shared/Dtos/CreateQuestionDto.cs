namespace Shared.Dtos;
public class CreateQuestionDto
{
    public string QuestionText { get; set; }
    public string Difficulty { get; set; }
    public int SubjectId { get; set; }
    public List<CreateChoiceDto> Choices { get; set; } = new List<CreateChoiceDto>();
}
