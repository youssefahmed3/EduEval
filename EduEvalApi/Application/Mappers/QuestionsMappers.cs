using Shared.Dtos;
using AutoMapper;
using Domain.Models;
namespace Application.Mappers;
public class QuestionMappers : Profile
{
    public QuestionMappers()
    {
         // Mapping for CreateQuestionDto -> QuestionLibrary
        CreateMap<CreateQuestionDto, QuestionLibrary>()
            .ForMember(dest => dest.Difficulty, opt => opt.MapFrom(src => src.Difficulty))
            .ForMember(dest => dest.QuestionText, opt => opt.MapFrom(src => src.QuestionText))
            .ForMember(dest => dest.SubjectId, opt => opt.MapFrom(src => src.SubjectId))
            .ForMember(dest => dest.Choices, opt => opt.MapFrom(src => src.Choices))
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.Subject, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.ExamQuestions, opt => opt.Ignore());

        // Mapping for CreateChoiceDto -> QuestionChoices
        CreateMap<CreateChoiceDto, QuestionChoices>()
            .ForMember(dest => dest.ChoiceText, opt => opt.MapFrom(src => src.ChoiceText))
            .ForMember(dest => dest.IsCorrect, opt => opt.MapFrom(src => src.IsCorrect))
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.QuestionId, opt => opt.Ignore())
            .ForMember(dest => dest.QuestionLibrary, opt => opt.Ignore());
    }
}