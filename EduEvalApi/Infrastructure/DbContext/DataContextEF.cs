using Domain.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.DbContext;

public class DataContextEF : IdentityDbContext<User, IdentityRole, string>
{

    public DataContextEF(DbContextOptions<DataContextEF> options) : base(options) { }

    public virtual DbSet<Subject>? Subjects { get; set; }
    public virtual DbSet<QuestionLibrary>? QuestionsLibrary { get; set; }
    public virtual DbSet<QuestionChoices>? Choices { get; set; }
    public virtual DbSet<Exam>? Exams { get; set; }
    public virtual DbSet<StudentExams>? StudentExams { get; set; }



    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Call the base method to configure Identity entities
        base.OnModelCreating(modelBuilder);

        // One To Many Relationship (QuestionLibrary -- QuestionChoices)
        modelBuilder.Entity<QuestionChoices>()
            .HasOne(c => c.QuestionLibrary)
            .WithMany(q => q.Choices)
            .HasForeignKey(c => c.QuestionId)
            .OnDelete(DeleteBehavior.Cascade); // Cascade delete to remove choices when a question is deleted

        // One To Many Relationship (Subject -- Exams)
        modelBuilder.Entity<Exam>()
            .HasOne(e => e.Subject)
            .WithMany(s => s.Exams)
            .HasForeignKey(e => e.SubjectId)
            .OnDelete(DeleteBehavior.Cascade); // Cascade delete to remove choices when a question is deleted

        // One To Many Relationship (subject -- Questions)
        modelBuilder.Entity<QuestionLibrary>()
            .HasOne(q => q.Subject)
            .WithMany(s => s.Questions)
            .HasForeignKey(q => q.SubjectId)
            .OnDelete(DeleteBehavior.Cascade);

        // Many To Many Relationship (student --- Exam)
        modelBuilder.Entity<StudentExams>()
            .HasKey(se => new {se.StudentId, se.ExamId});

        modelBuilder.Entity<StudentExams>()
            .HasOne(se => se.Student)
            .WithMany(s => s.StudentsExams)
            .HasForeignKey(se => se.StudentId)
            .OnDelete(DeleteBehavior.NoAction);

        modelBuilder.Entity<StudentExams>()
            .HasOne(se => se.Exam)
            .WithMany(e => e.StudentsExams)
            .HasForeignKey(se => se.ExamId)
            .OnDelete(DeleteBehavior.NoAction);


        // Many To Many Relationship (Exam --- Question)

        modelBuilder.Entity<ExamQuestions>()
            .HasKey(eq => new {eq.ExamId, eq.QuestionId});
            
        modelBuilder.Entity<ExamQuestions>()
            .HasOne(eq => eq.Exam)
            .WithMany(e => e.ExamQuestions)
            .HasForeignKey(eq => eq.ExamId)
            .OnDelete(DeleteBehavior.NoAction);
            
        modelBuilder.Entity<ExamQuestions>()
            .HasOne(eq => eq.QuestionsLibrary)
            .WithMany(q => q.ExamQuestions)
            .HasForeignKey(eq => eq.QuestionId)
            .OnDelete(DeleteBehavior.NoAction);


    }
}