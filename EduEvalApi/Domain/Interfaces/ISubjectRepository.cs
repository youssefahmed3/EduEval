
using Shared.Dtos;
using Domain.Models;

namespace Domain.Interfaces;

public interface ISubjectRepository : IBaseRepository {
     public  Task<IEnumerable<Subject>> GetAllSubjects();
     public  Task<Subject> GetSingleSubject(int subjectId);
}