using Microsoft.EntityFrameworkCore;
using OilCollectionScheme.Application.Services;
using OilCollectionScheme.Core.Abstracts.Repositories;
using OilCollectionScheme.Core.Abstracts.Services;
using OilCollectionScheme.DataAccess;
using OilCollectionScheme.DataAccess.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<DbOilCollectionContext>(
    options => 
    {
        options.UseNpgsql(builder.Configuration.GetConnectionString(nameof(OilCollectionSchemeDbContext)));
    }
);

//Services
builder.Services.AddScoped<IEmployeesService, EmployeesService>();
builder.Services.AddScoped<ISchemesService, SchemesService>();
builder.Services.AddScoped<IWellsService, WellsService>();
builder.Services.AddScoped<IMeteringStationsService, MeteringStationsService>();
builder.Services.AddScoped<IPumpingStationsService, PumpingStationsService>();
builder.Services.AddScoped<IStorageTanksService, StorageTanksService>();
builder.Services.AddScoped<IPipesService, PipesService>();

//Repositories
builder.Services.AddScoped<IEmployeesRepository, EmployeesRepository>();
builder.Services.AddScoped<ISchemesRepository, SchemesRepository>();
builder.Services.AddScoped<IWellsRepository, WellsRepository>();
builder.Services.AddScoped<IMeteringStationsRepository, MeteringStationsRepository>();
builder.Services.AddScoped<IPumpingStationsRepository, PumpingStationsRepository>();
builder.Services.AddScoped<IStorageTanksRepository, StorageTanksRepository>();
builder.Services.AddScoped<IPipesRepository, PipesRepository>();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins(["http://localhost:3000"]);
        policy.AllowAnyHeader();
        policy.AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.UseCors();
app.MapControllers();

app.Run();
