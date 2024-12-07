using Shared.Dtos;
using AutoMapper;
using Domain.Models;
namespace Application.Mappers;
public class UserMappers : Profile
{
    public UserMappers()
    {
        // Map User to UserProfileDto
        CreateMap<User, UserProfileDto>()
            .ForMember(dest => dest.FirstName, opt => opt.MapFrom(src => src.FirstName))
            .ForMember(dest => dest.LastName, opt => opt.MapFrom(src => src.LastName))
            .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => $"{src.FirstName} {src.LastName}"))
            .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => src.IsActive))
            .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
            .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.UserName))
            .ForMember(dest => dest.Role, opt => opt.MapFrom(src => src.Role));
    }
}
