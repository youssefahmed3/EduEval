using Shared.Dtos;
using AutoMapper;
using Domain.Models;
namespace Application.Mappers;
public class ExamMappers : Profile
{
    public ExamMappers()
    {
        // CreateMap<Subject, CreateSubjectDto>(); // Domain -> DTO
        CreateMap<ExamToCreateDto, Exam>()
            .ForMember(dest => dest.ExamTitle, opt => opt.MapFrom(src => src.ExamTitle))
            .ForMember(dest => dest.Duration, opt => opt.MapFrom(src => src.Duration))
            .ForMember(dest => dest.SubjectId, opt => opt.MapFrom(src => src.SubjectId))
            // .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.CreatedAt))
            .ForMember(dest => dest.Id, opt => opt.Ignore()) // AutoMapper will skip this property
            .ForMember(dest => dest.Subject, opt => opt.Ignore()) // AutoMapper will skip this property
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore()) // AutoMapper will skip this property
            .ForMember(dest => dest.ExamQuestions, opt => opt.Ignore()) // Skip Exams
            .ForMember(dest => dest.StudentsExams, opt => opt.Ignore()); // Skip Questions
    }
}