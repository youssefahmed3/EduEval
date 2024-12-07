using Shared.Dtos;
using AutoMapper;
using Domain.Models;
namespace Application.Mappers;
public class SubjectMappers : Profile
{
    public SubjectMappers()
    {
        // CreateMap<Subject, CreateSubjectDto>(); // Domain -> DTO
        CreateMap<CreateSubjectDto, Subject>()
            .ForMember(dest => dest.SubjectName, opt => opt.MapFrom(src => src.SubjectName))
            .ForMember(dest => dest.SubjectDescription, opt => opt.MapFrom(src => src.SubjectDescription))
            .ForMember(dest => dest.Id, opt => opt.Ignore()) // AutoMapper will skip this property
            .ForMember(dest => dest.Exams, opt => opt.Ignore()) // Skip Exams
            .ForMember(dest => dest.Questions, opt => opt.Ignore()); // Skip Questions
    }
}