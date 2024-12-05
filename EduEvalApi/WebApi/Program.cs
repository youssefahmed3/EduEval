using System.Text;
using Domain.Interfaces;
using Domain.Models;
using Infrastructure.DbContext;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Infrastructure.Repositories;
using Infrastructure.Seeds;

var builder = WebApplication.CreateBuilder(args);



// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Cors Policies For Accessing The API
builder.Services.AddCors((options) => {
    options.AddPolicy("DevCors", (corsBuilder) => {
        corsBuilder.WithOrigins("http://localhost:4200", "http://localhost:3000", "http://localhost:8000")
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials();
    });

    options.AddPolicy("ProdCors", (corsBuilder) => {
        corsBuilder.WithOrigins("https://myProductionSite.com")
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials();
    });
});

builder.Services.AddControllers();


// Token Validation Process  
string? tokenKeyString = builder.Configuration.GetSection("AppSettings:Secret").Value;

SymmetricSecurityKey tokenyKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
    tokenKeyString ?? ""
));

TokenValidationParameters tokenValidationParameters = new TokenValidationParameters()
{
    IssuerSigningKey = tokenyKey,
    ValidateIssuer = false,
    ValidateIssuerSigningKey = true,
    ValidateAudience = false
};

builder.Services.AddAuthentication(option => {
    option.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    option.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
    option.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;

})
.AddJwtBearer(jwt => {
    byte[] key = Encoding.ASCII.GetBytes(builder.Configuration.GetSection("AppSettings:Secret").Value ?? "");
    jwt.SaveToken = true;
    jwt.TokenValidationParameters = new TokenValidationParameters(){
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
        
    };
});

// Adding The Database Connection to the service
builder.Services.AddDbContext<DataContextEF>(options => {
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"),
        optionsBuilder => optionsBuilder.EnableRetryOnFailure()
    );
});

// Adding The Api Endpoints to The Project and telling the Identity THat we will use DataCOntextEf To Create and control the User 
builder.Services.AddIdentity<User, IdentityRole>()
    .AddEntityFrameworkStores<DataContextEF>()
    .AddDefaultTokenProviders();

builder.Services.AddAuthorization();

builder.Services.AddScoped<IAuthRepository, AuthRepository>();
/* builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<ICategoryRepsoitory, CategoryRepsoitory>(); */

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("Admin", policy => policy.RequireRole("Admin"));
    options.AddPolicy("Student", policy => policy.RequireRole("Student"));
});


var app = builder.Build();


// Configure the HTTP request pipeline.

// Seed roles
using (var scope = app.Services.CreateScope())
{
    var serviceProvider = scope.ServiceProvider;
    await RoleSeeder.SeedRolesAsync(serviceProvider);
}

if (app.Environment.IsDevelopment())
{
    app.UseCors("DevCors");
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseCors("ProdCors");
    app.UseHttpsRedirection();
}


app.UseAuthentication();
app.UseAuthorization();


app.MapControllers();

app.Run();
