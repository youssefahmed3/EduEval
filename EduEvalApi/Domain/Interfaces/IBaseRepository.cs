namespace Domain.Interfaces;

public interface IBaseRepository
{
    public void AddEntity<T>(T entityToAdd);
    public void RemoveEntity<T>(T entityToRemove);
    public bool SaveChanges();
}